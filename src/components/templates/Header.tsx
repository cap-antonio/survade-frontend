"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import cn from "classnames"
import { useLingui } from "@lingui/react/macro"
import { House } from "lucide-react"
import { UserMenu } from "@/components/molecules/UserMenu"
import { getLocalizedPath, type SupportedLocale } from "@/i18n"

type HeaderProps = {
  locale: SupportedLocale
  floating?: boolean
}

export function Header({
  locale,
  floating = false,
}: HeaderProps): React.ReactElement {
  const { t } = useLingui()
  const pathname = usePathname()

  const navigationItems = [
    {
      href: getLocalizedPath(locale, "game-history"),
      label: t`Game history`,
    },
    {
      href: getLocalizedPath(locale, "leaderboard"),
      label: t`Leaderboard`,
    },
  ]

  const normalizePath = (value: string): string => {
    if (value.length > 1 && value.endsWith("/")) {
      return value.slice(0, -1)
    }

    return value
  }

  const currentPath = normalizePath(pathname)

  const isActivePath = (href: string): boolean => {
    const normalizedHref = normalizePath(href)

    if (normalizedHref === "/") {
      return currentPath === "/"
    }

    return (
      currentPath === normalizedHref ||
      currentPath.startsWith(`${normalizedHref}/`)
    )
  }

  return (
    <header
      className={cn("w-full", floating ? "absolute inset-x-0 top-0 z-30" : "")}
    >
      <div className="mx-auto max-w-6xl px-4 pt-5 sm:px-6">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-full border border-border bg-background/80 px-3 py-3 shadow-[0_20px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:px-4">
          <Link
            href={getLocalizedPath(locale)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            <House className="h-4 w-4 text-accent" />
          </Link>

          <nav className="hidden items-center justify-center gap-8 justify-self-center md:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium text-muted transition-colors hover:text-foreground",
                  {
                    "text-primary": isActivePath(item.href),
                  },
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="justify-self-end">
            <UserMenu navigationItems={navigationItems} />
          </div>
        </div>
      </div>
    </header>
  )
}
