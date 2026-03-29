"use client"

import { Trans, useLingui } from "@lingui/react/macro"
import { Button } from "@/components/atoms/Button"

type HostControlsProps = {
  votingPhase: boolean
  onStartVoting: () => void
  onEndVoting: () => void
  isStartingVote?: boolean
  isEndingVote?: boolean
}

export function HostControls({
  votingPhase,
  onStartVoting,
  onEndVoting,
  isStartingVote = false,
  isEndingVote = false,
}: HostControlsProps) {
  const { t } = useLingui()
  return (
    <div className="flex items-center gap-3 p-3 bg-surface-elevated border border-border rounded-lg">
      <span className="text-xs text-muted uppercase tracking-wider shrink-0">
        {t`Host`}
      </span>
      {!votingPhase ? (
        <Button
          variant="danger"
          size="sm"
          onClick={onStartVoting}
          loading={isStartingVote}
        >
          {t`Start Voting`}
        </Button>
      ) : (
        <Button
          variant="primary"
          size="sm"
          onClick={onEndVoting}
          loading={isEndingVote}
        >
          {t`End Voting`}
        </Button>
      )}
      {votingPhase && (
        <span className="text-xs text-accent animate-pulse">
          {t`Voting in progress…`}
        </span>
      )}
    </div>
  )
}
