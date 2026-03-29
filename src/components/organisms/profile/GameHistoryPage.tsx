"use client"

import Link from "next/link"
import { useLingui } from "@lingui/react/macro"
import { History } from "lucide-react"
import { useGameHistoryList } from "@/api/hooks/games"
import type { GameHistorySummary } from "@/api/services"
import { Button } from "@/components/atoms/Button"
import { Table, type TableColumn } from "@/components/molecules/Table"
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

      <Table
        data={data ?? []}
        columns={columns}
        title={t`Recent matches.`}
        noDataMessages={{
          title: t`No games yet`,
          subtitle: t`When you finish your first Survade session, it will appear here.`,
        }}
        getRowKey={(item) => item.game_id}
      />
    </section>
  )
}
