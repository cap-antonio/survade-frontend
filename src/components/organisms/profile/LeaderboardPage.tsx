"use client"

import { useState } from "react"
import { useLingui } from "@lingui/react/macro"
import { ShieldAlert, Trophy } from "lucide-react"
import { ToggleRow } from "@/components/atoms/ToggleRow"
import { Table, type TableColumn } from "@/components/molecules/Table"
import {
  useClassicLeaderboard,
  useSaboteurLeaderboard,
} from "@/api/hooks/users"
import type {
  ClassicLeaderboardEntry,
  SaboteurLeaderboardEntry,
} from "@/api/services"

type LeaderboardTab = "classic" | "saboteur"

function formatWinRate(value: number): string {
  const normalized = value <= 1 ? value * 100 : value
  return `${normalized.toFixed(1)}%`
}

function RankCell({ rank }: { rank: number }): React.ReactElement {
  const toneClassName =
    rank === 1
      ? "text-yellow-300"
      : rank === 2
        ? "text-slate-200"
        : rank === 3
          ? "text-amber-400"
          : "text-foreground"

  return (
    <span className={`font-mono text-sm font-bold ${toneClassName}`}>
      #{rank}
    </span>
  )
}

export function LeaderboardPage(): React.ReactElement {
  const { t } = useLingui()
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("classic")

  const classicQuery = useClassicLeaderboard(
    { limit: 50 },
    { enabled: activeTab === "classic" },
  )
  const saboteurQuery = useSaboteurLeaderboard(
    { limit: 50 },
    { enabled: activeTab === "saboteur" },
  )

  const activeQuery =
    activeTab === "classic"
      ? {
          data: classicQuery.data,
          isLoading: classicQuery.isLoading,
          isError: classicQuery.isError,
        }
      : {
          data: saboteurQuery.data,
          isLoading: saboteurQuery.isLoading,
          isError: saboteurQuery.isError,
        }

  const classicColumns: TableColumn<ClassicLeaderboardEntry>[] = [
    {
      key: "rank",
      header: t`Rank`,
      cell: (row) => <RankCell rank={row.rank} />,
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "player",
      header: t`Player`,
      cell: (row) => row.display_name,
      cellClassName: "text-sm text-foreground",
    },
    {
      key: "games",
      header: t`Games`,
      cell: (row) => row.games_played,
      cellClassName: "whitespace-nowrap text-sm text-foreground",
    },
    {
      key: "wins",
      header: t`Wins`,
      cell: (row) => row.wins,
      cellClassName: "whitespace-nowrap text-sm text-foreground",
    },
    {
      key: "win-rate",
      header: t`Win rate`,
      cell: (row) => formatWinRate(row.win_rate),
      cellClassName: "whitespace-nowrap text-sm text-muted",
    },
  ]

  const saboteurColumns: TableColumn<SaboteurLeaderboardEntry>[] = [
    {
      key: "rank",
      header: t`Rank`,
      cell: (row) => <RankCell rank={row.rank} />,
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "player",
      header: t`Player`,
      cell: (row) => row.display_name,
      cellClassName: "text-sm text-foreground",
    },
    {
      key: "games",
      header: t`Games`,
      cell: (row) => row.games_played,
      cellClassName: "whitespace-nowrap text-sm text-foreground",
    },
    {
      key: "overall-win-rate",
      header: t`Overall win rate`,
      cell: (row) => formatWinRate(row.win_rate),
      cellClassName: "whitespace-nowrap text-sm text-muted",
    },
    {
      key: "saboteur-wins",
      header: t`Saboteur wins`,
      cell: (row) => row.saboteur.wins,
      cellClassName: "whitespace-nowrap text-sm text-foreground",
    },
    {
      key: "saboteur-win-rate",
      header: t`Saboteur win rate`,
      cell: (row) => formatWinRate(row.saboteur.win_rate),
      cellClassName: "whitespace-nowrap text-sm text-muted",
    },
    {
      key: "civilian-win-rate",
      header: t`Civilian win rate`,
      cell: (row) => formatWinRate(row.civilian.win_rate),
      cellClassName: "whitespace-nowrap text-sm text-muted",
    },
  ]

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3 pl-2">
        <Trophy className="h-8 w-8 text-accent" />
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            {t`Top players`}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">
            {t`Leaderboard`}
          </h1>
        </div>
      </div>

      <div className="w-full">
        <ToggleRow
          items={[
            {
              title: t`Classic`,
              isActive: activeTab === "classic",
              onClick: () => setActiveTab("classic"),
            },
            {
              title: t`Saboteur`,
              isActive: activeTab === "saboteur",
              onClick: () => setActiveTab("saboteur"),
            },
          ]}
        />
      </div>

      {activeQuery.isLoading ? (
        <div className="rounded-3xl border border-border bg-surface p-8 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="mt-4 text-sm text-muted">{t`Loading leaderboard...`}</p>
        </div>
      ) : activeQuery.isError ? (
        <div className="rounded-3xl border border-red-900/60 bg-red-950/20 p-8 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-red-300" />
          <h2 className="mt-5 text-2xl font-black tracking-tight">
            {t`Could not load leaderboard`}
          </h2>
          <p className="mt-3 text-sm text-red-200/80">
            {t`Please refresh the page and try again.`}
          </p>
        </div>
      ) : activeTab === "classic" ? (
        <Table
          data={classicQuery.data ?? []}
          columns={classicColumns}
          title={t`Best players by overall classic performance.`}
          noDataMessages={{
            title: t`No leaderboard data yet`,
            subtitle: t`Once enough matches are played, the best players will appear here.`,
          }}
          getRowKey={(row) => row.user_id}
        />
      ) : (
        <Table
          data={saboteurQuery.data ?? []}
          columns={saboteurColumns}
          title={t`Best saboteur specialists based on role-specific results.`}
          noDataMessages={{
            title: t`No leaderboard data yet`,
            subtitle: t`Once enough matches are played, the best players will appear here.`,
          }}
          getRowKey={(row) => row.user_id}
        />
      )}
    </section>
  )
}
