"use client"

import Link from "next/link"
import { useLingui } from "@lingui/react/macro"
import {
  ArrowLeftIcon,
  ShieldAlert,
  ShieldCheck,
  Target,
  Trophy,
} from "lucide-react"
import { useMe } from "@/api/hooks/users"
import { Button } from "@/components/atoms/Button"
import { getLocalizedPath, type SupportedLocale } from "@/i18n"
import { useAuthStore } from "@/stores/authStore"
import { useRouter } from "next/navigation"

type StatisticsViewProps = {
  locale: SupportedLocale
}

type StatCardProps = {
  label: string
  value: string
  hint: string
}

function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-black tracking-tight text-[var(--color-text)]">
        {value}
      </p>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{hint}</p>
    </div>
  )
}

export function StatisticsView({ locale }: StatisticsViewProps) {
  const { t } = useLingui()
  const accessToken = useAuthStore((state) => state.accessToken)
  const { data, isLoading, isError } = useMe({
    enabled: !!accessToken,
  })
  const router = useRouter()

  if (!accessToken) {
    return (
      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
          {t`Statistics`}
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">{t`Sign in required`}</h1>
        <p className="mt-3 text-[var(--color-muted)]">
          {t`Open the account menu on the landing page and sign in to see your stats.`}
        </p>
        <Link href={getLocalizedPath(locale)} className="mt-6 inline-flex">
          <Button variant="secondary">{t`Back to home`}</Button>
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
        <div className="mx-auto h-10 w-10 rounded-full border-2 border-[var(--color-accent)] border-t-transparent animate-spin" />
        <p className="mt-4 text-sm text-[var(--color-muted)]">{t`Loading statistics...`}</p>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="rounded-3xl border border-red-900/60 bg-red-950/20 p-8 text-center">
        <h1 className="text-2xl font-black tracking-tight">{t`Could not load statistics`}</h1>
        <p className="mt-3 text-sm text-red-200/80">
          {t`Please refresh the page or sign in again.`}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Button
        leftIcon={<ArrowLeftIcon />}
        onClick={() => router.back()}
      >{t`Back`}</Button>
      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
          {t`Profile`}
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              {data.display_name}
            </h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              {t`Your personal survival and saboteur performance.`}
            </p>
          </div>

          {data.favourite_setting ? (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-muted)]">
              <span className="block text-xs uppercase tracking-[0.25em] text-[var(--color-accent)]">
                {t`Favourite setting`}
              </span>
              <span className="mt-1 block text-[var(--color-text)]">
                {data.favourite_setting}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-[var(--color-accent)]" />
          <h2 className="text-xl font-bold tracking-tight">{t`Survival`}</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label={t`Games`}
            value={String(data.survival.games)}
            hint={t`Total survival rounds played.`}
          />
          <StatCard
            label={t`Survived`}
            value={String(data.survival.survived)}
            hint={t`Rounds where you made it into the safe place.`}
          />
          <StatCard
            label={t`Success rate`}
            value={`${Math.round(data.survival.rate * 100)}%`}
            hint={t`Your survival conversion rate.`}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-[var(--color-accent)]" />
          <h2 className="text-xl font-bold tracking-tight">{t`Saboteur`}</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label={t`Saboteur games`}
            value={String(data.saboteur.games_as_saboteur)}
            hint={t`Rounds where you played as the saboteur.`}
          />
          <StatCard
            label={t`Saboteur wins`}
            value={String(data.saboteur.saboteur_wins)}
            hint={t`Rounds you sabotaged successfully.`}
          />
          <StatCard
            label={t`Win rate`}
            value={`${Math.round(data.saboteur.rate * 100)}%`}
            hint={t`How often your sabotage plan worked.`}
          />
          <StatCard
            label={t`Detected`}
            value={String(data.saboteur.times_detected)}
            hint={t`Rounds where the group exposed you.`}
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-[var(--color-accent)]" />
            <h3 className="text-lg font-bold">{t`Quick read`}</h3>
          </div>
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            {t`Higher survival rate means the group trusts your arguments. Higher saboteur win rate means you can manipulate the table when the pressure rises.`}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-[var(--color-accent)]" />
            <h3 className="text-lg font-bold">{t`Keep playing`}</h3>
          </div>
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            {t`Play more rounds to sharpen your profile and discover your strongest role.`}
          </p>
        </div>
      </section>
    </div>
  )
}
