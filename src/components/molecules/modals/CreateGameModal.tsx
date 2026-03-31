"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Modal, ModalProps } from "@/components/templates/Modal"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { AdPlaceholder } from "@/components/atoms/AdPlaceholder"
import { useCreateGame } from "@/api/hooks/games"
import { useLingui } from "@lingui/react/macro"
import { getPlayPath, SupportedLocale } from "@/i18n"
import { LocalesButtons } from "@/components/molecules/LocalesButtons"
import { msg } from "@lingui/core/macro"
import { IconButton } from "@/components/atoms/IconButton"
import { MinusIcon, PlusIcon } from "lucide-react"
import { ToggleButton } from "@/components/atoms/ToggleButton"
import { MessageDescriptor } from "@lingui/core"
import { clearOtherStoredGameSessions } from "@/utils/gameSessionStorage"

type GameParamType = {
  withAd: boolean
  label: MessageDescriptor
} & Record<"key" | "emoji", string>

const DEFAULT_SCENARIO: GameParamType = {
  key: "mars",
  emoji: "🔴",
  label: msg`Mars`,
  withAd: false,
}
const SCENARIOS: GameParamType[] = [
  DEFAULT_SCENARIO,
  { key: "orbit", emoji: "🚀", label: msg`Orbit`, withAd: true },
  { key: "siege", emoji: "⚔️", label: msg`Siege`, withAd: true },
  { key: "ship", emoji: "🚢", label: msg`Ship`, withAd: true },
  { key: "pandemic", emoji: "🦠", label: msg`Pandemic`, withAd: true },
  { key: "portal", emoji: "⏳", label: msg`Portal`, withAd: true },
]

const ATTRS: GameParamType[] = [
  { key: "role", emoji: "👤", label: msg`Profession`, withAd: false },
  { key: "gender", emoji: "⚧", label: msg`Gender`, withAd: false },
  { key: "health", emoji: "❤️", label: msg`Health`, withAd: false },
  { key: "dark_secret", emoji: "🔒", label: msg`Dark Secret`, withAd: false },
  { key: "special_skill", emoji: "⚡", label: msg`Skill`, withAd: false },
  { key: "phobia", emoji: "😨", label: msg`Phobia`, withAd: false },
  { key: "inventory_item", emoji: "🎒", label: msg`Item`, withAd: false },
  { key: "personality_trait", emoji: "🎭", label: msg`Trait`, withAd: false },
  { key: "hobby", emoji: "🎨", label: msg`Hobby`, withAd: false },
]

const DEFAUT_TYPE: GameParamType = {
  key: "classic",
  emoji: "🏕",
  label: msg`Classic`,
  withAd: false,
}
const SABOTEUR_KEY = "with_saboteur"
const TYPE: GameParamType[] = [
  DEFAUT_TYPE,
  { key: SABOTEUR_KEY, emoji: "☠️", label: msg`With Saboteur`, withAd: true },
]

const fallbackLoadingPhrase = msg`Almost ready...`

const LOADING_PHRASES = [
  msg`Generating scenario...`,
  msg`Assigning character cards...`,
  msg`Sealing the safe place...`,
  msg`Hiding secrets...`,
  fallbackLoadingPhrase,
]

const MIN_PLAYERS = 6
const MAX_PLAYERS = 16
const MIN_LANGS = 1
const MAX_LANGS = 3

const saboteurCountByPlayers: Record<number, number> = {
  4: 1,
  5: 1,
  6: 1,
  7: 2,
  8: 2,
  9: 2,
  10: 2,
  11: 2,
  12: 2,
  13: 2,
  14: 2,
  15: 2,
  16: 2,
}

export function CreateGameModal({ open, onClose }: ModalProps) {
  const { t, i18n } = useLingui()
  const router = useRouter()
  const { createGame, isPending, isError } = useCreateGame()

  const [settingKey, setSettingKey] = useState<GameParamType>(DEFAULT_SCENARIO)
  const [langs, setLangs] = useState<SupportedLocale[]>(["en"])
  const [gameType, setGameType] = useState<GameParamType>(DEFAUT_TYPE)
  const [playerCount, setPlayerCount] = useState(MIN_PLAYERS)
  const [hostName, setHostName] = useState("")
  const [loadingPhraseIdx, setLoadingPhraseIdx] = useState(0)

  const isSaboteurMode = gameType.key === SABOTEUR_KEY

  const toggleLang = (code: SupportedLocale): void => {
    setLangs((prev) => {
      if (prev.includes(code)) {
        if (prev.length === MIN_LANGS) return prev // at least one
        return prev.filter((l) => l !== code)
      }
      if (prev.length >= MAX_LANGS) return prev // max 3
      return [...prev, code]
    })
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
          setting_key: settingKey.key,
          saboteur_mode: isSaboteurMode,
          langs,
          attrs: ATTRS.map(({ key }) => key),
          player_count: playerCount,
          host_display_name: hostName.trim(),
        },
      },
      {
        onSuccess: (data) => {
          clearInterval(phraseInterval)
          clearOtherStoredGameSessions(data.game_code)
          localStorage.setItem(`host_token_${data.game_code}`, data.host_token)
          localStorage.setItem(
            `player_token_${data.game_code}`,
            data.player_token,
          )
          localStorage.setItem(
            `player_id_${data.game_code}`,
            String(data.player_id),
          )
          router.push(getPlayPath(i18n.locale as SupportedLocale, data.game_code))
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
          <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="text-sm text-muted font-mono animate-pulse">
            {i18n._(LOADING_PHRASES[loadingPhraseIdx] ?? fallbackLoadingPhrase)}
          </p>
          <div className="w-full h-1 bg-surface-elevated rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-[progress_10s_linear_forwards] rounded-full" />
          </div>
          <AdPlaceholder slot="scenario_loading" />
        </div>
      ) : (
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-bold tracking-tight">{t`Create Game`}</h2>

          {/* Setting */}
          <div>
            <label className="block text-xs text-muted uppercase tracking-wider mb-2">
              {t`Scenario`}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SCENARIOS.map((s) => (
                <ToggleButton
                  key={s.key}
                  onClick={() => setSettingKey(s)}
                  isActive={settingKey.key === s.key}
                >
                  <div className="flex gap-2 text-sm">
                    <span>{s.emoji}</span>
                    <span className="truncate">{i18n._(s.label)}</span>
                  </div>
                </ToggleButton>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div>
            <label className="block text-xs text-muted uppercase tracking-wider mb-2">
              {t`Game Mode`}
            </label>
            <div className="flex gap-2">
              {TYPE.map((m) => (
                <ToggleButton
                  key={String(m.key)}
                  className="flex-1 px-3 py-2 !text-sm"
                  isActive={gameType.key === m.key}
                  onClick={() => setGameType(m)}
                >{`${m.emoji} ${i18n._(m.label)}`}</ToggleButton>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-xs text-muted uppercase tracking-wider mb-2">
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
            <label className="block text-xs text-muted uppercase tracking-wider mb-2">
              {t`Card Attributes`}
            </label>
            <div className="flex flex-wrap gap-2">
              {ATTRS.map((attr) => {
                return (
                  <ToggleButton
                    key={attr.key}
                    // onClick={() => toggleAttr(attr)}
                    // isActive={attrs.some(({ key }) => key === attr.key)}
                    isActive={true}
                  >
                    {`${attr.emoji} ${i18n._(attr.label)}`}
                  </ToggleButton>
                )
              })}
            </div>
          </div>

          {/* Player count */}
          <div>
            <label className="block text-xs text-muted uppercase tracking-wider mb-2">
              {t`Players`}
            </label>
            <div className="flex justify-center items-center gap-4">
              <IconButton
                variant="primary"
                Icon={<MinusIcon />}
                disabled={playerCount === MIN_PLAYERS}
                onClick={() =>
                  setPlayerCount((prev) => {
                    if (prev > MIN_PLAYERS) {
                      return (prev -= 1)
                    }
                    return prev
                  })
                }
              />
              <span className="text-accent font-bold text-3xl">
                {playerCount}
              </span>
              <IconButton
                variant="primary"
                Icon={<PlusIcon />}
                disabled={playerCount === MAX_PLAYERS}
                onClick={() =>
                  setPlayerCount((prev) => {
                    if (prev < MAX_PLAYERS) {
                      return (prev += 1)
                    }
                    return prev
                  })
                }
              />
            </div>
            <div className="flex gap-2 justify-center mt-3">
              {isSaboteurMode && (
                <ToggleButton>{` ☠️ ${t`Saboteurs in game`}: ${saboteurCountByPlayers[playerCount] ?? 1}`}</ToggleButton>
              )}
              <ToggleButton>{`${t`Max survivors count`}: ${Math.floor(playerCount / 2)}`}</ToggleButton>
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
