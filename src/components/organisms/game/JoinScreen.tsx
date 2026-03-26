"use client"

import { useState } from "react"
import { useLingui } from "@lingui/react/macro"
import { Input } from "@/components/atoms/Input"
import { Button } from "@/components/atoms/Button"
import { useJoinGame } from "@/api/hooks/games"
import { useGameStore } from "@/stores/gameStore"

type JoinScreenProps = {
  code: string
}

export function JoinScreen({ code }: JoinScreenProps) {
  const { t } = useLingui()
  const [name, setName] = useState("")
  const { joinGame, isError, isPending } = useJoinGame()
  const { setSession } = useGameStore()

  const handleJoin = (): void => {
    if (!name.trim()) return
    joinGame(
      { requestBody: { display_name: name.trim() }, gameCode: code },
      {
        onSuccess: (data) => {
          localStorage.setItem(`player_token_${code}`, data.player_token)
          localStorage.setItem(`player_id_${code}`, String(data.player_id))
          setSession({
            myPlayerId: data.player_id,
            myToken: data.player_token,
            hostToken: null,
          })
        },
      },
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tighter mb-1">
            <span className="text-[var(--color-text)]">SUR</span>
            <span className="text-[var(--color-accent)]">VADE</span>
          </h1>
          <p className="text-[var(--color-muted)] text-sm">
            {t`Game`}:{" "}
            <span className="font-mono text-[var(--color-text)]">{code}</span>
          </p>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 space-y-4">
          <h2 className="font-semibold">{t`Join the Game`}</h2>
          <Input
            value={name}
            onChange={setName}
            placeholder={t`Your name`}
            maxLength={30}
          />
          {isError && (
            <p className="text-xs text-red-400">
              {t`Could not join. The game may be full or already started.`}
            </p>
          )}
          <Button
            variant="primary"
            fullWidth
            disabled={!name.trim()}
            loading={isPending}
            onClick={handleJoin}
          >
            {t`Join Game`}
          </Button>
        </div>
      </div>
    </div>
  )
}
