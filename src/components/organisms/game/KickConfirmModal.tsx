"use client"

import { useLingui } from "@lingui/react/macro"
import { Modal } from "@/components/atoms/Modal"
import { Button } from "@/components/atoms/Button"

type KickConfirmModalProps = {
  open: boolean
  playerName: string
  onConfirm: () => void
  onClose: () => void
  isLoading?: boolean
}

export function KickConfirmModal({
  open,
  playerName,
  onConfirm,
  onClose,
  isLoading = false,
}: KickConfirmModalProps) {
  const { t } = useLingui()
  return (
    <Modal open={open} onClose={onClose} className="w-full max-w-xs p-6">
      <h2 className="font-semibold mb-2">{t`Remove player?`}</h2>
      <p className="text-sm text-[var(--color-muted)] mb-6">
        {t`Remove ${playerName} from the game?`}
      </p>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onClose} className="flex-1">
          {t`Cancel`}
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          loading={isLoading}
          className="flex-1"
        >
          {t`Remove`}
        </Button>
      </div>
    </Modal>
  )
}
