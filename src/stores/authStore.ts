import { create } from "zustand"

type AuthStore = {
  accessToken: string | null
  refreshToken: string | null
  setTokens: (accessToken: string, refreshToken: string) => void
  setAccessToken: (accessToken: string) => void
  clear: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  refreshToken: null,

  setTokens: (accessToken, refreshToken) =>
    set({ accessToken, refreshToken }),

  setAccessToken: (accessToken) =>
    set({ accessToken }),

  clear: () =>
    set({ accessToken: null, refreshToken: null }),
}))
