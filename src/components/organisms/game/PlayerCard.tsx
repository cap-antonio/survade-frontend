"use client"

import cn from "classnames"
import { useLingui } from "@lingui/react/macro"
import { Badge } from "@/components/atoms/Badge"
import type { Player } from "@/api/generated/schema"

type PlayerCardProps = {
  player: Player
  isMe: boolean
  isHost: boolean
  contentLang: string
  votesCount?: number
  isVoteTarget?: boolean
  isShielded?: boolean
  onVote?: () => void
  onKick?: () => void
  onReveal?: (field: string) => void
  onUsePower?: () => void
  currentRound?: number
  votingPhase?: boolean
}

const ATTR_ICONS: Record<string, string> = {
  role: "👤",
  gender: "⚧",
  health: "❤️",
  dark_secret: "🔒",
  special_skill: "⚡",
  phobia: "😨",
  inventory_item: "🎒",
  personality_trait: "🎭",
}

export function PlayerCard({
  player,
  isMe,
  isHost,
  contentLang,
  votesCount = 0,
  isVoteTarget = false,
  isShielded = false,
  onVote,
  onKick,
  onReveal,
  onUsePower,
  currentRound = 1,
  votingPhase = false,
}: PlayerCardProps) {
  const { t } = useLingui()
  const card = player.card
  const allAttrKeys = Object.keys(ATTR_ICONS)
  const darkSecretNotRevealed =
    card.dark_secret !== undefined &&
    !player.revealed_fields.includes("dark_secret")

  const getLangValue = (field: Record<string, string> | undefined): string => {
    if (!field) return ""
    return field[contentLang] ?? field["en"] ?? Object.values(field)[0] ?? ""
  }

  return (
    <div
      className={cn(
        "relative rounded-lg border p-4 flex flex-col gap-3 transition-all",
        player.is_eliminated
          ? "opacity-40 border-white/5 bg-surface"
          : isMe
            ? "border-accent/50 bg-accent-soft shadow-lg shadow-accent/10"
            : isVoteTarget
              ? "border-red-500/50 bg-red-900/10"
              : "border-border bg-surface",
        isShielded && "ring-1 ring-blue-400/40",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {isShielded && (
            <span title="Protected" className="text-blue-400 text-xs">
              🛡
            </span>
          )}
          <span className="font-semibold text-sm truncate">
            {player.display_name}
          </span>
          {isMe && (
            <Badge variant="accent" className="shrink-0">
              {t`You`}
            </Badge>
          )}
          {player.is_eliminated && (
            <Badge variant="red" className="shrink-0">
              {t`Out`}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {votesCount > 0 && <Badge variant="red">☠️ {votesCount}</Badge>}
          {isHost && !isMe && !player.is_eliminated && onKick && (
            <button
              type="button"
              onClick={onKick}
              title="Kick player"
              className="w-5 h-5 flex items-center justify-center text-muted hover:text-red-400 transition-colors text-sm"
            >
              ⊗
            </button>
          )}
        </div>
      </div>

      {/* Attributes */}
      <div className="space-y-1">
        {allAttrKeys.map((key) => {
          const cardValue = card[key as keyof typeof card]
          if (cardValue === undefined) return null
          const isRevealed = player.revealed_fields.includes(key)
          const canSeeOwn = isMe

          let displayValue: string | null = null

          if (isRevealed) {
            if (key === "dark_secret" && card.dark_secret) {
              displayValue = getLangValue(card.dark_secret.content)
            } else if (
              typeof cardValue === "object" &&
              cardValue !== null &&
              !Array.isArray(cardValue)
            ) {
              displayValue = getLangValue(cardValue as Record<string, string>)
            }
          } else if (canSeeOwn) {
            if (key === "dark_secret" && card.dark_secret) {
              displayValue = getLangValue(card.dark_secret.content)
            } else if (
              typeof cardValue === "object" &&
              cardValue !== null &&
              !Array.isArray(cardValue)
            ) {
              displayValue = getLangValue(cardValue as Record<string, string>)
            }
          }

          return (
            <div key={key} className="flex items-start gap-2 text-xs">
              <span className="w-4 shrink-0">{ATTR_ICONS[key]}</span>
              {displayValue ? (
                <span
                  className={cn(
                    !isRevealed &&
                      canSeeOwn &&
                      "text-muted italic",
                  )}
                >
                  {displayValue}
                  {!isRevealed && canSeeOwn && (
                    <span className="ml-1 text-[10px] text-accent/60">
                      {`(${t`hidden`})`}
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-muted">{"— — —"}</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Round 3 dark secret banner */}
      {isMe && currentRound >= 3 && darkSecretNotRevealed && (
        <div className="bg-red-900/30 border border-red-800/40 rounded px-3 py-2 text-xs text-red-300">
          {`⚠️ ${t`You must reveal your dark secret this round!`}`}
        </div>
      )}

      {/* My card actions */}
      {isMe && !player.is_eliminated && (
        <div className="flex flex-wrap gap-2 pt-1">
          {player.revealed_fields.length < Object.keys(card).length &&
            onReveal && (
              <RevealButton player={player} card={card} onReveal={onReveal} />
            )}
          {card.special_power && !card.special_power.used && onUsePower && (
            <button
              type="button"
              onClick={onUsePower}
              className="text-xs px-2 py-1 rounded border border-accent/40 text-accent hover:bg-accent-soft transition-colors"
            >
              {t`⚡ ${t`Use Power`}`}
            </button>
          )}
        </div>
      )}

      {/* Vote button */}
      {!isMe &&
        !player.is_eliminated &&
        !isShielded &&
        votingPhase &&
        onVote && (
          <button
            type="button"
            onClick={onVote}
            className={cn(
              "w-full py-1.5 rounded text-xs font-medium border transition-colors",
              isVoteTarget
                ? "bg-red-900/40 border-red-800/60 text-red-300"
                : "border-border text-muted hover:border-red-800/60 hover:text-red-300",
            )}
          >
            {isVoteTarget ? t`Voted` : t`Vote Out`}
          </button>
        )}
    </div>
  )
}

function RevealButton({
  player,
  card,
  onReveal,
}: {
  player: Player
  card: Player["card"]
  onReveal: (field: string) => void
}) {
  const { t } = useLingui()
  const hidden = Object.keys(card).filter(
    (k) =>
      !player.revealed_fields.includes(k) &&
      k !== "special_power" &&
      k !== "is_saboteur",
  )

  if (hidden.length === 0) return <></>

  return (
    <div className="relative group">
      <button
        type="button"
        className="text-xs px-2 py-1 rounded border border-border text-muted hover:border-white/20 hover:text-foreground transition-colors"
      >
        {`👁 ${t`Reveal`}`}
      </button>
      <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block bg-surface-elevated border border-border rounded shadow-xl z-10 min-w-[140px]">
        {hidden.map((field) => (
          <button
            key={field}
            type="button"
            onClick={() => onReveal(field)}
            className="w-full text-left px-3 py-2 text-xs hover:bg-surface-hover transition-colors"
          >
            {ATTR_ICONS[field] ?? "•"} {field.replace(/_/g, " ")}
          </button>
        ))}
      </div>
    </div>
  )
}
