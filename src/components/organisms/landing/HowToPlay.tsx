import { msg } from "@lingui/core/macro"
import { useLingui } from "@lingui/react/macro"

const STEPS = [
  {
    number: "01",
    title: msg`Create or Join`,
    desc: msg`One player creates a game and shares the code. Everyone else joins via the link or code.`,
  },
  {
    number: "02",
    title: msg`Get Your Card`,
    desc: msg`Each player receives a unique character card — profession, health, skills, and a dark secret.`,
  },
  {
    number: "03",
    title: msg`Argue & Reveal`,
    desc: msg`Over several rounds, reveal your attributes to convince others you deserve a spot in the safe place.`,
  },
  {
    number: "04",
    title: msg`Vote`,
    desc: msg`Each round the group votes to eliminate one person. Who gets kicked out?`,
  },
  {
    number: "05",
    title: msg`Survive`,
    desc: msg`The remaining players make it into the safe place. But beware — there may be a saboteur among you.`,
  },
]

export function HowToPlay() {
  const { t, i18n } = useLingui()

  return (
    <section id="how-to-play" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center tracking-tight">
          {t`How to Play`}
        </h2>
        <div className="space-y-6">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="flex gap-6 p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              <span className="text-3xl font-black text-[var(--color-accent)]/40 font-mono tabular-nums shrink-0 leading-none pt-1">
                {step.number}
              </span>
              <div>
                <h3 className="font-semibold mb-1">{i18n._(step.title)}</h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                  {i18n._(step.desc)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
