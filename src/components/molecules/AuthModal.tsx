"use client"

import { useEffect, useState } from "react"
import { useLingui } from "@lingui/react/macro"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { Modal } from "@/components/templates/Modal"
import { useLogin, useRegister } from "@/api/hooks/auth"

type AuthMode = "signin" | "register"

type AuthModalProps = {
  open: boolean
  onClose: () => void
}

const getErrorMessage = (error: unknown) => {
  const message =
    typeof error === "object" &&
    error !== null &&
    "body" in error &&
    Array.isArray((error as { body?: { detail?: Array<{ msg?: string }> } }).body?.detail)
      ? (error as { body?: { detail?: Array<{ msg?: string }> } }).body?.detail?.[0]?.msg
      : undefined

  return message || "Something went wrong. Please try again."
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { t } = useLingui()
  const { login, isPending: isLoggingIn, error: loginError } = useLogin()
  const { register, isPending: isRegistering, error: registerError } =
    useRegister()

  const [mode, setMode] = useState<AuthMode>("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")

  useEffect(() => {
    if (!open) {
      setMode("signin")
      setEmail("")
      setPassword("")
      setDisplayName("")
    }
  }, [open])

  const isPending = isLoggingIn || isRegistering
  const errorMessage = loginError
    ? getErrorMessage(loginError)
    : registerError
      ? getErrorMessage(registerError)
      : null

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

    register(
      {
        requestBody: {
          display_name: displayName.trim(),
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
  }

  return (
    <Modal open={open} onClose={isPending ? () => {} : onClose} className="w-full max-w-md">
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
              : t`Create an account to save your stats and come back later.`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] p-1">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              mode === "signin"
                ? "bg-[var(--color-accent)] text-white"
                : "text-[var(--color-muted)]"
            }`}
          >
            {t`Sign in`}
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              mode === "register"
                ? "bg-[var(--color-accent)] text-white"
                : "text-[var(--color-muted)]"
            }`}
          >
            {t`Register`}
          </button>
        </div>

        <div className="space-y-4">
          {mode === "register" ? (
            <Input
              label={t`Display name`}
              value={displayName}
              onChange={setDisplayName}
              placeholder={t`Your name`}
              required
            />
          ) : null}

          <Input
            label={t`Email`}
            value={email}
            onChange={setEmail}
            type="email"
            placeholder="you@example.com"
            required
          />

          <Input
            label={t`Password`}
            value={password}
            onChange={setPassword}
            type="password"
            placeholder={t`Enter password`}
            required
          />
        </div>

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
          disabled={
            !email.trim() ||
            !password.trim() ||
            (mode === "register" && !displayName.trim())
          }
        >
          {mode === "signin" ? t`Sign in` : t`Register`}
        </Button>
      </div>
    </Modal>
  )
}
