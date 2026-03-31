"use client"

import { useRouter } from "next/navigation"
import { useLingui } from "@lingui/react/macro"
import { History, ShieldAlert } from "lucide-react"
import { useMyGames } from "@/api/hooks/users"
import type { GameHistorySummary } from "@/api/services"
import { Table, type TableColumn } from "@/components/molecules/Table"
import { getLocalizedPath, type SupportedLocale } from "@/i18n"
import { formatSetting } from "@/utils/string"
import { formatDate } from "@/utils/date"

type ProfileGamesHistoryProps = {
  locale: SupportedLocale
}

function formatScenarioTitle(
  scenarioTitle: GameHistorySummary["scenario_title"],
  locale: SupportedLocale,
): string {
  const localizedTitle =
    scenarioTitle[locale] ??
    scenarioTitle["en"] ??
    Object.values(scenarioTitle)[0]

  if (typeof localizedTitle === "string" && localizedTitle.trim()) {
    return localizedTitle
  }

  return "-"
}

export function ProfileGamesHistory({
  locale,
}: ProfileGamesHistoryProps): React.ReactElement {
  const { t } = useLingui()
  const router = useRouter()
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

  const columns: TableColumn<GameHistorySummary>[] = [
    {
      key: "code",
      header: t`Code`,
      cell: (item) => item.game_code,
      cellClassName: "whitespace-nowrap font-mono text-sm text-foreground",
    },
    {
      key: "scenario",
      header: t`Scenario`,
      cell: (item) => formatScenarioTitle(item.scenario_title, locale),
      cellClassName: "text-sm text-foreground",
    },
    {
      key: "setting",
      header: t`Setting`,
      cell: (item) => formatSetting(item.setting_key),
      cellClassName: "whitespace-nowrap text-sm text-muted",
    },
    {
      key: "players",
      header: t`Players`,
      cell: (item) => item.players_count,
      cellClassName: "whitespace-nowrap text-sm text-foreground",
    },
    {
      key: "survivors",
      header: t`Survivors`,
      cell: (item) => item.survivors_count,
      cellClassName: "whitespace-nowrap text-sm text-foreground",
    },
    {
      key: "started",
      header: t`Started`,
      cell: (item) => formatDate(item.created_at, locale),
      cellClassName: "whitespace-nowrap text-sm text-muted",
    },
    {
      key: "ended",
      header: t`Ended`,
      cell: (item) =>
        item.ended_at ? formatDate(item.ended_at, locale) : t`In progress`,
      cellClassName: "whitespace-nowrap text-sm text-muted",
    },
  ]

  return (
    <section id="games" className="space-y-4">
      <div className="flex items-center gap-3 pl-2">
        <History className="h-8 w-8 text-accent" />
        <h2 className="text-2xl font-bold tracking-tight">{t`My games`}</h2>
      </div>
      <p className="pb-4 text-sm text-muted">
        {t`Your latest Survade sessions.`}
      </p>

      <Table
        data={data ?? []}
        columns={columns}
        noDataMessages={{
          title: t`No games yet`,
          subtitle: t`When you finish your first Survade session, it will appear here.`,
        }}
        onRowClick={(item) =>
          router.push(
            getLocalizedPath(
              locale,
              `game-history/details?gameId=${item.game_id}`,
            ),
          )
        }
        getRowKey={(item) => item.game_id}
      />
    </section>
  )
}
