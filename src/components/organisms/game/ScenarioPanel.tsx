"use client"

import type { Scenario } from "@/api/generated/schema"
import { useLingui } from "@lingui/react/macro"

type ScenarioPanelProps = {
  scenario: Scenario
  currentRound: number
  contentLang: string
}

function getLang(map: Record<string, string>, lang: string): string {
  return map[lang] ?? map["en"] ?? Object.values(map)[0] ?? ""
}

export function ScenarioPanel({
  scenario,
  currentRound,
  contentLang,
}: ScenarioPanelProps) {
  const { t } = useLingui()
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-[var(--color-accent)] font-mono uppercase tracking-widest mb-1">
            {t`Scenario`}
          </p>
          <h2 className="text-xl font-bold leading-snug">
            {getLang(scenario.title, contentLang)}
          </h2>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-[var(--color-muted)] mb-0.5">{t`Round`}</p>
          <p className="text-2xl font-black font-mono text-[var(--color-accent)]">
            {currentRound}
          </p>
        </div>
      </div>

      <p className="text-sm text-[var(--color-muted)] leading-relaxed">
        {getLang(scenario.description, contentLang)}
      </p>

      {scenario.environment_conditions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {scenario.environment_conditions.map((cond, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)]"
            >
              {getLang(cond, contentLang)}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
