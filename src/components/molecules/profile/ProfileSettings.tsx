"use client"

import { useState } from "react"
import { useLingui } from "@lingui/react/macro"
import { useRouter } from "next/navigation"
import { getErrorMessage } from "@/api/helpers"
import { useChangePassword } from "@/api/hooks/auth"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { DeleteAccountModal } from "@/components/molecules/modals/DeleteAccountModal"
import { PasswordResetModal } from "@/components/molecules/modals/PasswordResetModal"
import { getLocalizedPath, type SupportedLocale } from "@/i18n"
import { UserCog } from "lucide-react"
import { useAuthStore } from "@/stores/authStore"
import { useMe } from "@/api/hooks/users"

type ProfileSettingsProps = {
  locale: SupportedLocale
}

export function ProfileSettings({
  locale,
}: ProfileSettingsProps): React.ReactElement {
  const { t } = useLingui()
  const router = useRouter()
  const {
    changePassword,
    isPending: isChangingPassword,
    error: changePasswordError,
    reset: resetChangePassword,
  } = useChangePassword()

  const accessToken = useAuthStore((state) => state.accessToken)

  const { data: profile } = useMe({
    enabled: !!accessToken,
  })

  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false)
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [changePasswordNotice, setChangePasswordNotice] = useState<
    string | null
  >(null)

  const passwordsDoNotMatch =
    !!confirmNewPassword.trim() && newPassword !== confirmNewPassword
  const isChangePasswordDisabled =
    !currentPassword.trim() ||
    !newPassword.trim() ||
    !confirmNewPassword.trim() ||
    passwordsDoNotMatch ||
    isChangingPassword

  const handleChangePassword = () => {
    resetChangePassword()
    setChangePasswordNotice(null)

    changePassword(
      {
        requestBody: {
          current_password: currentPassword,
          new_password: newPassword,
        },
      },
      {
        onSuccess: () => {
          setCurrentPassword("")
          setNewPassword("")
          setConfirmNewPassword("")
          setChangePasswordNotice(t`Password changed successfully.`)
        },
      },
    )
  }

  const changePasswordErrorMessage = changePasswordError
    ? getErrorMessage(changePasswordError)
    : null

  return (
    <>
      <section id="settings" className="space-y-4">
        <div className="flex items-center gap-3 pl-2">
          <UserCog className="h-8 w-8 text-accent" />
          <h2 className="text-2xl font-bold tracking-tight">{t`Profile`}</h2>
        </div>
        <p className="pb-4 text-sm text-muted">
          {t`Your settings and preferences.`}
        </p>
        <div className="rounded-3xl border border-border bg-surface p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            {t`Settings`}
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-4xl font-black tracking-tight">
                {profile.display_name}
              </h2>
            </div>

            {profile.favourite_setting ? (
              <div className="rounded-2xl border border-border bg-surface-elevated px-4 py-3 text-sm text-muted">
                <span className="block text-xs uppercase tracking-[0.25em] text-accent">
                  {t`Favourite setting`}
                </span>
                <span className="mt-1 block text-foreground">
                  {profile.favourite_setting}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <section className="flex flex-col gap-4 md:flex-row md:items-stretch">
          <div className="rounded-2xl border border-border bg-surface p-5 md:flex-[1.1]">
            <p className="text-xs uppercase tracking-[0.25em] text-accent">
              {t`Current password`}
            </p>
            <h3 className="mt-3 text-xl font-bold tracking-tight">
              {t`Change current password`}
            </h3>
            <p className="mt-3 text-sm text-muted">
              {t`Use your current password to set a new one for this account.`}
            </p>
            <div className="mt-5 space-y-4">
              <Input
                label={t`Current password`}
                value={currentPassword}
                onChange={setCurrentPassword}
                type="password"
                placeholder={t`Enter password`}
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
              <Input
                label={t`Confirm new password`}
                value={confirmNewPassword}
                onChange={setConfirmNewPassword}
                type="password"
                placeholder={t`Repeat new password`}
                required
              />

              {passwordsDoNotMatch ? (
                <div className="rounded-lg border border-red-800/60 bg-red-950/30 px-3 py-2 text-sm text-red-200">
                  {t`New passwords do not match.`}
                </div>
              ) : null}

              {changePasswordErrorMessage ? (
                <div className="rounded-lg border border-red-800/60 bg-red-950/30 px-3 py-2 text-sm text-red-200">
                  {changePasswordErrorMessage}
                </div>
              ) : null}

              {changePasswordNotice ? (
                <div className="rounded-lg border border-accent/30 bg-primary/10 px-3 py-2 text-sm text-foreground">
                  {changePasswordNotice}
                </div>
              ) : null}
            </div>
            <Button
              variant="secondary"
              className="mt-5"
              onClick={handleChangePassword}
              loading={isChangingPassword}
              disabled={isChangePasswordDisabled}
            >
              {t`Change current password`}
            </Button>
          </div>

          <div className="flex flex-col gap-4 md:flex-[0.9]">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-accent">
                {t`Reset password`}
              </p>
              <h3 className="mt-3 text-xl font-bold tracking-tight">
                {t`Reset by email code`}
              </h3>
              <p className="mt-3 text-sm text-muted">
                {t`Request a code by email, then confirm it with your new password in a separate modal.`}
              </p>
              <Button
                variant="secondary"
                className="mt-5"
                onClick={() => setIsPasswordResetOpen(true)}
              >
                {t`Open password reset`}
              </Button>
            </div>

            <div className="rounded-2xl border border-red-900/40 bg-red-950/10 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-red-300">
                {t`Delete account`}
              </p>
              <h3 className="mt-3 text-xl font-bold tracking-tight">
                {t`Remove profile and statistics`}
              </h3>
              <p className="mt-3 text-sm text-muted">
                {t`Delete your account and wipe all saved profile statistics from Survade.`}
              </p>

              <Button
                variant="danger"
                className="mt-5"
                onClick={() => setIsDeleteAccountOpen(true)}
              >
                {t`Open account deletion`}
              </Button>
            </div>
          </div>
        </section>
      </section>

      <PasswordResetModal
        open={isPasswordResetOpen}
        onClose={() => setIsPasswordResetOpen(false)}
      />
      <DeleteAccountModal
        open={isDeleteAccountOpen}
        onClose={() => setIsDeleteAccountOpen(false)}
        onDeleted={() => {
          router.push(getLocalizedPath(locale))
          router.refresh()
        }}
      />
    </>
  )
}
