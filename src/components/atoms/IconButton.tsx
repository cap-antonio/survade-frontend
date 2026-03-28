"use client"

import cn from "classnames"

type IconButtonVariant = "secondary" | "ghost" | "primary"
type IconButtonSize = "sm" | "md" | "lg"

type IconButtonProps = {
  Icon: React.ReactNode
  label?: string
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  variant?: IconButtonVariant
  size?: IconButtonSize
  disabled?: boolean
  className?: string
}

const variantClasses: Record<IconButtonVariant, string> = {
  primary:
    "bg-[var(--color-surface-2)] hover:bg-[var(--color-surface)] text-[var(--color-accent)] border-[var(--color-accent)]",
  secondary:
    "bg-[var(--color-surface-2)] hover:bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]",
  ghost:
    "bg-transparent hover:bg-white/5 text-[var(--color-text)] border-transparent",
}

const sizeClasses: Record<IconButtonSize, string> = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-12 w-12",
}

export function IconButton({
  Icon,
  label,
  onClick,
  type = "button",
  variant = "secondary",
  size = "md",
  disabled = false,
  className,
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "cursor-pointer inline-flex items-center justify-center rounded-md border transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {Icon}
    </button>
  )
}
