"use client"

import { useState } from "react"
import { useLingui } from "@lingui/react/macro"
import { ShieldAlert, TableProperties, Trophy } from "lucide-react"
import { ToggleRow } from "@/components/atoms/ToggleRow"
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

function ClassicTable({
  rows,
}: {
  rows: ClassicLeaderboardEntry[]
}): React.ReactElement {
  const { t } = useLingui()

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border text-left">
        <thead>
          <tr className="text-xs uppercase tracking-[0.22em] text-muted">
            <th className="px-6 py-4 font-medium">{t`Rank`}</th>
            <th className="px-6 py-4 font-medium">{t`Player`}</th>
            <th className="px-6 py-4 font-medium">{t`Games`}</th>
            <th className="px-6 py-4 font-medium">{t`Wins`}</th>
            <th className="px-6 py-4 font-medium">{t`Win rate`}</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr
              key={row.user_id}
              className="transition-colors hover:bg-surface-elevated/60"
            >
              <td className="whitespace-nowrap px-6 py-4">
                <RankCell rank={row.rank} />
              </td>
              <td className="px-6 py-4 text-sm text-foreground">
                {row.display_name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                {row.games_played}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                {row.wins}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                {formatWinRate(row.win_rate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SaboteurTable({
  rows,
}: {
  rows: SaboteurLeaderboardEntry[]
}): React.ReactElement {
  const { t } = useLingui()

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border text-left">
        <thead>
          <tr className="text-xs uppercase tracking-[0.22em] text-muted">
            <th className="px-6 py-4 font-medium">{t`Rank`}</th>
            <th className="px-6 py-4 font-medium">{t`Player`}</th>
            <th className="px-6 py-4 font-medium">{t`Games`}</th>
            <th className="px-6 py-4 font-medium">{t`Overall win rate`}</th>
            <th className="px-6 py-4 font-medium">{t`Saboteur wins`}</th>
            <th className="px-6 py-4 font-medium">{t`Saboteur win rate`}</th>
            <th className="px-6 py-4 font-medium">{t`Civilian win rate`}</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr
              key={row.user_id}
              className="transition-colors hover:bg-surface-elevated/60"
            >
              <td className="whitespace-nowrap px-6 py-4">
                <RankCell rank={row.rank} />
              </td>
              <td className="px-6 py-4 text-sm text-foreground">
                {row.display_name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                {row.games_played}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                {formatWinRate(row.win_rate)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                {row.saboteur.wins}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                {formatWinRate(row.saboteur.win_rate)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                {formatWinRate(row.civilian.win_rate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
      ) : activeQuery.data?.length ? (
        <div className="rounded-3xl border border-border bg-surface">
          <div className="border-b border-border px-6 py-5">
            <p className="text-sm text-muted">
              {activeTab === "classic"
                ? t`Best players by overall classic performance.`
                : t`Best saboteur specialists based on role-specific results.`}
            </p>
          </div>

          {activeTab === "classic" ? (
            <ClassicTable rows={classicQuery.data ?? []} />
          ) : (
            <SaboteurTable rows={saboteurQuery.data ?? []} />
          )}
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-surface p-10 text-center">
          <TableProperties className="mx-auto h-10 w-10 text-accent" />
          <h2 className="mt-5 text-2xl font-black tracking-tight">
            {t`No leaderboard data yet`}
          </h2>
          <p className="mt-3 text-sm text-muted">
            {t`Once enough matches are played, the best players will appear here.`}
          </p>
        </div>
      )}
    </section>
  )
}
