import { LandingHero } from "@/components/templates/LandingHero"
import { msg } from "@lingui/core/macro"
import { useLingui } from "@lingui/react/macro"

const SETTINGS = [
  {
    key: "mars",
    emoji: "🔴",
    title: msg`Mars Colony`,
    desc: msg`A catastrophic malfunction threatens the habitat dome. Oxygen is running out.`,
    free: true,
  },
  {
    key: "orbit",
    emoji: "🚀",
    title: msg`Orbit`,
    desc: msg`The orbital station is losing altitude. Only the escape pod can hold a few.`,
    free: false,
  },
  {
    key: "siege",
    emoji: "⚔️",
    title: msg`Siege`,
    desc: msg`The fortress walls are breached. The inner keep shelters are filling up.`,
    free: false,
  },
  {
    key: "ship",
    emoji: "🚢",
    title: msg`Shipwreck`,
    desc: msg`The vessel is sinking fast. The lifeboat fits only so many survivors.`,
    free: false,
  },
  {
    key: "pandemic",
    emoji: "🦠",
    title: msg`Pandemic`,
    desc: msg`A lethal virus spreads. The safe place's medical resources are critically limited.`,
    free: false,
  },
  {
    key: "portal",
    emoji: "⏳",
    title: msg`Time Portal`,
    desc: msg`A rift in time opens. Only select individuals can pass through to the other side.`,
    free: false,
  },
] as const

export function SettingsGrid() {
  const { t, i18n } = useLingui()

  return (
    <LandingHero>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-3 text-center tracking-tight">
          {t`Scenarios`}
        </h2>
        <p className="text-center text-[var(--color-muted)] text-sm mb-12">
          {t`Choose the world your group will fight to survive in.`}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SETTINGS.map((s) => (
            <div
              key={s.key}
              className="relative p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-white/15 transition-colors"
            >
              {!s.free && (
                <span className="absolute top-3 right-3 text-xs text-[var(--color-muted)] font-mono">
                  🔒
                </span>
              )}
              {s.free && (
                <span className="absolute top-3 right-3 text-[10px] text-emerald-400 font-mono uppercase tracking-wide">
                  {t`Free`}
                </span>
              )}
              <div className="text-3xl mb-3">{s.emoji}</div>
              <h3 className="font-semibold mb-1">{i18n._(s.title)}</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                {i18n._(s.desc)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </LandingHero>
  )
}
