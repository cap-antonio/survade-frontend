const SESSION_KEY_PREFIXES = [
  "host_token_",
  "player_token_",
  "player_id_",
] as const

export function clearOtherStoredGameSessions(currentGameCode: string): void {
  if (typeof window === "undefined") return

  const normalizedGameCode = currentGameCode.trim().toUpperCase()
  const keysToRemove: string[] = []

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index)

    if (!key) continue

    const matchingPrefix = SESSION_KEY_PREFIXES.find((prefix) =>
      key.startsWith(prefix),
    )

    if (!matchingPrefix) continue

    const storedGameCode = key.slice(matchingPrefix.length).toUpperCase()

    if (storedGameCode !== normalizedGameCode) {
      keysToRemove.push(key)
    }
  }

  for (const key of keysToRemove) {
    localStorage.removeItem(key)
  }
}

export function clearStoredGameSession(gameCode: string): void {
  if (typeof window === "undefined") return

  const normalizedGameCode = gameCode.trim().toUpperCase()

  for (const prefix of SESSION_KEY_PREFIXES) {
    localStorage.removeItem(`${prefix}${normalizedGameCode}`)
  }
}
