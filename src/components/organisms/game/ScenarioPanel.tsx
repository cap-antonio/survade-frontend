"use client"

import { useGameQuery } from "@/api/hooks/games"
import { useLingui } from "@lingui/react/macro"
import { useSearchParams } from "next/navigation"

type ScenarioPanelProps = {
  contentLang: string
}

function getLang(map: Record<string, string>, lang: string = "en"): string {
  return map[lang] ?? Object.values(map)[0] ?? ""
}

function getConditions(
  map: Record<string, string>,
  lang: string = "en",
): string[] {
  return [map[lang] ?? Object.values(map)[0] ?? ""]
}

export function ScenarioPanel({ contentLang }: ScenarioPanelProps) {
  const { t } = useLingui()
  const searchParams = useSearchParams()

  const code = searchParams.get("code")?.trim().toUpperCase() ?? ""
  const hostToken =
    typeof window !== "undefined"
      ? (localStorage.getItem(`host_token_${code}`) ?? "")
      : ""

  const { data } = useGameQuery(
    {
      gameCode: code,
      xHostToken: hostToken,
    },
    { enabled: !!code && !!hostToken },
  )

  const scenario = data?.scenario

  return scenario ? (
    <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-accent font-mono uppercase tracking-widest mb-1">
            {t`Scenario`}
          </p>
          <h2 className="text-xl font-bold leading-snug">
            {getLang(scenario.title, contentLang)}
          </h2>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-muted mb-0.5">{t`Round`}</p>
          <p className="text-2xl font-black font-mono text-accent">
            {data.current_round}
          </p>
        </div>
      </div>

      <p className="text-sm text-muted leading-relaxed">
        {getLang(scenario.description, contentLang)}
      </p>

      {scenario.environment_conditions && (
        <div className="flex flex-wrap gap-2">
          {getConditions(scenario.environment_conditions).map((cond, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs border border-border bg-surface-elevated text-muted"
            >
              {cond}
            </span>
          ))}
        </div>
      )}
    </div>
  ) : null
}
