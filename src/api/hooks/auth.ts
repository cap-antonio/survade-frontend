import { useMutation } from "@tanstack/react-query"
import { api } from "../client"
import { ApiParams } from "@/api/hooks/api.types"
import { useAuthStore } from "@/stores/authStore"

export const useRegister = () => {
  const { setTokens } = useAuthStore()

  const mutation = useMutation({
    mutationFn: async (
      payload: ApiParams<typeof api.auth.registerApiAuthRegisterPost>,
    ) => {
      return await api.auth.registerApiAuthRegisterPost(payload)
    },
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token)
    },

    mutationKey: ["register"],
  })

  return {
    ...mutation,
    register: mutation.mutate,
  }
}

export const useLogin = () => {
  const { setTokens } = useAuthStore()

  const mutation = useMutation({
    mutationFn: async (
      payload: ApiParams<typeof api.auth.loginApiAuthLoginPost>,
    ) => {
      return await api.auth.loginApiAuthLoginPost(payload)
    },
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token)
    },

    mutationKey: ["login"],
  })

  return {
    ...mutation,
    login: mutation.mutate,
  }
}

export const useLogout = () => {
  const { clear, refreshToken } = useAuthStore()

  const mutation = useMutation({
    mutationFn: async () => {
      // Use the stored refresh_token if no payload provided
      const body = {
        requestBody: { refresh_token: refreshToken ?? "" },
      }
      return await api.auth.logoutApiAuthLogoutPost(body)
    },
    onSettled: () => {
      // Always clear the store — even if the server call fails
      clear()
    },

    mutationKey: ["logout"],
  })

  return {
    ...mutation,
    logout: mutation.mutate,
  }
}
