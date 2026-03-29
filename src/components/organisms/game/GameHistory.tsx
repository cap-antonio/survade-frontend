"use client"

import { useState } from "react"
import { useGameHistory } from "@/api/hooks/games"
import { Spinner } from "@/components/atoms/Spinner"
import { Button } from "@/components/atoms/Button"
import type { GameEvent } from "@/api/generated/schema"
import { useLingui } from "@lingui/react/macro"

type GameHistoryProps = {
  code: string
  playerNameMap: Record<number, string>
}

export function GameHistory({ code, playerNameMap }: GameHistoryProps) {
  const { t } = useLingui()
  const { data, isLoading } = useGameHistory({ gameCode: code })
  const [currentRound, setCurrentRound] = useState(1)

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    )
  }

  function eventLabel(
    event: GameEvent,
    playerNameMap: Record<number, string>,
  ): string {
    const name = (id?: number): string =>
      id !== undefined ? (playerNameMap[id] ?? t`Player ${id}`) : "?"

    switch (event.type) {
      case "ROUND_STARTED":
        return t`Round ${event.round ?? "?"} started`
      case "CARD_REVEALED":
        return t`${name(event.player_id)} revealed ${event.field ?? "attribute"}`
      case "POWER_USED":
        return t`${name(event.player_id)} used their power`
      case "VOTE_CAST":
        return t`${name(event.player_id)} voted against ${name(event.target_player_id)}`
      case "PLAYER_ELIMINATED":
        return t`${name(event.eliminated_player_id ?? event.player_id)} was eliminated`
      case "PLAYER_KICKED":
        return t`${name(event.player_id)} was removed by host`
      case "GAME_ENDED":
        return t`Game ended`
      case "SABOTEUR_REVEALED":
        return t`${name(event.player_id)} was the saboteur!`
      case "SPY_RESULT":
        return t`${name(event.player_id)} used spy ability`
      case "SCAN_RESULT":
        return t`${name(event.player_id)} scanned a player`
      default:
        return event.type
    }
  }

  if (!data) return <></>

  const totalRounds = data.rounds
  // TODO: check WTF
  // const roundEvents = data.events.filter((e) =>
  //   e.type === "ROUND_STARTED" ? (e.round ?? 1) === currentRound : true,
  // )

  // Group events by round
  const eventsByRound: Record<number, GameEvent[]> = {}
  let round = 1
  for (const event of data.events) {
    if (event.type === "ROUND_STARTED" && event.round) {
      round = event.round
      eventsByRound[round] = eventsByRound[round] ?? []
      eventsByRound[round]!.push(event)
    } else {
      eventsByRound[round] = eventsByRound[round] ?? []
      eventsByRound[round]!.push(event)
    }
  }

  const events = eventsByRound[currentRound] ?? []

  return (
    <div className="space-y-4">
      {/* Round navigation */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentRound <= 1}
          onClick={() => setCurrentRound((r) => r - 1)}
        >
          {`← ${t`Prev`}`}
        </Button>
        <span className="text-sm font-mono flex-1 text-center text-muted">
          {`${t`Round`} ${currentRound} / ${totalRounds}`}
        </span>
        <Button
          variant="ghost"
          size="sm"
          disabled={currentRound >= totalRounds}
          onClick={() => setCurrentRound((r) => r + 1)}
        >
          {`${t`Next`} →`}
        </Button>
      </div>

      {/* Events */}
      <div className="space-y-1">
        {events.length === 0 && (
          <p className="text-sm text-muted text-center py-4">
            {t`No events this round`}
          </p>
        )}
        {events.map((event, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2 border-b border-border last:border-0"
          >
            <span className="text-sm text-muted">
              {eventLabel(event, playerNameMap)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
