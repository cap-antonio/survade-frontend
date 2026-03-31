import { useQuery, useMutation } from "@tanstack/react-query"
import { api } from "../client"
import { queryClient } from "../query"
import { CACHE_KEYS } from "../CACHE_KEYS"

import { ApiParams, TQueryProps } from "@/api/hooks/api.types"
import type {
  GameHistoryDetailResponse,
  GameHistorySummary,
  GameStateResponse,
} from "@/api/services"

export const useGameQuery = (
  payload: ApiParams<typeof api.games.getGameApiGamesGameCodeGet>,
  options?: TQueryProps<GameStateResponse>,
) =>
  useQuery({
    queryKey: [...CACHE_KEYS.game.detail, payload],

    queryFn: ({ signal }) => {
      const promise = api.games.getGameApiGamesGameCodeGet(payload)

      signal?.addEventListener("abort", () => {
        promise.cancel()
      })

      return promise
    },
    ...options,
  })

export const useGameHistory = (
  payload: ApiParams<typeof api.games.getHistoryDetailApiGamesHistoryGameIdGet>,
  options?: TQueryProps<GameHistoryDetailResponse>,
) =>
  useQuery({
    queryKey: [...CACHE_KEYS.game.history, payload],
    queryFn: ({ signal }) => {
      const promise =
        api.games.getHistoryDetailApiGamesHistoryGameIdGet(payload)

      signal?.addEventListener("abort", () => {
        promise.cancel()
      })

      return promise
    },
    ...options,
  })

export const useGameHistoryList = (
  options?: TQueryProps<GameHistorySummary[]>,
) =>
  useQuery({
    queryKey: CACHE_KEYS.game.historyList,
    queryFn: ({ signal }) => {
      const promise = api.games.listGameHistoriesApiGamesHistoryGet()

      signal?.addEventListener("abort", () => {
        promise.cancel()
      })

      return promise
    },
    ...options,
  })

export const useCreateGame = () => {
  const mutation = useMutation({
    mutationFn: async (
      payload: ApiParams<typeof api.games.createGameApiGamesPost>,
    ) => {
      return await api.games.createGameApiGamesPost(payload)
    },

    mutationKey: ["createGame"],
  })

  return {
    ...mutation,
    createGame: mutation.mutate,
  }
}

export const useJoinGame = () => {
  const mutation = useMutation({
    mutationFn: async (
      payload: ApiParams<typeof api.games.joinGameApiGamesGameCodeJoinPost>,
    ) => {
      return await api.games.joinGameApiGamesGameCodeJoinPost(payload)
    },

    mutationKey: ["joinGame"],
  })

  return {
    ...mutation,
    joinGame: mutation.mutate,
  }
}
export const useAbondonGame = () => {
  const mutation = useMutation({
    mutationFn: async (
      payload: ApiParams<
        typeof api.games.abandonGameApiGamesGameCodeAbandonPost
      >,
    ) => {
      return await api.games.abandonGameApiGamesGameCodeAbandonPost(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.game.detail })
    },

    mutationKey: ["abondonGame"],
  })

  return {
    ...mutation,
    abondonGame: mutation.mutate,
  }
}

export const useStartGame = () => {
  const mutation = useMutation({
    mutationFn: async (
      payload: ApiParams<typeof api.games.startGameApiGamesGameCodeStartPost>,
    ) => {
      return await api.games.startGameApiGamesGameCodeStartPost(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.game.detail })
    },

    mutationKey: ["startGame"],
  })

  return {
    ...mutation,
    startGame: mutation.mutate,
  }
}

export const useFillBots = () => {
  const mutation = useMutation({
    mutationFn: async (
      payload: ApiParams<typeof api.games.fillBotsApiGamesGameCodeFillBotsPost>,
    ) => {
      return await api.games.fillBotsApiGamesGameCodeFillBotsPost(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.game.detail })
    },

    mutationKey: ["fillBots"],
  })

  return {
    ...mutation,
    fillBots: mutation.mutate,
  }
}

export const useRevealCard = () => {
  const mutation = useMutation({
    mutationFn: async (
      payload: ApiParams<
        typeof api.games.revealCardApiGamesGameCodeRevealCardPost
      >,
    ) => {
      return await api.games.revealCardApiGamesGameCodeRevealCardPost(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.game.detail })
    },

    mutationKey: ["revealCard"],
  })

  return {
    ...mutation,
    revealCard: mutation.mutate,
  }
}

export const useUsePower = () => {
  const mutation = useMutation({
    mutationFn: async (
      payload: ApiParams<typeof api.games.usePowerApiGamesGameCodeUsePowerPost>,
    ) => {
      return await api.games.usePowerApiGamesGameCodeUsePowerPost(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.game.detail })
    },

    mutationKey: ["usePower"],
  })

  return {
    ...mutation,
    usePower: mutation.mutate,
  }
}

export const useVote = () => {
  const mutation = useMutation({
    mutationFn: async (
      payload: ApiParams<typeof api.games.castVoteApiGamesGameCodeVotePost>,
    ) => {
      return await api.games.castVoteApiGamesGameCodeVotePost(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.game.detail })
    },

    mutationKey: ["vote"],
  })

  return {
    ...mutation,
    vote: mutation.mutate,
  }
}

export const useEndVoting = () => {
  const mutation = useMutation({
    mutationFn: async (
      payload: ApiParams<
        typeof api.games.endVotingApiGamesGameCodeEndVotingPost
      >,
    ) => {
      return await api.games.endVotingApiGamesGameCodeEndVotingPost(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.game.detail })
    },

    mutationKey: ["endVoting"],
  })

  return {
    ...mutation,
    endVoting: mutation.mutate,
  }
}
export const useStartVoting = () => {
  const mutation = useMutation({
    mutationFn: async (
      payload: ApiParams<
        typeof api.games.startVotingApiGamesGameCodeStartVotingPost
      >,
    ) => {
      return await api.games.startVotingApiGamesGameCodeStartVotingPost(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.game.detail })
    },

    mutationKey: ["startVoting"],
  })

  return {
    ...mutation,
    startVoting: mutation.mutate,
  }
}

export const useKickPlayer = () => {
  const mutation = useMutation({
    mutationFn: async (
      payload: ApiParams<
        typeof api.games.kickPlayerApiGamesGameCodeKickPlayerIdPost
      >,
    ) => {
      return await api.games.kickPlayerApiGamesGameCodeKickPlayerIdPost(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.game.detail })
    },

    mutationKey: ["kickPlayer"],
  })

  return {
    ...mutation,
    kickPlayer: mutation.mutate,
  }
}

export const useRateGame = () => {
  const mutation = useMutation({
    mutationFn: async (
      payload: ApiParams<typeof api.games.rateGameApiGamesGameCodeRatePost>,
    ) => {
      return await api.games.rateGameApiGamesGameCodeRatePost(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.game.detail })
    },

    mutationKey: ["rateGame"],
  })

  return {
    ...mutation,
    rateGame: mutation.mutate,
  }
}

export const useUnlockRewarded = () => {
  const mutation = useMutation({
    mutationFn: async (
      payload: ApiParams<
        typeof api.games.unlockRewardedApiGamesGameCodeUnlockRewardedPost
      >,
    ) => {
      return await api.games.unlockRewardedApiGamesGameCodeUnlockRewardedPost(
        payload,
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.game.detail })
    },

    mutationKey: ["unlockRewarded"],
  })

  return {
    ...mutation,
    unlockRewarded: mutation.mutate,
  }
}
