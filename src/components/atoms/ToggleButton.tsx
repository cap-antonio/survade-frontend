import classNames from "classnames"
import { PropsWithChildren, ReactNode } from "react"

type Props = {
  onClick?: () => void
  isActive?: boolean
  isLocked?: boolean
  className?: string
}
export const ToggleButton = ({
  onClick,
  isActive,
  isLocked,
  children,
  className,
}: PropsWithChildren<Props>) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "px-3 py-1.5 rounded border text-xs transition-colors",
        {
          "cursor-pointer": !!onClick,
          "border-[var(--color-accent)] bg-[var(--color-accent-dim)]": isActive,
          "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)]":
            !isActive,
        },
        isLocked && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {children}
    </button>
  )
}
