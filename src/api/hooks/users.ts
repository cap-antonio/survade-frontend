import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "../client"
import { CACHE_KEYS } from "../CACHE_KEYS"
import { queryClient } from "../query"
import { ApiParams, TQueryProps } from "@/api/hooks/api.types"
import { useAuthStore } from "@/stores/authStore"

export const useMe = (options?: TQueryProps<any>) =>
  useQuery({
    queryKey: CACHE_KEYS.user.profile,
    queryFn: ({ signal }) => {
      const promise = api.users.getMeApiUsersMeGet()

      signal?.addEventListener("abort", () => {
        promise.cancel()
      })

      return promise
    },
    ...options,
  })

export const useDeleteAccount = () => {
  const { clear } = useAuthStore()

  const mutation = useMutation({
    mutationFn: async (
      payload: ApiParams<typeof api.users.deleteMeApiUsersMeDelete>,
    ) => {
      return await api.users.deleteMeApiUsersMeDelete(payload)
    },
    onSuccess: () => {
      clear()
      queryClient.removeQueries({ queryKey: CACHE_KEYS.user.profile })
    },
    mutationKey: ["deleteAccount"],
  })

  return {
    ...mutation,
    deleteAccount: mutation.mutate,
  }
}
