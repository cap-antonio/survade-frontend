export const CACHE_KEYS = {
  game: {
    detail: ["game"] as const,
    history: ["game", "history"] as const,
    historyList: ["game", "history-list"] as const,
  },
  leaderboard: {
    classic: ["leaderboard", "classic"] as const,
    survival: ["leaderboard", "survival"] as const,
    saboteur: ["leaderboard", "saboteur"] as const,
  },
  user: {
    profile: ["user"] as const,
    games: ["user", "games"] as const,
  },
} as const
