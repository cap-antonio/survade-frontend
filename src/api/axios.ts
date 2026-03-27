import axios, { AxiosError } from "axios"
import { useAuthStore } from "@/stores/authStore"

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export const axiosAPI = axios.create({
  baseURL: API_BASE,
})

// ─── Request interceptor ────────────────────────────────────────────────────
// Attach the current access token to every request.
axiosAPI.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Token refresh logic ─────────────────────────────────────────────────────
// A single in-flight refresh promise shared across all concurrent 401 retries.
// This prevents multiple parallel refresh requests when several calls fail at once.
let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const { refreshToken, setAccessToken, clear } = useAuthStore.getState()

  if (!refreshToken) {
    clear()
    return Promise.reject(new Error("No refresh token"))
  }

  try {
    // Use a plain axios call (not axiosAPI) to skip the response interceptor
    // and avoid an infinite 401 retry loop.
    const response = await axios.post<{ access_token: string }>(
      `${API_BASE}/api/auth/refresh`,
      { refresh_token: refreshToken },
    )
    const newAccessToken = response.data.access_token
    setAccessToken(newAccessToken)
    return newAccessToken
  } catch {
    clear()
    return Promise.reject(new Error("Token refresh failed"))
  }
}

// ─── Response interceptor ────────────────────────────────────────────────────
// On 401, attempt a single token refresh then replay the original request.
axiosAPI.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error)
    }

    // Prevent retrying the refresh endpoint itself
    if (originalRequest.url?.includes("/api/auth/refresh")) {
      useAuthStore.getState().clear()
      return Promise.reject(error)
    }

    try {
      // Deduplicate: reuse the same promise if a refresh is already in flight
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null
      })

      const newToken = await refreshPromise
      originalRequest.headers.Authorization = `Bearer ${newToken}`
      return axiosAPI(originalRequest)
    } catch {
      return Promise.reject(error)
    }
  },
)
