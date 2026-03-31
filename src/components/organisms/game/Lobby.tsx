"use client"

import { QRCodeSVG } from "qrcode.react"
import { useGameStore } from "@/stores/gameStore"
import { useFillBots, useStartGame } from "@/api/hooks/games"
import { Button } from "@/components/atoms/Button"
import { Badge } from "@/components/atoms/Badge"
import { AdPlaceholder } from "@/components/atoms/AdPlaceholder"
import { useLingui } from "@lingui/react/macro"
import { getPlayPath, type SupportedLocale } from "@/i18n"

type LobbyProps = {
  code: string
  locale: SupportedLocale
}

export function Lobby({ code, locale }: LobbyProps) {
  const { t } = useLingui()
  const { game, isHost, hostToken, adsEnabled } = useGameStore()
  const { startGame, isPending } = useStartGame()
  const { fillBots, isPending: isPendingFillBots } = useFillBots()

  if (!game) return <></>

  type LobbyPlayer = {
    player_id: number
    display_name: string
    is_eliminated: boolean
  }

  const gameUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${getPlayPath(locale, code)}`
      : `https://survade.io${getPlayPath(locale, code)}`
  const players = game.players as LobbyPlayer[]
  const activePlayers = players.filter((p) => !p.is_eliminated)
  const missingPlayers = Math.max(
    0,
    (game.settings.player_count ?? activePlayers.length) - activePlayers.length,
  )
  const canStart = activePlayers.length >= 3

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs text-muted font-mono uppercase tracking-widest mb-1">
            {t`Waiting for players`}
          </p>
          <h1 className="text-5xl font-black font-mono tracking-widest text-accent">
            {code}
          </h1>
        </div>

        {/* QR + invite */}
        {isHost && (
          <div className="bg-surface border border-border rounded-lg p-5 flex flex-col items-center gap-4">
            <QRCodeSVG
              value={gameUrl}
              size={160}
              bgColor="transparent"
              fgColor="#e8e8f0"
              level="M"
            />
            <p className="text-xs text-muted font-mono break-all text-center">
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
        <div className="bg-surface border border-border rounded-lg p-4 space-y-2">
          <p className="text-xs text-muted uppercase tracking-wider mb-3">
            {t`Players`} ({activePlayers.length}/{game.settings.player_count})
          </p>
          {players.map((p) => (
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
              <p className="text-xs text-center text-muted">
                {t`Waiting for other`}
              </p>
            )}
            {missingPlayers > 0 ? (
              <Button
                variant="secondary"
                fullWidth
                size="lg"
                loading={isPendingFillBots}
                onClick={() =>
                  fillBots({ gameCode: code, xHostToken: hostToken ?? "" })
                }
              >
                {t`Fill missing players with bots`} ({missingPlayers})
              </Button>
            ) : null}
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
          <p className="text-center text-sm text-muted">
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
