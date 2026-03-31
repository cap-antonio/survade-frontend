"use client"

import { Trans, useLingui } from "@lingui/react/macro"
import { Button } from "@/components/atoms/Button"
import { useSearchParams } from "next/navigation"
import { useEndVoting, useGameQuery, useStartVoting } from "@/api/hooks/games"
import { GamePhase } from "@/api/services"

export function HostControls() {
  const { t } = useLingui()
  const searchParams = useSearchParams()

  const code = searchParams.get("code")?.trim().toUpperCase() ?? ""
  const hostToken =
    typeof window !== "undefined"
      ? (localStorage.getItem(`host_token_${code}`) ?? "")
      : ""

  const { data } = useGameQuery(
    {
      gameCode: code,
      xHostToken: hostToken,
    },
    { enabled: !!code && !!hostToken },
  )

  const { endVoting, isPending: isPendingEndVoting } = useEndVoting()
  const { startVoting, isPending: isPendingStartVoting } = useStartVoting()

  const isVoting = data?.phase === GamePhase.VOTING

  const gameParams = { gameCode: code, xHostToken: hostToken } as const

  return data ? (
    <div className="flex items-center gap-3 p-3 bg-surface-elevated border border-border rounded-lg">
      <span className="text-xs text-muted uppercase tracking-wider shrink-0">
        {t`Host`}
      </span>
      {!data.voting_enabled ? (
        <div className="flex max-sm:flex-col max-sm:mx-auto items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => code && endVoting(gameParams)}
            loading={isPendingEndVoting}
          >
            {t`Next round`}
          </Button>

          <p className="text-sm text-muted leading-relaxed text-center">{t`There is no voting for this round`}</p>
        </div>
      ) : isVoting ? (
        <Button
          variant="primary"
          size="sm"
          onClick={() => code && endVoting(gameParams)}
          loading={isPendingEndVoting}
        >
          {t`End Voting`}
        </Button>
      ) : (
        <Button
          variant="danger"
          size="sm"
          onClick={() => startVoting(gameParams)}
          loading={isPendingStartVoting}
        >
          {t`Start Voting`}
        </Button>
      )}
      {isVoting && (
        <span className="text-xs text-accent animate-pulse">
          {t`Voting in progress…`}
        </span>
      )}
    </div>
  ) : null
}
