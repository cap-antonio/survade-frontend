"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useLingui } from "@lingui/react/macro"
import { useMe } from "@/api/hooks/users"
import { Button } from "@/components/atoms/Button"
import { ToggleRow } from "@/components/atoms/ToggleRow"
import { ProfileGamesHistory } from "@/components/molecules/profile/ProfileGamesHistory"
import { ProfileSettings } from "@/components/molecules/profile/ProfileSettings"
import { ProfileStats } from "@/components/molecules/profile/ProfileStats"
import { getLocalizedPath, type SupportedLocale } from "@/i18n"
import { useAuthStore } from "@/stores/authStore"

type ProfilePageProps = {
  locale: SupportedLocale
}

type ProfileTab = "settings" | "statistics" | "games"

const PROFILE_TABS: ProfileTab[] = ["settings", "statistics", "games"]

function getProfileTab(value: string | null): ProfileTab {
  return PROFILE_TABS.includes(value as ProfileTab)
    ? (value as ProfileTab)
    : "settings"
}

export function ProfilePage({ locale }: ProfilePageProps) {
  const { t } = useLingui()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const accessToken = useAuthStore((state) => state.accessToken)
  const { data, isLoading, isError } = useMe({
    enabled: !!accessToken,
  })
  const activeTab = getProfileTab(searchParams.get("tab"))

  const setActiveTab = (tab: ProfileTab): void => {
    const nextSearchParams = new URLSearchParams(searchParams.toString())

    if (tab === "settings") {
      nextSearchParams.delete("tab")
    } else {
      nextSearchParams.set("tab", tab)
    }

    const nextQuery = nextSearchParams.toString()
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    })
  }

  if (!accessToken) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">
          {t`Statistics`}
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">
          {t`Sign in required`}
        </h1>
        <p className="mt-3 text-muted">
          {t`Open the user menu on the landing page and sign in to see your stats.`}
        </p>
        <Link href={getLocalizedPath(locale)} className="mt-6 inline-flex">
          <Button variant="secondary">{t`Back to home`}</Button>
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-8 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="mt-4 text-sm text-muted">{t`Loading statistics...`}</p>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="rounded-3xl border border-red-900/60 bg-red-950/20 p-8 text-center">
        <h1 className="text-2xl font-black tracking-tight">
          {t`Could not load statistics`}
        </h1>
        <p className="mt-3 text-sm text-red-200/80">
          {t`Please refresh the page or sign in again.`}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="w-full">
        <ToggleRow
          items={[
            {
              title: t`Settings`,
              isActive: activeTab === "settings",
              onClick: () => setActiveTab("settings"),
            },
            {
              title: t`My statistics`,
              isActive: activeTab === "statistics",
              onClick: () => setActiveTab("statistics"),
            },
            {
              title: t`My games`,
              isActive: activeTab === "games",
              onClick: () => setActiveTab("games"),
            },
          ]}
        />
      </div>

      {activeTab === "settings" ? (
        <ProfileSettings locale={locale} />
      ) : activeTab === "statistics" ? (
        <ProfileStats />
      ) : (
        <ProfileGamesHistory locale={locale} />
      )}
    </div>
  )
}
