"use client"

import { useEffect, useState } from "react"
import { useLingui } from "@lingui/react/macro"
import type {
  GameHistoryFieldReveal,
  GameHistoryPowerUse,
  GameHistoryRemoval,
  GameHistoryRound,
  GameHistoryVote,
} from "@/api/services"
import { useGameHistory } from "@/api/hooks/games"
import { Spinner } from "@/components/atoms/Spinner"
import { Button } from "@/components/atoms/Button"

type GameHistoryProps = {
  gameId?: string
  playerNameMap: Record<number, string>
}

export function GameHistory({ gameId, playerNameMap }: GameHistoryProps) {
  const { t } = useLingui()
  const { data, isLoading } = useGameHistory(
    { gameId: gameId ?? "" },
    { enabled: !!gameId },
  )
  const [currentRound, setCurrentRound] = useState<number | null>(null)

  const getPlayerName = (playerId?: number | null): string => {
    if (playerId === undefined || playerId === null) return t`Unknown player`
    return playerNameMap[playerId] ?? t`Player ${playerId}`
  }

  const renderReveal = (reveal: GameHistoryFieldReveal): string => {
    const performedBy = reveal.by_player_id
      ? t`${getPlayerName(reveal.by_player_id)} triggered it`
      : null

    return (
      t`${getPlayerName(reveal.player_id)} revealed ${reveal.field}` +
      (reveal.power ? ` (${reveal.power})` : "") +
      (performedBy ? `, ${performedBy}` : "")
    )
  }

  const renderPowerUse = (powerUse: GameHistoryPowerUse): string => {
    const target = powerUse.target_player_id
      ? t` on ${getPlayerName(powerUse.target_player_id)}`
      : ""
    const forcedField = powerUse.forced_field
      ? t`, forcing ${powerUse.forced_field}`
      : ""

    return t`${getPlayerName(powerUse.player_id)} used ${powerUse.power}${target}${forcedField}`
  }

  const renderVote = (vote: GameHistoryVote): string =>
    t`${getPlayerName(vote.player_id)} voted against ${getPlayerName(vote.target_player_id)}`

  const renderRemoval = (removal: GameHistoryRemoval): string => {
    const reason = removal.reason ? t` because ${removal.reason}` : ""
    return t`${getPlayerName(removal.player_id)} was removed by ${removal.removal_type}${reason}`
  }

  const getRoundEvents = (round: GameHistoryRound): string[] => [
    ...(round.opened_fields?.map(renderReveal) ?? []),
    ...(round.powers_used?.map(renderPowerUse) ?? []),
    ...(round.votes?.map(renderVote) ?? []),
    ...(round.removed_players?.map(renderRemoval) ?? []),
    ...round.events.map((event) => {
      const eventType =
        typeof event.type === "string" ? event.type.replaceAll("_", " ") : null

      return eventType
        ? t`Event: ${eventType.toLowerCase()}`
        : t`Recorded system event`
    }),
  ]

  useEffect(() => {
    if (!data?.rounds.length) return
    setCurrentRound((value) => value ?? data.rounds[0]!.round)
  }, [data?.rounds])

  if (!gameId) {
    return (
      <p className="py-4 text-center text-sm text-muted">
        {t`Game history is not available for this match yet.`}
      </p>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    )
  }

  if (!data) return <></>

  const totalRounds = data.rounds.length
  const activeRoundIndex = data.rounds.findIndex((round: GameHistoryRound) => {
    return round.round === currentRound
  })
  const activeRound = data.rounds[activeRoundIndex] ?? data.rounds[0]
  const events = activeRound ? getRoundEvents(activeRound) : []
  const canGoPrev = activeRoundIndex > 0
  const canGoNext =
    activeRoundIndex >= 0 && activeRoundIndex < data.rounds.length - 1

  return (
    <div className="space-y-4">
      {/* Round navigation */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          disabled={!canGoPrev}
          onClick={() =>
            setCurrentRound(data.rounds[Math.max(activeRoundIndex - 1, 0)]!.round)
          }
        >
          {`← ${t`Prev`}`}
        </Button>
        <span className="text-sm font-mono flex-1 text-center text-muted">
          {`${t`Round`} ${activeRound?.round ?? 1} / ${totalRounds}`}
        </span>
        <Button
          variant="ghost"
          size="sm"
          disabled={!canGoNext}
          onClick={() =>
            setCurrentRound(
              data.rounds[Math.min(activeRoundIndex + 1, data.rounds.length - 1)]!
                .round,
            )
          }
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
            <span className="text-sm text-muted">{event}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
