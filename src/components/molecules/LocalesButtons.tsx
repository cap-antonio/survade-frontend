import { Button } from "@/components/atoms/Button"
import { LANGS_DICT, SupportedLocale } from "@/i18n"
import classNames from "classnames"

type Props = {
  onChange: (labg: SupportedLocale) => void
  activeLocales: SupportedLocale[]
  className?: string
}

export const LocalesButtons = ({
  activeLocales,
  onChange,
  className,
}: Props) => {
  return (
    <div className={classNames("flex flex-wrap gap-2", className)}>
      {LANGS_DICT.map((l) => (
        <Button
          key={l.code}
          type="button"
          onClick={() => onChange(l.code)}
          className={classNames(
            "px-3 py-1.5 rounded border text-xs font-mono transition-colors",
            activeLocales.includes(l.code)
              ? "border-[var(--color-accent)] bg-[var(--color-accent-dim)] text-[var(--color-text)]"
              : "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)]",
            !activeLocales.includes(l.code) &&
              activeLocales.length >= 3 &&
              "opacity-40 cursor-not-allowed",
          )}
        >
          {l.label}
        </Button>
      ))}
    </div>
  )
}
