"use client"

import { useEffect, useState } from "react"
import { useLingui } from "@lingui/react/macro"
import { getErrorMessage } from "@/api/helpers"
import { useDeleteAccount } from "@/api/hooks/users"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { Modal, ModalProps } from "@/components/templates/Modal"

type DeleteAccountModalProps = ModalProps & {
  onDeleted?: () => void
}

export function DeleteAccountModal({
  open,
  onClose,
  onDeleted,
}: DeleteAccountModalProps) {
  const { t } = useLingui()
  const {
    deleteAccount,
    isPending,
    error,
    reset,
  } = useDeleteAccount()
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (!open) {
      setPassword("")
      reset()
    }
  }, [open, reset])

  const errorMessage = error ? getErrorMessage(error) : null

  const handleDelete = () => {
    deleteAccount(
      {
        requestBody: {
          password,
        },
      },
      {
        onSuccess: () => {
          onClose()
          onDeleted?.()
        },
      },
    )
  }

  return (
    <Modal
      open={open}
      onClose={isPending ? () => {} : onClose}
      className="w-full max-w-md"
    >
      <div className="space-y-5 p-6">
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-red-300">
            {t`Danger zone`}
          </p>
          <h2 className="text-2xl font-black tracking-tight">
            {t`Delete account`}
          </h2>
          <p className="text-sm text-muted">
            {t`This will permanently delete your account and all of your saved statistics.`}
          </p>
          <p className="text-sm text-muted">
            {t`You will still be able to play Survade afterwards, but your profile history will be gone.`}
          </p>
        </div>

        <div className="rounded-xl border border-red-900/60 bg-red-950/20 px-4 py-3 text-sm text-red-100">
          {t`This action cannot be undone.`}
        </div>

        <Input
          label={t`Current password`}
          value={password}
          onChange={setPassword}
          type="password"
          placeholder={t`Enter password`}
          required
        />

        {errorMessage ? (
          <div className="rounded-lg border border-red-800/60 bg-red-950/30 px-3 py-2 text-sm text-red-200">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="secondary"
            className="sm:flex-1"
            onClick={onClose}
            disabled={isPending}
          >
            {t`Cancel`}
          </Button>
          <Button
            variant="danger"
            className="sm:flex-1"
            onClick={handleDelete}
            loading={isPending}
            disabled={!password.trim()}
          >
            {t`Delete account`}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
