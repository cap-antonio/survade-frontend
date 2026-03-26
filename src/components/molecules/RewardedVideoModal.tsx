"use client"

import { Modal } from "@/components/atoms/Modal"
import { Button } from "@/components/atoms/Button"
import { useUnlockRewarded } from "@/api/hooks/games"
import { UnlockRewardedRequest } from "@/api/services"
import { useLingui } from "@lingui/react/macro"

type RewardedVideoModalProps = {
  open: boolean
  onClose: () => void
  gameCode: string
  hostToken: string
  feature: UnlockRewardedRequest.feature
}

export function RewardedVideoModal({
  open,
  onClose,
  gameCode,
  hostToken,
  feature,
}: RewardedVideoModalProps) {
  const { t } = useLingui()
  const { unlockRewarded, isPending } = useUnlockRewarded()

  const handleWatch = (): void => {
    // TODO: replace with real rewarded video SDK (AdMob, IronSource)
    // data-rewarded-slot is the anchor for the future SDK
    unlockRewarded(
      {
        requestBody: { feature, ad_provider_token: "mock_token" },
        gameCode,
        xHostToken: hostToken,
      },
      { onSuccess: onClose },
    )
  }

  return (
    <Modal open={open} onClose={onClose} className="w-full max-w-sm p-6">
      <h2 className="text-lg font-semibold mb-2">
        {t`Unlock Premium Feature`}
      </h2>
      <p className="text-sm text-[var(--color-muted)] mb-6">
        {t`Watch a short ad to unlock this feature for this session.`}
      </p>
      <div
        data-rewarded-slot={feature}
        className="w-full h-[200px] mb-6 border border-dashed border-white/10 rounded flex items-center justify-center text-[var(--color-muted)] text-xs font-mono"
        aria-hidden="true"
      >
        ad · rewarded
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onClose} className="flex-1">
          {t`Cancel`}
        </Button>
        <Button
          variant="primary"
          onClick={handleWatch}
          loading={isPending}
          className="flex-1"
        >
          {t`Watch Ad`}
        </Button>
      </div>
    </Modal>
  )
}
