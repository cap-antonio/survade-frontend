import cn from "classnames"

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger"
type ButtonSize = "sm" | "md" | "lg"

type ButtonProps = {
  label?: string
  children?: React.ReactNode
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  className?: string
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-accent)] hover:bg-red-500 text-white border-transparent",
  secondary:
    "bg-[var(--color-surface-2)] hover:bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]",
  ghost:
    "bg-transparent hover:bg-white/5 text-[var(--color-text)] border-transparent",
  danger: "bg-red-900/40 hover:bg-red-800/60 text-red-300 border-red-800/40",
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
}

export function Button({
  label,
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className,
  fullWidth = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium rounded border transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
    >
      {loading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {label ?? children}
    </button>
  )
}
