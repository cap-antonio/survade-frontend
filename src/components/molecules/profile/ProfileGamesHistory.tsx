"use client"

import { useLingui } from "@lingui/react/macro"
import { History, ShieldAlert, TableProperties } from "lucide-react"
import { useMyGames } from "@/api/hooks/users"
import type { GameHistorySummary } from "@/api/services"
import type { SupportedLocale } from "@/i18n"

type ProfileGamesHistoryProps = {
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

export function ProfileGamesHistory({
  locale,
}: ProfileGamesHistoryProps): React.ReactElement {
  const { t } = useLingui()
  const { data, isLoading, isError } = useMyGames({ limit: 50 })

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-8 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="mt-4 text-sm text-muted">{t`Loading your games...`}</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-900/60 bg-red-950/20 p-8 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-red-300" />
        <h2 className="mt-5 text-2xl font-black tracking-tight">
          {t`Could not load your games`}
        </h2>
        <p className="mt-3 text-sm text-red-200/80">
          {t`Please refresh the page and try again.`}
        </p>
      </div>
    )
  }

  return (
    <section id="games" className="space-y-4">
      <div className="flex items-center gap-3 pl-2">
        <History className="h-8 w-8 text-accent" />
        <h2 className="text-2xl font-bold tracking-tight">{t`My games`}</h2>
      </div>
      <p className="pb-4 text-sm text-muted">
        {t`Your latest Survade sessions.`}
      </p>

      {data?.length ? (
        <div className="rounded-3xl border border-border bg-surface">
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
          <h3 className="mt-5 text-2xl font-black tracking-tight">
            {t`No games yet`}
          </h3>
          <p className="mt-3 text-sm text-muted">
            {t`When you finish your first Survade session, it will appear here.`}
          </p>
        </div>
      )}
    </section>
  )
}
