"use client"

import Link from "next/link"
import { useLingui } from "@lingui/react/macro"
import { History, TableProperties } from "lucide-react"
import { useGameHistoryList } from "@/api/hooks/games"
import type { GameHistorySummary } from "@/api/services"
import { Button } from "@/components/atoms/Button"
import { getLocalizedPath, type SupportedLocale } from "@/i18n"
import { useAuthStore } from "@/stores/authStore"

type GameHistoryPageProps = {
  locale: SupportedLocale
}

const EMPTY_STATE = "—"

function formatDate(value: string | null, locale: SupportedLocale): string {
  if (!value) return EMPTY_STATE

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return EMPTY_STATE

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function formatScenarioTitle(
  scenarioTitle: GameHistorySummary["scenario_title"],
  locale: SupportedLocale,
): string {
  if (typeof scenarioTitle === "string" && scenarioTitle.trim()) {
    return scenarioTitle
  }

  if (scenarioTitle && typeof scenarioTitle === "object") {
    const localizedTitle =
      scenarioTitle[locale] ??
      scenarioTitle["en"] ??
      Object.values(scenarioTitle)[0]

    if (typeof localizedTitle === "string" && localizedTitle.trim()) {
      return localizedTitle
    }
  }

  return EMPTY_STATE
}

function formatSetting(settingKey: string): string {
  return settingKey
    .split(/[_-]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function GameHistoryPage({
  locale,
}: GameHistoryPageProps): React.ReactElement {
  const { t } = useLingui()
  const accessToken = useAuthStore((state) => state.accessToken)
  const { data, isLoading, isError } = useGameHistoryList({
    enabled: !!accessToken,
  })

  if (!accessToken) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">
          {t`Game history`}
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">
          {t`Sign in required`}
        </h1>
        <p className="mt-3 text-muted">
          {t`Open the user menu and sign in to see your recent games.`}
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
        <p className="mt-4 text-sm text-muted">{t`Loading game history...`}</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-900/60 bg-red-950/20 p-8 text-center">
        <h1 className="text-2xl font-black tracking-tight">
          {t`Could not load game history`}
        </h1>
        <p className="mt-3 text-sm text-red-200/80">
          {t`Please refresh the page or sign in again.`}
        </p>
      </div>
    )
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3 pl-2">
        <History className="h-8 w-8 text-accent" />
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            {t`Overview`}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">
            {t`Game history`}
          </h1>
        </div>
      </div>

      {data?.length ? (
        <div className="rounded-3xl border border-border bg-surface">
          <div className="border-b border-border px-6 py-5">
            <p className="text-sm text-muted">
              {t`Recent matches you have played in Survade.`}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-left">
              <thead>
                <tr className="text-xs uppercase tracking-[0.22em] text-muted">
                  <th className="px-6 py-4 font-medium">{t`Code`}</th>
                  <th className="px-6 py-4 font-medium">{t`Scenario`}</th>
                  <th className="px-6 py-4 font-medium">{t`Setting`}</th>
                  <th className="px-6 py-4 font-medium">{t`Players`}</th>
                  <th className="px-6 py-4 font-medium">{t`Survivors`}</th>
                  <th className="px-6 py-4 font-medium">{t`Started`}</th>
                  <th className="px-6 py-4 font-medium">{t`Ended`}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {data.map((item) => (
                  <tr
                    key={item.game_id}
                    className="transition-colors hover:bg-surface-elevated/60"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-sm text-foreground">
                      {item.game_code}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {formatScenarioTitle(item.scenario_title, locale)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                      {formatSetting(item.setting_key)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                      {item.players_count}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                      {item.survivors_count}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                      {formatDate(item.created_at, locale)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                      {item.ended_at ? formatDate(item.ended_at, locale) : t`In progress`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-surface p-10 text-center">
          <TableProperties className="mx-auto h-10 w-10 text-accent" />
          <h2 className="mt-5 text-2xl font-black tracking-tight">
            {t`No games yet`}
          </h2>
          <p className="mt-3 text-sm text-muted">
            {t`When you finish your first Survade session, it will appear here.`}
          </p>
        </div>
      )}
    </section>
  )
}
