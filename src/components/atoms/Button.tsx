import cn from "classnames"
import { ReactNode } from "react"

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
  leftIcon?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary hover:bg-primary/90 text-white border-transparent",
  secondary:
    "bg-surface-elevated hover:bg-surface text-foreground border-border",
  ghost:
    "bg-transparent hover:bg-surface-hover text-foreground border-transparent",
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
  leftIcon,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "cursor-pointer font-bold",
        "inline-flex items-center justify-center gap-2 font-medium rounded border transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : leftIcon ? (
        <div className="[&>svg]:w-5 [&>svg]:h-5">{leftIcon}</div>
      ) : null}
      {label ?? children}
    </button>
  )
}
