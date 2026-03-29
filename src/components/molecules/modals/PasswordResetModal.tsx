"use client"

import { useEffect, useState } from "react"
import { useLingui } from "@lingui/react/macro"
import { getErrorMessage } from "@/api/helpers"
import {
  useConfirmPasswordReset,
  useRequestPasswordReset,
} from "@/api/hooks/auth"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { Modal, ModalProps } from "@/components/templates/Modal"

type PasswordResetModalProps = ModalProps & {
  initialEmail?: string
}

export function PasswordResetModal({
  open,
  onClose,
  initialEmail,
}: PasswordResetModalProps) {
  const { t } = useLingui()
  const {
    requestPasswordReset,
    isPending: isRequestingResetCode,
    error: requestResetError,
    reset: resetRequestPasswordReset,
  } = useRequestPasswordReset()
  const {
    confirmPasswordReset,
    isPending: isConfirmingPasswordReset,
    error: confirmResetError,
    reset: resetConfirmPasswordReset,
  } = useConfirmPasswordReset()

  const [email, setEmail] = useState(initialEmail ?? "")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [requestedEmail, setRequestedEmail] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setEmail(initialEmail ?? "")
      setCode("")
      setNewPassword("")
      setRequestedEmail(null)
      setNotice(null)
      resetRequestPasswordReset()
      resetConfirmPasswordReset()
    }
  }, [
    initialEmail,
    open,
    resetConfirmPasswordReset,
    resetRequestPasswordReset,
  ])

  const isPending = isRequestingResetCode || isConfirmingPasswordReset
  const isCodeStepActive = !!requestedEmail
  const errorMessage = requestResetError
    ? getErrorMessage(requestResetError)
    : confirmResetError
      ? getErrorMessage(confirmResetError)
      : null

  const handleRequestCode = () => {
    const trimmedEmail = email.trim()
    resetConfirmPasswordReset()
    setNotice(null)

    requestPasswordReset(
      {
        requestBody: {
          email: trimmedEmail,
        },
      },
      {
        onSuccess: () => {
          setRequestedEmail(trimmedEmail)
          setNotice(t`We sent a password reset code to your email.`)
        },
      },
    )
  }

  const handleRequestCodeAgain = () => {
    if (!requestedEmail) {
      return
    }

    resetConfirmPasswordReset()
    setNotice(null)

    requestPasswordReset(
      {
        requestBody: {
          email: requestedEmail,
        },
      },
      {
        onSuccess: () => {
          setNotice(t`We sent a fresh password reset code to your email.`)
        },
      },
    )
  }

  const handleConfirmReset = () => {
    if (!requestedEmail) {
      handleRequestCode()
      return
    }

    resetRequestPasswordReset()
    setNotice(null)

    confirmPasswordReset(
      {
        requestBody: {
          email: requestedEmail,
          code: code.trim(),
          new_password: newPassword,
        },
      },
      {
        onSuccess: () => {
          setNotice(t`Password updated. You can now sign in with the new one.`)
          setCode("")
          setNewPassword("")
          setRequestedEmail(null)
        },
      },
    )
  }

  const handleSubmit = () => {
    if (isCodeStepActive) {
      handleConfirmReset()
      return
    }

    handleRequestCode()
  }

  const submitLabel = isCodeStepActive ? t`Save new password` : t`Send code`
  const isSubmitDisabled = isCodeStepActive
    ? !code.trim() || !newPassword.trim()
    : !email.trim()

  return (
    <Modal
      open={open}
      onClose={isPending ? () => {} : onClose}
      className="w-full max-w-md"
    >
      <div className="space-y-5 p-6">
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--color-accent)]">
            {t`Account`}
          </p>
          <h2 className="text-2xl font-black tracking-tight">
            {t`Reset password`}
          </h2>
          <p className="text-sm text-[var(--color-muted)]">
            {isCodeStepActive
              ? t`Enter the code from your email and choose a new password.`
              : t`Request a reset code and we'll email it to you.`}
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label={t`Email`}
            value={email}
            onChange={setEmail}
            type="email"
            placeholder="you@example.com"
            disabled={isCodeStepActive}
            required
          />

          {isCodeStepActive ? (
            <>
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-muted)]">
                {t`Code sent to`} {requestedEmail}
              </div>

              <Input
                label={t`Verification code`}
                value={code}
                onChange={setCode}
                placeholder={t`Enter code`}
                required
              />

              <Input
                label={t`New password`}
                value={newPassword}
                onChange={setNewPassword}
                type="password"
                placeholder={t`Create password`}
                required
              />

              <Button
                fullWidth
                variant="secondary"
                onClick={handleRequestCodeAgain}
                loading={isRequestingResetCode}
                disabled={isPending}
              >
                {t`Request code again`}
              </Button>
            </>
          ) : null}
        </div>

        {notice ? (
          <div className="rounded-lg border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-3 py-2 text-sm text-[var(--color-text)]">
            {notice}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-lg border border-red-800/60 bg-red-950/30 px-3 py-2 text-sm text-red-200">
            {errorMessage}
          </div>
        ) : null}

        <Button
          fullWidth
          size="lg"
          onClick={handleSubmit}
          loading={isPending}
          disabled={isSubmitDisabled}
        >
          {submitLabel}
        </Button>
      </div>
    </Modal>
  )
}
