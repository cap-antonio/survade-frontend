import { create } from "zustand"

type AuthStore = {
  accessToken: string | null
  refreshToken: string | null
  setTokens: (accessToken: string, refreshToken: string) => void
  setAccessToken: (accessToken: string) => void
  clear: () => void
  isAuth: boolean
}

const AUTH_SESSION_STORAGE_KEY = "auth_tokens"

const readTokensFromSessionStorage = () => {
  if (typeof window === "undefined") {
    return { accessToken: null, refreshToken: null }
  }

  try {
    const raw = window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY)
    if (!raw) {
      return { accessToken: null, refreshToken: null }
    }

    const parsed = JSON.parse(raw) as {
      accessToken?: string | null
      refreshToken?: string | null
    }

    return {
      accessToken: parsed.accessToken ?? null,
      refreshToken: parsed.refreshToken ?? null,
    }
  } catch {
    return { accessToken: null, refreshToken: null }
  }
}

const writeTokensToSessionStorage = (
  accessToken: string | null,
  refreshToken: string | null,
) => {
  if (typeof window === "undefined") {
    return
  }

  try {
    if (!accessToken && !refreshToken) {
      window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
      return
    }

    window.sessionStorage.setItem(
      AUTH_SESSION_STORAGE_KEY,
      JSON.stringify({ accessToken, refreshToken }),
    )
  } catch {
    // Ignore storage failures so auth flow still works in restricted browsers.
  }
}

const initialTokens = readTokensFromSessionStorage()

export const useAuthStore = create<AuthStore>((set, get) => ({
  accessToken: initialTokens.accessToken,
  refreshToken: initialTokens.refreshToken,
  isAuth: !!initialTokens.accessToken,

  setTokens: (accessToken, refreshToken) =>
    set(() => {
      writeTokensToSessionStorage(accessToken, refreshToken)
      return { accessToken, refreshToken, isAuth: true }
    }),

  setAccessToken: (accessToken) =>
    set(() => {
      const refreshToken = get().refreshToken
      writeTokensToSessionStorage(accessToken, refreshToken)
      return { accessToken, isAuth: true }
    }),

  clear: () =>
    set(() => {
      writeTokensToSessionStorage(null, null)
      return { accessToken: null, refreshToken: null, isAuth: false }
    }),
}))
