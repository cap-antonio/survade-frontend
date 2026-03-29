import cn from "classnames"

type BadgeVariant = "default" | "accent" | "green" | "yellow" | "red" | "muted"

type BadgeProps = {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-white/10 text-foreground",
  accent: "bg-accent-soft text-accent",
  green: "bg-emerald-900/40 text-emerald-400",
  yellow: "bg-yellow-900/40 text-yellow-400",
  red: "bg-red-900/40 text-red-400",
  muted: "bg-surface-hover text-muted",
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
