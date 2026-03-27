"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLingui } from "@lingui/react/macro"
import { LogOut, ShieldUser, UserRound } from "lucide-react"
import { IconButton } from "@/components/atoms/IconButton"
import { AuthModal } from "./AuthModal"
import { useLogout } from "@/api/hooks/auth"
import { useAuthStore } from "@/stores/authStore"
import { getLocalizedPath, type SupportedLocale } from "@/i18n"
import { Dropdown } from "@/components/atoms/Dropdown"

type AuthMenuProps = {
  locale: SupportedLocale
}

export function AuthMenu({ locale }: AuthMenuProps) {
  const { t } = useLingui()
  const router = useRouter()
  const accessToken = useAuthStore((state) => state.accessToken)
  const { logout, isPending } = useLogout()

  const [open, setOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleSignOut = () => {
    logout(undefined, {
      onSettled: () => {
        setOpen(false)
        router.refresh()
      },
    })
  }

  const handleOpenAuth = () => {
    setOpen(false)
    setShowAuthModal(true)
  }

  return (
    <>
      <Dropdown
        open={open}
        setOpen={setOpen}
        items={
          accessToken ? (
            <>
              <Link
                href={getLocalizedPath(locale, "statistics")}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)]"
                onClick={() => setOpen(false)}
              >
                <ShieldUser className="h-4 w-4 text-[var(--color-accent)]" />
                <span>{t`Statistics`}</span>
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={isPending}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <LogOut className="h-4 w-4 text-[var(--color-accent)]" />
                <span>{t`Sign out`}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleOpenAuth}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)]"
            >
              <UserRound className="h-4 w-4 text-[var(--color-accent)]" />
              <span>{t`Sign in`}</span>
            </button>
          )
        }
      >
        <IconButton
          label={accessToken ? t`Account menu` : t`Sign in`}
          onClick={() => setOpen((value) => !value)}
          className="backdrop-blur-sm"
          Icon={<UserRound className="h-4 w-4" />}
        />
      </Dropdown>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
