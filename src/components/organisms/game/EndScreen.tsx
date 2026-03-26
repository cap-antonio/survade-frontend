"use client"

import { useState } from "react"
import { useLingui } from "@lingui/react/macro"
import { useGameStore } from "@/stores/gameStore"
import { useRateGame } from "@/api/hooks/games"
import { Button } from "@/components/atoms/Button"
import { AdPlaceholder } from "@/components/atoms/AdPlaceholder"
import { Badge } from "@/components/atoms/Badge"
import { GameHistory } from "./GameHistory"

type EndScreenProps = {
  code: string
}

export function EndScreen({ code }: EndScreenProps) {
  const { t } = useLingui()
  const { game, myPlayerId, myToken, adsEnabled } = useGameStore()
  const { rateGame, isPending: isPendingRateGame } = useRateGame()

  const [scenarioRating, setScenarioRating] = useState(0)
  const [gameRating, setGameRating] = useState(0)
  const [comment, setComment] = useState("")
  const [rated, setRated] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  if (!game) return <></>

  const survivors = game.players.filter((p) => !p.is_eliminated)
  const eliminated = game.players.filter((p) => p.is_eliminated)
  const saboteur = game.players.find((p) => {
    const card = p.card as { is_saboteur?: boolean }
    return card.is_saboteur === true
  })

  const playerNameMap: Record<number, string> = {}
  for (const p of game.players) {
    playerNameMap[p.player_id] = p.display_name
  }

  const handleRate = (): void => {
    if (scenarioRating === 0 || gameRating === 0) return
    rateGame(
      {
        requestBody: {
          scenario_rating: scenarioRating,
          game_rating: gameRating,
          comment: comment || null,
        },
        gameCode: code,
        xPlayerToken: myToken ?? "",
      },
      { onSuccess: () => setRated(true) },
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-widest mb-2">
            {t`Game Over`}
          </p>
          <h1 className="text-4xl font-black tracking-tight mb-1">{code}</h1>
        </div>

        {/* Survivors */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 mb-3">
            {`✅  ${t`Survivors`} (${survivors.length})`}
          </h2>
          <div className="flex flex-wrap gap-2">
            {survivors.map((p) => (
              <span
                key={p.player_id}
                className="px-3 py-1.5 rounded border border-emerald-800/40 bg-emerald-900/20 text-emerald-300 text-sm"
              >
                {p.display_name}
                {p.player_id === myPlayerId && (
                  <span className="ml-1 text-xs text-emerald-500">
                    {`(${t`you`})`}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Eliminated */}
        {eliminated.length > 0 && (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-3">
              {`☠️ ${t`Eliminated`} (${eliminated.length})`}
            </h2>
            <div className="flex flex-wrap gap-2">
              {eliminated.map((p) => (
                <span
                  key={p.player_id}
                  className="px-3 py-1.5 rounded border border-[var(--color-border)] text-[var(--color-muted)] text-sm line-through"
                >
                  {p.display_name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Saboteur reveal */}
        {game.settings.saboteur_mode && (
          <div className="bg-[var(--color-surface)] border border-red-800/40 rounded-lg p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-red-400 mb-3">
              {`☠️ ${t`Saboteur`}`}
            </h2>
            {saboteur ? (
              <p className="text-sm">
                <span className="font-semibold text-red-300">
                  {saboteur.display_name}
                </span>
                <span className="text-[var(--color-muted)] ml-2">
                  {t`was the saboteur`}
                </span>
                {saboteur.is_eliminated ? (
                  <Badge variant="green" className="ml-2">
                    {t`Detected!`}
                  </Badge>
                ) : (
                  <Badge variant="red" className="ml-2">
                    {t`Survived!`}
                  </Badge>
                )}
              </p>
            ) : (
              <p className="text-sm text-[var(--color-muted)]">
                {t`No saboteur in this game`}
              </p>
            )}
          </div>
        )}

        {/* Ad */}
        {adsEnabled && <AdPlaceholder slot="end_screen" />}

        {/* History toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowHistory((s) => !s)}
            className="w-full py-3 text-sm text-[var(--color-muted)] border border-[var(--color-border)] rounded-lg hover:bg-white/5 transition-colors"
          >
            {showHistory ? "▲" : "▼"} {t`Game History`}
          </button>
          {showHistory && (
            <div className="mt-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
              <GameHistory code={code} playerNameMap={playerNameMap} />
            </div>
          )}
        </div>

        {/* Rating form */}
        {!rated ? (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5 space-y-4">
            <h2 className="font-semibold">{t`Rate the Game`}</h2>
            <div className="space-y-3">
              <StarRating
                label={t`Scenario`}
                value={scenarioRating}
                onChange={setScenarioRating}
              />
              <StarRating
                label={t`Game Experience`}
                value={gameRating}
                onChange={setGameRating}
              />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Optional comment…"
                rows={3}
                className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)]/50 resize-none"
              />
            </div>
            <Button
              variant="primary"
              fullWidth
              disabled={scenarioRating === 0 || gameRating === 0}
              loading={isPendingRateGame}
              onClick={handleRate}
            >
              {t`Submit Rating`}
            </Button>
          </div>
        ) : (
          <div className="text-center py-4 text-sm text-emerald-400">
            {`✓ ${t`Thanks for rating!`}`}
          </div>
        )}

        <div className="text-center">
          <a href="/" className="text-sm text-[var(--color-accent)] underline">
            {t`Create a new game`}
          </a>
        </div>
      </div>
    </div>
  )
}

function StarRating({
  label,
  value,
  onChange,
}: {
  label: React.ReactNode
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[var(--color-muted)] w-32 shrink-0">
        {label}
      </span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`text-xl transition-colors ${star <= value ? "text-yellow-400" : "text-white/20 hover:text-yellow-400/60"}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  )
}
