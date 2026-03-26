"use client"

import { useState } from "react"
import { useGameStore } from "@/stores/gameStore"
import {
  useRevealCard,
  useUsePower,
  useVote,
  useEndVoting,
  useKickPlayer,
} from "@/api/hooks/games"
import { ScenarioPanel } from "./ScenarioPanel"
import { PlayerCard } from "./PlayerCard"
import { HostControls } from "./HostControls"
import { PowerModal } from "./PowerModal"
import { KickConfirmModal } from "./KickConfirmModal"

type ActiveGameProps = {
  code: string
}

export function ActiveGame({ code }: ActiveGameProps) {
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
  } = useGameStore()

  const [showPowerModal, setShowPowerModal] = useState(false)
  const [kickTarget, setKickTarget] = useState<{
    id: number
    name: string
  } | null>(null)
  const [contentLang, setContentLang] = useState<string>("en")

  const { revealCard } = useRevealCard()
  const { usePower, isPending: isPendingUsePower } = useUsePower()
  const { vote } = useVote()
  const { endVoting, isPending: isPendingEndVoting } = useEndVoting()
  const { kickPlayer, isPending: isPendingKickPlayer } = useKickPlayer()

  if (!game) return <></>

  const me = game.players.find((p) => p.player_id === myPlayerId)
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
          power: me.card.special_power?.name["en"] ?? "power",
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

  // Available langs from game settings
  const availableLangs = game.settings.langs

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Top bar */}
      <div className="border-b border-[var(--color-border)] px-4 py-2 flex items-center gap-4">
        <span className="text-[var(--color-accent)] font-mono font-bold tracking-widest">
          {code}
        </span>
        {availableLangs.length > 1 && (
          <div className="flex gap-1 ml-auto">
            {availableLangs.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setContentLang(lang)}
                className={`px-2 py-0.5 text-xs font-mono rounded border transition-colors ${
                  contentLang === lang
                    ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                    : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-white/20"
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
        {game.scenario && (
          <ScenarioPanel
            scenario={game.scenario}
            currentRound={game.current_round}
            contentLang={contentLang}
          />
        )}

        {/* Host controls */}
        {isHost && (
          <HostControls
            votingPhase={votingPhase}
            onStartVoting={() => setVotingPhase(true)}
            onEndVoting={() =>
              endVoting({ gameCode: code, xHostToken: hostToken ?? "" })
            }
            isEndingVote={isPendingEndVoting}
          />
        )}

        {/* Player grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {game.players.map((player) => {
            const voteCount = Object.values(game.votes_this_round).filter(
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
      </div>

      {/* Modals */}
      {me && (
        <PowerModal
          open={showPowerModal}
          onClose={() => setShowPowerModal(false)}
          player={me}
          allPlayers={game.players}
          contentLang={contentLang}
          onUsePower={handleUsePower}
          isLoading={isPendingUsePower}
        />
      )}

      <KickConfirmModal
        open={!!kickTarget}
        playerName={kickTarget?.name ?? ""}
        onConfirm={handleKickConfirm}
        onClose={() => setKickTarget(null)}
        isLoading={isPendingKickPlayer}
      />
    </div>
  )
}
