"use client"

import { useLingui } from "@lingui/react/macro"
import {
  ChartLine,
  ShieldAlert,
  ShieldCheck,
  Target,
  Trophy,
} from "lucide-react"
import { useAuthStore } from "@/stores/authStore"
import { useMe } from "@/api/hooks/users"

type StatCardProps = {
  label: string
  value: string
  hint: string
}

function StatCard({ label, value, hint }: StatCardProps): React.ReactElement {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-muted">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-2 text-sm text-muted">{hint}</p>
    </div>
  )
}

export function ProfileStats(): React.ReactElement {
  const { t } = useLingui()

  const accessToken = useAuthStore((state) => state.accessToken)

  const { data: profile } = useMe({
    enabled: !!accessToken,
  })

  return (
    <section id="statistics" className="space-y-4">
      <div className="flex items-center gap-3 pl-2">
        <ChartLine className="h-8 w-8 text-accent" />
        <h2 className="text-2xl font-bold tracking-tight">{t`My statistics`}</h2>
      </div>
      <p className="pb-4 text-sm text-muted">
        {t`Your personal survival and saboteur performance.`}
      </p>

      <div className="flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-accent" />
        <h3 className="text-xl font-bold tracking-tight">{t`Survival`}</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label={t`Games`}
          value={String(profile.survival.games)}
          hint={t`Total survival rounds played.`}
        />
        <StatCard
          label={t`Survived`}
          value={String(profile.survival.survived)}
          hint={t`Rounds where you made it into the safe place.`}
        />
        <StatCard
          label={t`Success rate`}
          value={`${Math.round(profile.survival.rate * 100)}%`}
          hint={t`Your survival conversion rate.`}
        />
      </div>

      <div className="flex items-center gap-3">
        <ShieldAlert className="h-5 w-5 text-accent" />
        <h3 className="text-xl font-bold tracking-tight">{t`Saboteur`}</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t`Saboteur games`}
          value={String(profile.saboteur.games_as_saboteur)}
          hint={t`Rounds where you played as the saboteur.`}
        />
        <StatCard
          label={t`Saboteur wins`}
          value={String(profile.saboteur.saboteur_wins)}
          hint={t`Rounds you sabotaged successfully.`}
        />
        <StatCard
          label={t`Win rate`}
          value={`${Math.round(profile.saboteur.rate * 100)}%`}
          hint={t`How often your sabotage plan worked.`}
        />
        <StatCard
          label={t`Detected`}
          value={String(profile.saboteur.times_detected)}
          hint={t`Rounds where the group exposed you.`}
        />
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-accent" />
            <h4 className="text-lg font-bold">{t`Quick read`}</h4>
          </div>
          <p className="mt-3 text-sm text-muted">
            {t`Higher survival rate means the group trusts your arguments. Higher saboteur win rate means you can manipulate the table when the pressure rises.`}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-accent" />
            <h4 className="text-lg font-bold">{t`Keep playing`}</h4>
          </div>
          <p className="mt-3 text-sm text-muted">
            {t`Play more rounds to sharpen your profile and discover your strongest role.`}
          </p>
        </div>
      </section>
    </section>
  )
}
