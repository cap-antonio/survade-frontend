import { Button } from "@/components/atoms/Button"
import { ToggleButton } from "@/components/atoms/ToggleButton"
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
        <ToggleButton
          key={l.code}
          onClick={() => onChange(l.code)}
          isActive={activeLocales.includes(l.code)}
          className={classNames(
            !activeLocales.includes(l.code) &&
              activeLocales.length >= 3 &&
              "opacity-40 cursor-not-allowed",
          )}
        >
          {l.label}
        </ToggleButton>
      ))}
    </div>
  )
}
