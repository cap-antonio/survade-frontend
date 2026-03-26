export const CACHE_KEYS = {
  game: {
    detail: ["game"] as const,
    history: ["game", "history"] as const,
  },
  leaderboard: {
    survival: ["leaderboard", "survival"] as const,
    saboteur: ["leaderboard", "saboteur"] as const,
  },
  user: {
    profile: ["user"] as const,
  },
} as const
