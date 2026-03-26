"use client"

import { QRCodeSVG } from "qrcode.react"
import { useGameStore } from "@/stores/gameStore"
import { useStartGame } from "@/api/hooks/games"
import { Button } from "@/components/atoms/Button"
import { Badge } from "@/components/atoms/Badge"
import { AdPlaceholder } from "@/components/atoms/AdPlaceholder"
import { useLingui } from "@lingui/react/macro"

type LobbyProps = {
  code: string
}

export function Lobby({ code }: LobbyProps) {
  const { t } = useLingui()
  const { game, isHost, hostToken, adsEnabled } = useGameStore()
  const { startGame, isPending } = useStartGame()

  if (!game) return <></>

  const gameUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${code}`
      : `https://survade.io/${code}`
  const activePlayers = game.players.filter((p) => !p.is_eliminated)
  const canStart = activePlayers.length >= 3

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs text-[var(--color-muted)] font-mono uppercase tracking-widest mb-1">
            {t`Waiting for players`}
          </p>
          <h1 className="text-5xl font-black font-mono tracking-widest text-[var(--color-accent)]">
            {code}
          </h1>
        </div>

        {/* QR + invite */}
        {isHost && (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5 flex flex-col items-center gap-4">
            <QRCodeSVG
              value={gameUrl}
              size={160}
              bgColor="transparent"
              fgColor="#e8e8f0"
              level="M"
            />
            <p className="text-xs text-[var(--color-muted)] font-mono break-all text-center">
              {gameUrl}
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigator.clipboard.writeText(gameUrl)}
            >
              {t`Copy Link`}
            </Button>
          </div>
        )}

        {/* Players list */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 space-y-2">
          <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-3">
            {t`Players`} ({activePlayers.length}/{game.settings.player_count})
          </p>
          {game.players.map((p) => (
            <div key={p.player_id} className="flex items-center gap-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-sm flex-1">{p.display_name}</span>
              {p.player_id === game.host_player_id && (
                <Badge variant="accent">{t`Host`}</Badge>
              )}
            </div>
          ))}
        </div>

        {/* Host controls */}
        {isHost && (
          <div className="space-y-2">
            {!canStart && (
              <p className="text-xs text-center text-[var(--color-muted)]">
                {t`Need at least 3 players to start`}
              </p>
            )}
            <Button
              variant="primary"
              fullWidth
              size="lg"
              disabled={!canStart}
              loading={isPending}
              onClick={() =>
                startGame({ gameCode: code, xHostToken: hostToken ?? "" })
              }
            >
              {t`Start Game`}
            </Button>
          </div>
        )}

        {!isHost && (
          <p className="text-center text-sm text-[var(--color-muted)]">
            {t`Waiting for host to start the game…`}
          </p>
        )}

        {/* Ad */}
        {adsEnabled && (
          <div className="mt-auto pt-2">
            <AdPlaceholder slot="lobby" />
          </div>
        )}
      </div>
    </div>
  )
}
