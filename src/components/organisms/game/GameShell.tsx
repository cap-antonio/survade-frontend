"use client"

import { useEffect, useState } from "react"
import { useGameStore } from "@/stores/gameStore"
import { useGameQuery } from "@/api/hooks/games"
import { useWebSocket } from "@/hooks/useWebSocket"
import { Spinner } from "@/components/atoms/Spinner"
import { Lobby } from "./Lobby"
import { ActiveGame } from "./ActiveGame"
import { EndScreen } from "./EndScreen"
import { JoinScreen } from "./JoinScreen"
import { getLocalizedPath, type SupportedLocale } from "@/i18n"

type GameShellProps = {
  code: string
  locale: SupportedLocale
}

export function GameShell({ code, locale }: GameShellProps) {
  const { game, myPlayerId, myToken, hostToken, setGame, setSession } =
    useGameStore()
  const [sessionChecked, setSessionChecked] = useState(false)

  // Load session from localStorage
  useEffect(() => {
    const storedHostToken = localStorage.getItem(`host_token_${code}`)
    const storedPlayerToken = localStorage.getItem(`player_token_${code}`)
    const storedPlayerId = localStorage.getItem(`player_id_${code}`)

    if (storedPlayerToken && storedPlayerId) {
      setSession({
        myPlayerId: Number(storedPlayerId),
        myToken: storedPlayerToken,
        hostToken: storedHostToken,
      })
    }
    setSessionChecked(true)
  }, [code, setSession])

  const { data, isLoading, isError } = useGameQuery({
    gameCode: code,
    xHostToken:
      typeof window !== "undefined"
        ? localStorage.getItem(`host_token_${code}`)
        : null,
  })

  useEffect(() => {
    if (data) setGame(data)
  }, [data, setGame])

  // Connect WebSocket when we have a session
  useWebSocket(code, myPlayerId, myToken)

  if (!sessionChecked || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-2xl font-bold mb-2">404</p>
          <p className="text-muted">Game not found</p>
          <a
            href={getLocalizedPath(locale)}
            className="mt-4 inline-block text-sm text-accent underline"
          >
            Back to home
          </a>
        </div>
      </div>
    )
  }

  // No session — show join screen
  if (!myPlayerId || !myToken) {
    return <JoinScreen code={code} />
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    )
  }

  if (game.status === "lobby") {
    return <Lobby code={code} locale={locale} />
  }

  if (game.status === "active") {
    return <ActiveGame code={code} locale={locale} />
  }

  return <EndScreen code={code} locale={locale} />
}
