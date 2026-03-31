"use client"

import { useLingui } from "@lingui/react/macro"
import { Button } from "@/components/atoms/Button"
import { Modal } from "@/components/templates/Modal"

type ConfirmModalProps = {
  open: boolean
  title: string
  body: string
  actionButtonTitle: string
  onConfirm: () => void
  onClose: () => void
  isLoading?: boolean
}

export function ConfirmModal({
  open,
  title,
  body,
  actionButtonTitle,
  onConfirm,
  onClose,
  isLoading = false,
}: ConfirmModalProps): React.ReactElement {
  const { t } = useLingui()

  return (
    <Modal open={open} onClose={onClose} className="w-full max-w-xs p-6">
      <h2 className="mb-2 font-semibold">{title}</h2>
      <p className="mb-6 text-sm text-muted">{body}</p>
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
          {actionButtonTitle}
        </Button>
      </div>
    </Modal>
  )
}
