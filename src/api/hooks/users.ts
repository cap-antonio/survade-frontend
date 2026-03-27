import { useQuery } from "@tanstack/react-query"
import { api } from "../client"
import { CACHE_KEYS } from "../CACHE_KEYS"
import { TQueryProps } from "@/api/hooks/api.types"

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
