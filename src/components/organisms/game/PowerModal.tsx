"use client"

import { useState } from "react"
import { useLingui } from "@lingui/react/macro"
import { Modal } from "@/components/templates/Modal"
import { Button } from "@/components/atoms/Button"
import type { Player } from "@/api/generated/schema"

type PowerModalProps = {
  open: boolean
  onClose: () => void
  player: Player
  allPlayers: Player[]
  contentLang: string
  onUsePower: (targetPlayerId?: number) => void
  isLoading?: boolean
}

function getLang(map: Record<string, string>, lang: string): string {
  return map[lang] ?? map["en"] ?? Object.values(map)[0] ?? ""
}

export function PowerModal({
  open,
  onClose,
  player,
  allPlayers,
  contentLang,
  onUsePower,
  isLoading = false,
}: PowerModalProps) {
  const { t } = useLingui()
  const [targetId, setTargetId] = useState<number | undefined>()
  const power = player.card.special_power

  if (!power) return <></>

  const otherPlayers = allPlayers.filter(
    (p) => p.player_id !== player.player_id && !p.is_eliminated,
  )

  const powerName = getLang(power.name, contentLang)
  const powerDesc = getLang(power.description, contentLang)

  return (
    <Modal open={open} onClose={onClose} className="w-full max-w-sm p-6">
      <h2 className="text-lg font-semibold mb-1">⚡ {powerName}</h2>
      <p className="text-sm text-[var(--color-muted)] mb-5">{powerDesc}</p>

      {otherPlayers.length > 0 && (
        <div className="mb-5">
          <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-2">
            {t`Target (optional)`}
          </p>
          <div className="space-y-1">
            {otherPlayers.map((p) => (
              <button
                key={p.player_id}
                type="button"
                onClick={() =>
                  setTargetId(
                    p.player_id === targetId ? undefined : p.player_id,
                  )
                }
                className={`w-full text-left px-3 py-2 rounded border text-sm transition-colors ${
                  targetId === p.player_id
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-dim)]"
                    : "border-[var(--color-border)] hover:bg-white/5"
                }`}
              >
                {p.display_name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="ghost" onClick={onClose} className="flex-1">
          {t`Cancel`}
        </Button>
        <Button
          variant="primary"
          loading={isLoading}
          onClick={() => onUsePower(targetId)}
          className="flex-1"
        >
          {t`Use Power`}
        </Button>
      </div>
    </Modal>
  )
}
