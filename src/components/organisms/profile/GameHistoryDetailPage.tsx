"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useLingui } from "@lingui/react/macro"
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Eye,
  History,
  Layers3,
  Shield,
  Sparkles,
  Swords,
  Users,
  Vote,
} from "lucide-react"
import { useGameHistory } from "@/api/hooks/games"
import type {
  ArchivedGamePlayer,
  GameHistoryFieldReveal,
  GameHistoryPowerUse,
  GameHistoryRemoval,
  GameHistoryRound,
  GameHistoryVote,
} from "@/api/services"
import { Button } from "@/components/atoms/Button"
import { getLocalizedPath, type SupportedLocale } from "@/i18n"
import { useRouter } from "next/navigation"

type GameHistoryDetailPageProps = {
  gameId: string
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

function localizeText(
  value: string | Record<string, any> | null | undefined,
  locale: SupportedLocale,
): string {
  if (!value) return EMPTY_STATE
  if (typeof value === "string") return value

  const localized =
    value[locale] ?? value["en"] ?? Object.values(value)[0] ?? EMPTY_STATE

  return typeof localized === "string" && localized.trim()
    ? localized
    : EMPTY_STATE
}

function formatSetting(settingKey: string): string {
  return settingKey
    .split(/[_-]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function formatLabel(value: string): string {
  return value
    .split(/[_-]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}): React.ReactElement {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center gap-3">
        {icon}
        <p className="text-xs uppercase tracking-[0.22em] text-muted">
          {label}
        </p>
      </div>
      <p className="mt-4 text-lg font-bold text-foreground">{value}</p>
    </div>
  )
}

function PlayerCard({
  player,
  labels,
}: {
  player: ArchivedGamePlayer
  labels: {
    alive: string
    out: string
    revealed: string
    eliminatedInRound: string
  }
}): React.ReactElement {
  const statusClasses = player.is_survivor
    ? "rounded-full border border-emerald-800/40 bg-emerald-900/20 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-emerald-300"
    : "rounded-full border border-border px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-muted"

  return (
    <div className="rounded-2xl border border-border bg-surface-elevated p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {player.display_name}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted">
            {formatLabel(player.player_type)}
          </p>
        </div>

        <span className={statusClasses}>
          {player.is_survivor ? labels.alive : labels.out}
        </span>
      </div>

      {player.revealed_fields?.length ? (
        <p className="mt-3 text-xs text-muted">
          {labels.revealed}: {player.revealed_fields.join(", ")}
        </p>
      ) : null}

      {player.is_eliminated && player.eliminated_in_round ? (
        <p className="mt-2 text-xs text-muted">
          {labels.eliminatedInRound} {player.eliminated_in_round}
        </p>
      ) : null}
    </div>
  )
}

function DetailSection({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}): React.ReactElement {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="text-lg font-bold tracking-tight">{title}</h3>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  )
}

function renderReveal(
  reveal: GameHistoryFieldReveal,
  getPlayerName: (playerId?: number | null) => string,
): React.ReactElement {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm text-muted">
      <span className="text-foreground">{getPlayerName(reveal.player_id)}</span>
      {" revealed "}
      <span className="text-foreground">{reveal.field}</span>
      {" via "}
      <span className="text-foreground">{formatLabel(reveal.source)}</span>
    </div>
  )
}

function renderPowerUse(
  powerUse: GameHistoryPowerUse,
  getPlayerName: (playerId?: number | null) => string,
): React.ReactElement {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm text-muted">
      <span className="text-foreground">
        {getPlayerName(powerUse.player_id)}
      </span>
      {" used "}
      <span className="text-foreground">{powerUse.power}</span>
      {powerUse.target_player_id ? (
        <>
          {" on "}
          <span className="text-foreground">
            {getPlayerName(powerUse.target_player_id)}
          </span>
        </>
      ) : null}
      {powerUse.forced_field ? (
        <>
          {" and revealed "}
          <span className="text-foreground">{powerUse.forced_field}</span>
        </>
      ) : null}
    </div>
  )
}

function renderVote(
  vote: GameHistoryVote,
  getPlayerName: (playerId?: number | null) => string,
): React.ReactElement {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm text-muted">
      <span className="text-foreground">{getPlayerName(vote.player_id)}</span>
      {" voted against "}
      <span className="text-foreground">
        {getPlayerName(vote.target_player_id)}
      </span>
    </div>
  )
}

function renderRemoval(
  removal: GameHistoryRemoval,
  getPlayerName: (playerId?: number | null) => string,
): React.ReactElement {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm text-muted">
      <span className="text-foreground">
        {getPlayerName(removal.player_id)}
      </span>
      {" was removed by "}
      <span className="text-foreground">
        {formatLabel(removal.removal_type)}
      </span>
      {removal.reason ? (
        <>
          {" because "}
          <span className="text-foreground">{removal.reason}</span>
        </>
      ) : null}
    </div>
  )
}

function RoundPanel({
  round,
  getPlayerName,
  labels,
}: {
  round: GameHistoryRound
  getPlayerName: (playerId?: number | null) => string
  labels: {
    noActions: string
    revealedFields: string
    powersUsed: string
    votes: string
    removedPlayers: string
    rawEvents: string
  }
}): React.ReactElement {
  const hasActions =
    !!round.opened_fields?.length ||
    !!round.powers_used?.length ||
    !!round.votes?.length ||
    !!round.removed_players?.length ||
    !!round.events.length

  if (!hasActions) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-muted">
        {labels.noActions}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {round.opened_fields?.length ? (
        <DetailSection
          title={labels.revealedFields}
          icon={<Eye className="h-5 w-5 text-accent" />}
        >
          {round.opened_fields.map((reveal, index) => (
            <div key={`${reveal.player_id}-${reveal.field}-${index}`}>
              {renderReveal(reveal, getPlayerName)}
            </div>
          ))}
        </DetailSection>
      ) : null}

      {round.powers_used?.length ? (
        <DetailSection
          title={labels.powersUsed}
          icon={<Sparkles className="h-5 w-5 text-accent" />}
        >
          {round.powers_used.map((powerUse, index) => (
            <div key={`${powerUse.player_id}-${powerUse.power}-${index}`}>
              {renderPowerUse(powerUse, getPlayerName)}
            </div>
          ))}
        </DetailSection>
      ) : null}

      {round.votes?.length ? (
        <DetailSection
          title={labels.votes}
          icon={<Vote className="h-5 w-5 text-accent" />}
        >
          {round.votes.map((vote, index) => (
            <div key={`${vote.player_id}-${vote.target_player_id}-${index}`}>
              {renderVote(vote, getPlayerName)}
            </div>
          ))}
        </DetailSection>
      ) : null}

      {round.removed_players?.length ? (
        <DetailSection
          title={labels.removedPlayers}
          icon={<Swords className="h-5 w-5 text-accent" />}
        >
          {round.removed_players.map((removal, index) => (
            <div key={`${removal.player_id}-${removal.removal_type}-${index}`}>
              {renderRemoval(removal, getPlayerName)}
            </div>
          ))}
        </DetailSection>
      ) : null}

      {round.events.length ? (
        <DetailSection
          title={labels.rawEvents}
          icon={<Layers3 className="h-5 w-5 text-accent" />}
        >
          {round.events.map((event, index) => (
            <pre
              key={index}
              className="overflow-x-auto rounded-xl border border-border bg-surface-elevated px-4 py-3 text-xs text-muted"
            >
              {JSON.stringify(event, null, 2)}
            </pre>
          ))}
        </DetailSection>
      ) : null}
    </div>
  )
}

export function GameHistoryDetailPage({
  gameId,
  locale,
}: GameHistoryDetailPageProps): React.ReactElement {
  const { t } = useLingui()
  const { data, isLoading, isError } = useGameHistory({ gameId })
  const [selectedRound, setSelectedRound] = useState(1)
  const router = useRouter()

  const playersById = useMemo(() => {
    const map: Record<number, string> = {}
    for (const player of data?.players ?? []) {
      map[player.player_id] = player.display_name
    }
    return map
  }, [data?.players])

  const getPlayerName = (playerId?: number | null): string => {
    if (playerId === null || playerId === undefined) return EMPTY_STATE
    return playersById[playerId] ?? `Player ${playerId}`
  }

  useEffect(() => {
    if (!data?.rounds.length) return
    setSelectedRound((currentRound) => {
      const hasCurrentRound = data.rounds.some((round: GameHistoryRound) => {
        return round.round === currentRound
      })

      return hasCurrentRound ? currentRound : data.rounds[0]!.round
    })
  }, [data?.rounds])

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-8 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="mt-4 text-sm text-muted">{t`Loading game history...`}</p>
      </div>
    )
  }

  if (isError || !data) {
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

  const activeRound =
    data.rounds.find(
      (round: GameHistoryRound) => round.round === selectedRound,
    ) ?? data.rounds[0]
  const survivors = data.players.filter(
    (player: ArchivedGamePlayer) => player.is_survivor,
  )
  const roundSummaries = activeRound
    ? [
        {
          label: t`Reveals`,
          value: activeRound.opened_fields?.length ?? 0,
        },
        {
          label: t`Powers`,
          value: activeRound.powers_used?.length ?? 0,
        },
        {
          label: t`Votes`,
          value: activeRound.votes?.length ?? 0,
        },
        {
          label: t`Removals`,
          value: activeRound.removed_players?.length ?? 0,
        },
      ]
    : []

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <History className="h-8 w-8 text-accent" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              {t`Game history`}
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">
              {data.game_code}
            </h1>
          </div>
        </div>

        <Button
          leftIcon={<ArrowLeft />}
          onClick={() => router.back()}
        >{t`Back`}</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={<CalendarClock className="h-5 w-5 text-accent" />}
          label={t`Started`}
          value={formatDate(data.created_at, locale)}
        />
        <SummaryCard
          icon={<Clock3 className="h-5 w-5 text-accent" />}
          label={t`Ended`}
          value={formatDate(data.ended_at, locale)}
        />
        <SummaryCard
          icon={<Shield className="h-5 w-5 text-accent" />}
          label={t`Status`}
          value={formatLabel(data.status)}
        />
        <SummaryCard
          icon={<Users className="h-5 w-5 text-accent" />}
          label={t`Players`}
          value={String(data.players.length)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-[1.35fr_0.95fr]">
        <div className="rounded-3xl border border-border bg-surface p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            {t`Scenario`}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">
            {localizeText(data.scenario.title, locale)}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {localizeText(data.scenario.description, locale)}
          </p>
          <div className="mt-5 rounded-2xl border border-border bg-surface-elevated p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-accent">
              {t`Environment`}
            </p>
            <p className="mt-2 text-sm text-muted">
              {localizeText(data.scenario.environment_conditions, locale)}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            {t`Game setup`}
          </p>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <p>
              <span className="text-foreground">{t`Setting`}:</span>{" "}
              {formatSetting(data.settings.setting_key)}
            </p>
            <p>
              <span className="text-foreground">{t`Saboteur mode`}:</span>{" "}
              {data.settings.saboteur_mode ? t`Enabled` : t`Disabled`}
            </p>
            <p>
              <span className="text-foreground">{t`Languages`}:</span>{" "}
              {data.settings.langs?.join(", ") || EMPTY_STATE}
            </p>
            <p>
              <span className="text-foreground">{t`Attributes`}:</span>{" "}
              {data.settings.attrs?.join(", ") || EMPTY_STATE}
            </p>
            <p>
              <span className="text-foreground">{t`Configured players`}:</span>{" "}
              {data.settings.player_count ?? EMPTY_STATE}
            </p>
            <p>
              <span className="text-foreground">{t`Survivors`}:</span>{" "}
              {survivors.length}
            </p>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-3 pl-2">
          <Users className="h-6 w-6 text-accent" />
          <h2 className="text-2xl font-bold tracking-tight">{t`Players`}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.players.map((player: ArchivedGamePlayer) => (
            <PlayerCard
              key={player.player_id}
              player={player}
              labels={{
                alive: t`Alive`,
                out: t`Out`,
                revealed: t`Revealed`,
                eliminatedInRound: t`Eliminated in round`,
              }}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3 pl-2">
          <History className="h-6 w-6 text-accent" />
          <h2 className="text-2xl font-bold tracking-tight">{t`Rounds`}</h2>
        </div>

        {data.rounds.length ? (
          <>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {data.rounds.map((round: GameHistoryRound) => {
                const isActive = round.round === activeRound?.round

                return (
                  <button
                    key={round.round}
                    type="button"
                    onClick={() => setSelectedRound(round.round)}
                    className={
                      isActive
                        ? "rounded-2xl border border-accent bg-accent-soft p-4 text-left transition-colors"
                        : "rounded-2xl border border-border bg-surface p-4 text-left transition-colors hover:bg-surface-hover"
                    }
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-accent">
                      {t`Round`} {round.round}
                    </p>
                    <p className="mt-3 text-sm font-semibold text-foreground">
                      {(round.opened_fields?.length ?? 0) +
                        (round.powers_used?.length ?? 0) +
                        (round.votes?.length ?? 0) +
                        (round.removed_players?.length ?? 0)}{" "}
                      {t`logged actions`}
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      {round.votes?.length ?? 0} {t`votes`} ·{" "}
                      {round.removed_players?.length ?? 0} {t`removals`}
                    </p>
                  </button>
                )
              })}
            </div>

            {activeRound ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {roundSummaries.map((summary) => (
                  <div
                    key={summary.label}
                    className="rounded-2xl border border-border bg-surface-elevated px-4 py-3"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-muted">
                      {summary.label}
                    </p>
                    <p className="mt-2 text-2xl font-black tracking-tight text-foreground">
                      {summary.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-muted">
            {t`No rounds were archived for this game.`}
          </div>
        )}

        {activeRound ? (
          <RoundPanel
            round={activeRound}
            getPlayerName={getPlayerName}
            labels={{
              noActions: t`No recorded actions in this round.`,
              revealedFields: t`Revealed fields`,
              powersUsed: t`Powers used`,
              votes: t`Votes`,
              removedPlayers: t`Removed players`,
              rawEvents: t`Raw events`,
            }}
          />
        ) : null}
      </section>

      <div className="rounded-3xl border border-border bg-surface p-8">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-accent" />
          <h2 className="text-2xl font-bold tracking-tight">{t`Survivors`}</h2>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {survivors.length ? (
            survivors.map((player: ArchivedGamePlayer) => (
              <span
                key={player.player_id}
                className="rounded-full border border-emerald-800/40 bg-emerald-900/20 px-3 py-1.5 text-sm text-emerald-300"
              >
                {player.display_name}
              </span>
            ))
          ) : (
            <span className="text-sm text-muted">{t`No survivors`}</span>
          )}
        </div>
      </div>
    </section>
  )
}
