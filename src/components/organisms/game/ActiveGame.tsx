"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useGameStore } from "@/stores/gameStore"
import {
  useRevealCard,
  useUsePower,
  useVote,
  useKickPlayer,
  useAbondonGame,
} from "@/api/hooks/games"
import { ConfirmModal } from "@/components/molecules/modals/ConfirmModal"
import { ScenarioPanel } from "./ScenarioPanel"
import { PlayerCard } from "./PlayerCard"
import { HostControls } from "./HostControls"
import { PowerModal } from "./PowerModal"
import { Button } from "@/components/atoms/Button"
import { useLingui } from "@lingui/react/macro"
import { getLocalizedPath, SupportedLocale } from "@/i18n"
import { clearStoredGameSession } from "@/utils/gameSessionStorage"

type ActiveGameProps = {
  code: string
  locale: SupportedLocale
}

export function ActiveGame({ code, locale }: ActiveGameProps) {
  const { t } = useLingui()
  const router = useRouter()
  const {
    game,
    myPlayerId,
    myToken,
    hostToken,
    isHost,
    votingPhase,
    selectedVoteTarget,
    setVoteTarget,
    setVotingPhase,
    reset,
  } = useGameStore()

  const [showPowerModal, setShowPowerModal] = useState(false)
  const [kickTarget, setKickTarget] = useState<{
    id: number
    name: string
  } | null>(null)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)
  const [contentLang, setContentLang] = useState<string>("en")

  const { revealCard } = useRevealCard()
  const { usePower, isPending: isPendingUsePower } = useUsePower()
  const { vote } = useVote()
  const { kickPlayer, isPending: isPendingKickPlayer } = useKickPlayer()
  const { abondonGame, isPending: isPendingAbondonGame } = useAbondonGame()

  if (!game) return <></>

  const me = game.players?.find((p) => p.player_id === myPlayerId)
  const shieldedIds = game.round_effects?.shielded ?? []

  const handleVote = (targetId: number): void => {
    if (!me || me.is_eliminated) return
    setVoteTarget(targetId)
    vote({
      requestBody: {
        target_player_id: targetId,
      },
      gameCode: code,
      xPlayerToken: myToken ?? "",
    })
  }

  const handleUsePower = (targetPlayerId?: number): void => {
    if (!me) return
    usePower(
      {
        requestBody: {
          power: me.card.special_power?.name,
          target_player_id: targetPlayerId,
        },
        gameCode: code,
        xPlayerToken: myToken ?? "",
      },
      { onSuccess: () => setShowPowerModal(false) },
    )
  }

  const handleKickConfirm = (): void => {
    if (!kickTarget) return
    kickPlayer(
      { playerId: kickTarget.id, gameCode: code, xHostToken: hostToken ?? "" },
      { onSuccess: () => setKickTarget(null) },
    )
  }

  const handleLeaveConfirm = (): void => {
    const redirectToHome = (): void => {
      clearStoredGameSession(code)
      reset()
      router.push(getLocalizedPath(locale))
    }

    if (isHost) {
      abondonGame(
        {
          gameCode: code,
          xHostToken:
            typeof window !== "undefined"
              ? (localStorage.getItem(`host_token_${code}`) ?? "")
              : "",
        },
        {
          onSuccess: () => {
            setShowLeaveConfirm(false)
            redirectToHome()
          },
        },
      )

      return
    }

    setShowLeaveConfirm(false)
    redirectToHome()
  }

  // Available langs from game settings
  const availableLangs = game.settings.langs || []

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="border-b border-border px-4 py-2 flex items-center gap-4">
        <span className="text-accent font-mono font-bold tracking-widest">
          {code}
        </span>
        {availableLangs.length > 0 && (
          <div className="flex gap-1 ml-auto">
            {availableLangs.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setContentLang(lang)}
                className={`px-2 py-0.5 text-xs font-mono rounded border transition-colors ${
                  contentLang === lang
                    ? "border-accent text-accent"
                    : "border-border text-muted hover:border-white/20"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-4xl mx-auto w-full">
        {/* Scenario */}
        <ScenarioPanel contentLang={contentLang} />

        {/* Host controls */}
        {isHost && <HostControls />}

        {/* Player grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(game.players || []).map((player) => {
            const voteCount = Object.values(game.votes_this_round || {}).filter(
              (id) => id === player.player_id,
            ).length

            return (
              <PlayerCard
                key={player.player_id}
                player={player}
                isMe={player.player_id === myPlayerId}
                isHost={isHost}
                contentLang={contentLang}
                votesCount={voteCount}
                isVoteTarget={selectedVoteTarget === player.player_id}
                isShielded={shieldedIds.includes(player.player_id)}
                votingPhase={votingPhase}
                currentRound={game.current_round}
                onVote={() => handleVote(player.player_id)}
                onKick={() =>
                  setKickTarget({
                    id: player.player_id,
                    name: player.display_name,
                  })
                }
                onReveal={(field) =>
                  revealCard({
                    requestBody: { field },
                    gameCode: code,
                    xPlayerToken: myToken ?? "",
                  })
                }
                onUsePower={() => setShowPowerModal(true)}
              />
            )
          })}
        </div>
        <div className="flex mt-10">
          <Button
            className="mx-auto"
            onClick={() => setShowLeaveConfirm(true)}
            loading={isPendingAbondonGame}
          >{t`Leave the game`}</Button>
        </div>
      </div>

      {/* Modals */}
      {me && (
        <PowerModal
          open={showPowerModal}
          onClose={() => setShowPowerModal(false)}
          player={me}
          allPlayers={game.players || []}
          contentLang={contentLang}
          onUsePower={handleUsePower}
          isLoading={isPendingUsePower}
        />
      )}

      <ConfirmModal
        open={!!kickTarget}
        title={t`Remove player?`}
        body={t`Remove ${kickTarget?.name ?? ""} from the game?`}
        actionButtonTitle={t`Remove`}
        onConfirm={handleKickConfirm}
        onClose={() => setKickTarget(null)}
        isLoading={isPendingKickPlayer}
      />

      <ConfirmModal
        open={showLeaveConfirm}
        title={t`Leave the game?`}
        body={
          isHost
            ? t`This will close the current game for everyone.`
            : t`You will leave this game and return to the home page.`
        }
        actionButtonTitle={t`Leave`}
        onConfirm={handleLeaveConfirm}
        onClose={() => setShowLeaveConfirm(false)}
        isLoading={isPendingAbondonGame}
      />
    </div>
  )
}
