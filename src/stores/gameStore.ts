import { create } from "zustand"
import type {
  GameDocument,
  GameEvent,
  Player,
  CardWithSaboteur,
} from "@/api/generated/schema"

type GameStore = {
  // data
  game: GameDocument | null
  myPlayerId: number | null
  myToken: string | null
  hostToken: string | null
  isHost: boolean
  adsEnabled: boolean

  // UI state
  votingPhase: boolean
  selectedVoteTarget: number | null
  activeTab: "game" | "history"

  // actions
  setGame: (game: GameDocument) => void
  setSession: (params: {
    myPlayerId: number
    myToken: string
    hostToken: string | null
  }) => void
  applyEvent: (event: GameEvent) => void
  setVoteTarget: (playerId: number | null) => void
  setVotingPhase: (active: boolean) => void
  setActiveTab: (tab: "game" | "history") => void
  reset: () => void
}

const initialState = {
  game: null,
  myPlayerId: null,
  myToken: null,
  hostToken: null,
  isHost: false,
  adsEnabled: true,
  votingPhase: false,
  selectedVoteTarget: null,
  activeTab: "game" as const,
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  setGame: (game) =>
    set({
      game,
      adsEnabled: game.settings.ads_enabled,
    }),

  setSession: ({ myPlayerId, myToken, hostToken }) =>
    set({
      myPlayerId,
      myToken,
      hostToken,
      isHost: !!hostToken,
    }),

  applyEvent: (event) => {
    const { game } = get()
    if (!game) return

    switch (event.type) {
      case "ROUND_STARTED":
        set({
          game: {
            ...game,
            current_round: event.round ?? game.current_round,
            votes_this_round: {},
          },
          votingPhase: false,
          selectedVoteTarget: null,
        })
        break

      case "CARD_REVEALED": {
        if (event.player_id === undefined || !event.field) break
        const players = game.players.map((p) => {
          if (p.player_id !== event.player_id) return p
          return {
            ...p,
            revealed_fields: [...p.revealed_fields, event.field as string],
          }
        })
        set({ game: { ...game, players } })
        break
      }

      case "POWER_USED": {
        if (event.player_id === undefined) break
        const players = game.players.map((p) => {
          if (p.player_id !== event.player_id) return p
          const card = p.card
          if (!card.special_power) return p
          return {
            ...p,
            card: {
              ...card,
              special_power: { ...card.special_power, used: true },
            },
          }
        })
        set({ game: { ...game, players } })
        break
      }

      case "VOTE_CAST": {
        set({
          game: {
            ...game,
            votes_this_round: event.votes ?? game.votes_this_round,
          },
          votingPhase: true,
        })
        break
      }

      case "PLAYER_ELIMINATED":
      case "PLAYER_KICKED": {
        if (
          event.player_id === undefined &&
          event.eliminated_player_id === undefined
        )
          break
        const eliminatedId = event.eliminated_player_id ?? event.player_id
        const players = game.players.map((p) => {
          if (p.player_id !== eliminatedId) return p
          return { ...p, is_eliminated: true }
        })
        set({
          game: { ...game, players },
          votingPhase: false,
          selectedVoteTarget: null,
        })
        break
      }

      case "GAME_ENDED": {
        // Reveal is_saboteur on players when game ends
        const survivors = event.survivors ?? []
        const saboteurId = event.saboteur_player_id
        const players = game.players.map((p) => {
          const card: CardWithSaboteur = {
            ...p.card,
            is_saboteur:
              saboteurId !== undefined ? p.player_id === saboteurId : undefined,
          }
          return {
            ...p,
            is_eliminated: !survivors.includes(p.player_id),
            card,
          }
        })
        set({ game: { ...game, status: "ended", players }, votingPhase: false })
        break
      }

      case "SABOTEUR_REVEALED": {
        if (event.player_id === undefined) break
        const players = game.players.map((p) => {
          if (p.player_id !== event.player_id) return p
          const card: CardWithSaboteur = { ...p.card, is_saboteur: true }
          return { ...p, card }
        })
        set({ game: { ...game, players } })
        break
      }

      default:
        break
    }
  },

  setVoteTarget: (playerId) => set({ selectedVoteTarget: playerId }),
  setVotingPhase: (active) => set({ votingPhase: active }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  reset: () => set(initialState),
}))
