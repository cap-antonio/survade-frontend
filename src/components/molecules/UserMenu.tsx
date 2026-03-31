"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useLingui } from "@lingui/react/macro"
import { Globe2, LogOut, ShieldUser, UserRound } from "lucide-react"
import { IconButton } from "@/components/atoms/IconButton"
import { AuthModal } from "./modals/AuthModal"
import { useLogout } from "@/api/hooks/auth"
import { useAuthStore } from "@/stores/authStore"
import { LocalesButtons } from "./LocalesButtons"
import {
  getLocalizedPath,
  getPlayPath,
  setLocale,
  type SupportedLocale,
} from "@/i18n"
import { Dropdown } from "@/components/atoms/Dropdown"
import classNames from "classnames"
import { isActivePath, normalizePath } from "@/utils/string"

type NavigationItem = {
  href: string
  label: string
}

type UserMenuProps = {
  navigationItems?: NavigationItem[]
}

export function UserMenu({
  navigationItems = [],
}: UserMenuProps): React.ReactElement {
  const { t, i18n } = useLingui()
  const pathname = usePathname()
  const currentPath = normalizePath(pathname)

  const router = useRouter()
  const isAuth = useAuthStore((state) => state.isAuth)
  const { logout, isPending } = useLogout()

  const [open, setOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const locale = i18n.locale as SupportedLocale

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

  const handleLocaleChange = (code: SupportedLocale) => {
    setOpen(false)
    void setLocale(code)

    if (typeof window !== "undefined") {
      const gameCode = new URLSearchParams(window.location.search).get("code")
      const currentPlayPath = getLocalizedPath(locale, "play")

      if (window.location.pathname === currentPlayPath && gameCode) {
        router.push(getPlayPath(code, gameCode))
        return
      }
    }

    router.push(getLocalizedPath(code))
  }

  return (
    <>
      <Dropdown
        open={open}
        setOpen={setOpen}
        items={
          <div className="space-y-2">
            {navigationItems.length > 0 ? (
              <div className="space-y-1 md:hidden">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={classNames(
                      "flex items-center rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface-elevated",
                      {
                        "text-primary": isActivePath(item.href, pathname),
                        "hover:text-foreground": !isActivePath(
                          item.href,
                          pathname,
                        ),
                      },
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            ) : null}

            {navigationItems.length > 0 ? (
              <div className="border-t border-border md:hidden" />
            ) : null}

            {isAuth ? (
              <>
                <Link
                  href={getLocalizedPath(locale, "profile")}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface-elevated"
                  onClick={() => setOpen(false)}
                >
                  <ShieldUser className="h-4 w-4 text-accent" />
                  <span>{t`Profile`}</span>
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isPending}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <LogOut className="h-4 w-4 text-accent" />
                  <span>{t`Sign out`}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleOpenAuth}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-surface-elevated"
              >
                <UserRound className="h-4 w-4 text-accent" />
                <span>{t`Sign in`}</span>
              </button>
            )}

            <div className="border-t border-border pt-3">
              <div className="mb-3 flex items-center gap-2 px-3 text-[11px] font-mono uppercase tracking-[0.22em] text-muted">
                <Globe2 className="h-3.5 w-3.5 text-accent" />
                <span>{t`Language`}</span>
              </div>
              <LocalesButtons
                className="px-2 pb-2"
                activeLocales={[locale]}
                onChange={handleLocaleChange}
              />
            </div>
          </div>
        }
      >
        <IconButton
          label={isAuth ? t`User menu` : t`Sign in`}
          onClick={() => setOpen((value) => !value)}
          className="backdrop-blur-sm"
          Icon={<UserRound className="h-4 w-4" />}
        />
      </Dropdown>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
