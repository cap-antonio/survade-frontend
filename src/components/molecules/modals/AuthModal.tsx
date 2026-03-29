"use client"

import { useEffect, useState } from "react"
import { useLingui } from "@lingui/react/macro"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { ToggleRow } from "@/components/atoms/ToggleRow"
import { PasswordResetModal } from "@/components/molecules/modals/PasswordResetModal"
import { Modal, ModalProps } from "@/components/templates/Modal"
import {
  useLogin,
  useRegister,
  useRequestRegistrationCode,
  useResendRegistrationCode,
} from "@/api/hooks/auth"
import { getErrorMessage } from "@/api/helpers"

type AuthMode = "signin" | "register"

export function AuthModal({ open, onClose }: ModalProps) {
  const { t } = useLingui()
  const {
    login,
    isPending: isLoggingIn,
    error: loginError,
    reset: resetLogin,
  } = useLogin()
  const {
    register,
    isPending: isRegistering,
    error: registerError,
    reset: resetRegister,
  } = useRegister()
  const {
    requestRegistrationCode,
    isPending: isRequestingRegistrationCode,
    error: requestRegistrationCodeError,
    reset: resetRequestRegistrationCode,
  } = useRequestRegistrationCode()
  const {
    resendRegistrationCode,
    isPending: isResendingRegistrationCode,
    error: resendRegistrationCodeError,
    reset: resetResendRegistrationCode,
  } = useResendRegistrationCode()

  const [mode, setMode] = useState<AuthMode>("signin")
  const [email, setEmail] = useState("")
  const [registrationCode, setRegistrationCode] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [registrationEmail, setRegistrationEmail] = useState<string | null>(
    null,
  )
  const [registrationNotice, setRegistrationNotice] = useState<string | null>(
    null,
  )
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false)

  const resetRegisterFlow = () => {
    setRegistrationCode("")
    setPassword("")
    setDisplayName("")
    setRegistrationEmail(null)
    setRegistrationNotice(null)
    resetRegister()
    resetRequestRegistrationCode()
    resetResendRegistrationCode()
  }

  useEffect(() => {
    if (!open) {
      setMode("signin")
      setEmail("")
      setRegistrationCode("")
      setPassword("")
      setDisplayName("")
      setRegistrationEmail(null)
      setRegistrationNotice(null)
      resetRegister()
      resetRequestRegistrationCode()
      resetResendRegistrationCode()
      resetLogin()
      setIsPasswordResetOpen(false)
    }
  }, [
    open,
    resetLogin,
    resetRegister,
    resetRequestRegistrationCode,
    resetResendRegistrationCode,
  ])

  const handleModeChange = (nextMode: AuthMode) => {
    setMode(nextMode)
    setRegistrationNotice(null)
    resetLogin()

    if (nextMode === "signin") {
      resetRegisterFlow()
    }
  }

  const isRegisterStepActive = mode === "register" && !!registrationEmail
  const isPending =
    isLoggingIn ||
    isRegistering ||
    isRequestingRegistrationCode ||
    isResendingRegistrationCode
  const errorMessage = loginError
    ? getErrorMessage(loginError)
    : registerError
      ? getErrorMessage(registerError)
      : requestRegistrationCodeError
        ? getErrorMessage(requestRegistrationCodeError)
        : resendRegistrationCodeError
          ? getErrorMessage(resendRegistrationCodeError)
          : null

  const submitLabel =
    mode === "signin"
      ? t`Sign in`
      : isRegisterStepActive
        ? t`Register`
        : t`Send code`
  const isSubmitDisabled =
    mode === "signin"
      ? !email.trim() || !password.trim()
      : !registrationEmail
        ? !email.trim()
        : !registrationCode.trim() || !password.trim() || !displayName.trim()

  const handleRequestRegistrationCode = () => {
    const trimmedEmail = email.trim()
    resetRegister()
    resetResendRegistrationCode()
    setRegistrationNotice(null)

    requestRegistrationCode(
      {
        requestBody: {
          email: trimmedEmail,
        },
      },
      {
        onSuccess: () => {
          setRegistrationEmail(trimmedEmail)
          setRegistrationNotice(t`We sent a verification code to your email.`)
        },
      },
    )
  }

  const handleResendRegistrationCode = () => {
    if (!registrationEmail) {
      return
    }

    resetRegister()
    resetRequestRegistrationCode()
    setRegistrationNotice(null)

    resendRegistrationCode(
      {
        requestBody: {
          email: registrationEmail,
        },
      },
      {
        onSuccess: () => {
          setRegistrationNotice(
            t`We sent a new verification code to your email.`,
          )
        },
      },
    )
  }

  const handleRegister = () => {
    if (!registrationEmail) {
      handleRequestRegistrationCode()
      return
    }

    resetRequestRegistrationCode()
    resetResendRegistrationCode()
    setRegistrationNotice(null)

    register(
      {
        requestBody: {
          display_name: displayName.trim(),
          email: registrationEmail,
          password,
          code: registrationCode.trim(),
        },
      },
      {
        onSuccess: () => {
          onClose()
        },
      },
    )
  }

  const handleEmailChange = (value: string) => {
    if (mode === "register" && registrationEmail) {
      return
    }

    setEmail(value)
  }

  const handleSubmit = () => {
    if (mode === "signin") {
      login(
        {
          requestBody: {
            email: email.trim(),
            password,
          },
        },
        {
          onSuccess: () => {
            onClose()
          },
        },
      )

      return
    }

    handleRegister()
  }

  const registrationDescription = registrationEmail
    ? t`Enter the code from your email, then finish setting up your account.`
    : t`Start with your email and we'll send you a verification code.`

  return (
    <>
      <Modal
        open={open}
        onClose={isPending ? () => {} : onClose}
        className="w-full max-w-md"
      >
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--color-accent)]">
              {t`Account`}
            </p>
            <h2 className="text-2xl font-black tracking-tight">
              {mode === "signin" ? t`Sign in` : t`Create account`}
            </h2>
            <p className="text-sm text-[var(--color-muted)]">
              {mode === "signin"
                ? t`Continue with your account to track your survival record.`
                : registrationDescription}
            </p>
          </div>

          <ToggleRow
            items={[
              {
                title: t`Sign in`,
                isActive: mode === "signin",
                onClick: () => handleModeChange("signin"),
              },
              {
                title: t`Register`,
                isActive: mode === "register",
                onClick: () => handleModeChange("register"),
              },
            ]}
          />

          <div className="space-y-4">
            <Input
              label={t`Email`}
              value={email}
              onChange={handleEmailChange}
              type="email"
              placeholder="you@example.com"
              disabled={mode === "register" && !!registrationEmail}
              required
            />

            {mode === "signin" ? (
              <div className="space-y-2">
                <Input
                  label={t`Password`}
                  value={password}
                  onChange={setPassword}
                  type="password"
                  placeholder={t`Enter password`}
                  required
                />

                <Button
                  variant="ghost"
                  className="justify-start px-0 py-0 text-sm text-[var(--color-accent)] hover:bg-transparent"
                  onClick={() => setIsPasswordResetOpen(true)}
                >
                  {t`Forgot password?`}
                </Button>
              </div>
            ) : null}

            {isRegisterStepActive ? (
              <>
                <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-muted)]">
                  {t`Code sent to`} {registrationEmail}
                </div>

                <Input
                  label={t`Verification code`}
                  value={registrationCode}
                  onChange={setRegistrationCode}
                  placeholder={t`Enter code`}
                  required
                />

                <Input
                  label={t`Password`}
                  value={password}
                  onChange={setPassword}
                  type="password"
                  placeholder={t`Create password`}
                  required
                />

                <Input
                  label={t`Display name`}
                  value={displayName}
                  onChange={setDisplayName}
                  placeholder={t`Your name`}
                  required
                />

                <Button
                  fullWidth
                  variant="secondary"
                  onClick={handleResendRegistrationCode}
                  loading={isResendingRegistrationCode}
                  disabled={isPending}
                >
                  {t`Resend code`}
                </Button>
              </>
            ) : null}
          </div>

          {registrationNotice ? (
            <div className="rounded-lg border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-3 py-2 text-sm text-[var(--color-text)]">
              {registrationNotice}
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

      <PasswordResetModal
        open={isPasswordResetOpen}
        onClose={() => setIsPasswordResetOpen(false)}
        initialEmail={mode === "signin" ? email.trim() : undefined}
      />
    </>
  )
}
