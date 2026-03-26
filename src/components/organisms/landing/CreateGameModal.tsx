"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import cn from "classnames"
import { Modal } from "@/components/atoms/Modal"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { AdPlaceholder } from "@/components/atoms/AdPlaceholder"
import { useCreateGame } from "@/api/hooks/games"
import { useLingui } from "@lingui/react/macro"
import { getLocalizedPath, LANGS_DICT, SupportedLocale } from "@/i18n"
import { LocalesButtons } from "@/components/molecules/LocalesButtons"

const SETTINGS = [
  { key: "mars", emoji: "🔴", label: "Mars", free: true },
  { key: "orbit", emoji: "🚀", label: "Orbit", free: false },
  { key: "siege", emoji: "⚔️", label: "Siege", free: false },
  { key: "ship", emoji: "🚢", label: "Ship", free: false },
  { key: "pandemic", emoji: "🦠", label: "Pandemic", free: false },
  { key: "portal", emoji: "⏳", label: "Portal", free: false },
] as const

const FREE_ATTRS = [
  "role",
  "gender",
  "health",
  "dark_secret",
  "special_skill",
] as const
const PREMIUM_ATTRS = ["phobia", "inventory_item", "personality_trait"] as const

const ATTR_LABELS: Record<string, string> = {
  role: "👤 Profession",
  gender: "⚧ Gender",
  health: "❤️ Health",
  dark_secret: "🔒 Dark Secret",
  special_skill: "⚡ Skill",
  phobia: "😨 Phobia",
  inventory_item: "🎒 Item",
  personality_trait: "🎭 Trait",
}

const LOADING_PHRASES = [
  "Generating scenario...",
  "Assigning character cards...",
  "Sealing the safe place...",
  "Hiding secrets...",
  "Almost ready...",
]

type CreateGameModalProps = {
  open: boolean
  onClose: () => void
}

export function CreateGameModal({ open, onClose }: CreateGameModalProps) {
  const { t, i18n } = useLingui()
  const router = useRouter()
  const { createGame, isPending, isError } = useCreateGame()

  const [settingKey, setSettingKey] = useState<string>("mars")
  const [saboteurMode, setSaboteurMode] = useState(false)
  const [langs, setLangs] = useState<SupportedLocale[]>(["en"])
  const [attrs, setAttrs] = useState<string[]>([...FREE_ATTRS])
  const [playerCount, setPlayerCount] = useState(6)
  const [hostName, setHostName] = useState("")
  const [loadingPhraseIdx, setLoadingPhraseIdx] = useState(0)

  const toggleLang = (code: SupportedLocale): void => {
    setLangs((prev) => {
      if (prev.includes(code)) {
        if (prev.length === 1) return prev // at least one
        return prev.filter((l) => l !== code)
      }
      if (prev.length >= 3) return prev // max 3
      return [...prev, code]
    })
  }

  const toggleAttr = (attr: string): void => {
    setAttrs((prev) =>
      prev.includes(attr) ? prev.filter((a) => a !== attr) : [...prev, attr],
    )
  }

  const handleSubmit = (): void => {
    if (!hostName.trim()) return

    let phraseInterval: ReturnType<typeof setInterval> | undefined
    phraseInterval = setInterval(() => {
      setLoadingPhraseIdx((i) => (i + 1) % LOADING_PHRASES.length)
    }, 2500)

    createGame(
      {
        requestBody: {
          setting_key: settingKey,
          saboteur_mode: saboteurMode,
          langs,
          attrs,
          player_count: playerCount,
          host_display_name: hostName.trim(),
        },
      },
      {
        onSuccess: (data) => {
          clearInterval(phraseInterval)
          localStorage.setItem(`host_token_${data.game_code}`, data.host_token)
          localStorage.setItem(
            `player_token_${data.game_code}`,
            data.player_token,
          )
          localStorage.setItem(
            `player_id_${data.game_code}`,
            String(data.player_id),
          )
          router.push(
            getLocalizedPath(i18n.locale as SupportedLocale, data.game_code),
          )
        },
        onError: () => {
          clearInterval(phraseInterval)
        },
      },
    )
  }

  return (
    <Modal
      open={open}
      onClose={isPending ? () => {} : onClose}
      className="w-full max-w-lg"
    >
      {isPending ? (
        <div className="flex flex-col items-center justify-center gap-6 p-8 min-h-[360px]">
          <div className="w-12 h-12 rounded-full border-2 border-[var(--color-accent)] border-t-transparent animate-spin" />
          <p className="text-sm text-[var(--color-muted)] font-mono animate-pulse">
            {LOADING_PHRASES[loadingPhraseIdx]}
          </p>
          <div className="w-full h-1 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--color-accent)] animate-[progress_10s_linear_forwards] rounded-full" />
          </div>
          <AdPlaceholder slot="scenario_loading" />
        </div>
      ) : (
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-bold tracking-tight">{t`Create Game`}</h2>

          {/* Setting */}
          <div>
            <label className="block text-xs text-[var(--color-muted)] uppercase tracking-wider mb-2">
              {t`Scenario`}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SETTINGS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => s.free && setSettingKey(s.key)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded border text-sm transition-colors",
                    settingKey === s.key
                      ? "border-[var(--color-accent)] bg-[var(--color-accent-dim)] text-[var(--color-text)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)]",
                    !s.free && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <span>{s.emoji}</span>
                  <span className="truncate">{s.label}</span>
                  {!s.free && <span className="ml-auto text-xs">🔒</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div>
            <label className="block text-xs text-[var(--color-muted)] uppercase tracking-wider mb-2">
              {t`Game Mode`}
            </label>
            <div className="flex gap-2">
              {[
                { key: false, emoji: "🏕", label: t`Classic` },
                {
                  key: true,
                  emoji: "☠️",
                  label: t`With Saboteur`,
                  premium: true,
                },
              ].map((m) => (
                <button
                  key={String(m.key)}
                  type="button"
                  onClick={() => !m.premium && setSaboteurMode(m.key)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded border text-sm transition-colors",
                    saboteurMode === m.key
                      ? "border-[var(--color-accent)] bg-[var(--color-accent-dim)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)]",
                    m.premium && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {m.emoji} {m.label} {m.premium && "🔒"}
                </button>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-xs text-[var(--color-muted)] uppercase tracking-wider mb-2">
              {t`Languages`}
              <span className="normal-case">(max 3)</span>
            </label>
            <LocalesButtons
              activeLocales={langs}
              onChange={(code) => toggleLang(code)}
            />
          </div>

          {/* Attributes */}
          <div>
            <label className="block text-xs text-[var(--color-muted)] uppercase tracking-wider mb-2">
              {t`Card Attributes`}
            </label>
            <div className="flex flex-wrap gap-2">
              {([...FREE_ATTRS, ...PREMIUM_ATTRS] as string[]).map((attr) => {
                const isPremium = (PREMIUM_ATTRS as readonly string[]).includes(
                  attr,
                )
                return (
                  <button
                    key={attr}
                    type="button"
                    onClick={() => !isPremium && toggleAttr(attr)}
                    className={cn(
                      "px-3 py-1.5 rounded border text-xs transition-colors",
                      attrs.includes(attr)
                        ? "border-[var(--color-accent)] bg-[var(--color-accent-dim)] text-[var(--color-text)]"
                        : "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)]",
                      isPremium && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    {ATTR_LABELS[attr] ?? attr} {isPremium && "🔒"}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Player count */}
          <div>
            <label className="block text-xs text-[var(--color-muted)] uppercase tracking-wider mb-2">
              {`${t`Players`}: ${playerCount}`}
            </label>
            <input
              type="range"
              min={4}
              max={10}
              value={playerCount}
              onChange={(e) => setPlayerCount(Number(e.target.value))}
              className="w-full accent-[var(--color-accent)]"
            />
            <div className="flex justify-between text-xs text-[var(--color-muted)] mt-1">
              <span>4</span>
              <span>10</span>
            </div>
          </div>

          <Input
            value={hostName}
            onChange={setHostName}
            placeholder={t`Enter your name`}
            maxLength={30}
            label={t`Your name in game`}
            required
          />

          {isError && (
            <p className="text-xs text-red-400">
              {t`Failed to create game. Please try again.`}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={onClose} className="flex-1">
              {t`Cancel`}
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!hostName.trim()}
              className="flex-1"
            >
              {t`Create Game`}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
