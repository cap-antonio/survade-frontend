import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "../client"
import { CACHE_KEYS } from "../CACHE_KEYS"
import { queryClient } from "../query"
import { ApiParams, TQueryProps } from "@/api/hooks/api.types"
import type {
  ClassicLeaderboardEntry,
  SaboteurLeaderboardEntry,
} from "@/api/services"
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

export const useClassicLeaderboard = (
  payload: ApiParams<typeof api.users.leaderboardClassicApiLeaderboardClassicGet> = {},
  options?: TQueryProps<ClassicLeaderboardEntry[]>,
) =>
  useQuery({
    queryKey: [...CACHE_KEYS.leaderboard.classic, payload],
    queryFn: ({ signal }) => {
      const promise = api.users.leaderboardClassicApiLeaderboardClassicGet(
        payload,
      )

      signal?.addEventListener("abort", () => {
        promise.cancel()
      })

      return promise
    },
    ...options,
  })

export const useSaboteurLeaderboard = (
  payload: ApiParams<typeof api.users.leaderboardSaboteurApiLeaderboardSaboteurGet> = {},
  options?: TQueryProps<SaboteurLeaderboardEntry[]>,
) =>
  useQuery({
    queryKey: [...CACHE_KEYS.leaderboard.saboteur, payload],
    queryFn: ({ signal }) => {
      const promise = api.users.leaderboardSaboteurApiLeaderboardSaboteurGet(
        payload,
      )

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
