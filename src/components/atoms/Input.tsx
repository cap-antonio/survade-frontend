import cn from "classnames"

type InputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: "text" | "email" | "password" | "number"
  disabled?: boolean
  className?: string
  id?: string
  name?: string
  maxLength?: number
  min?: number
  max?: number
}

export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  className,
  id,
  name,
  maxLength,
  min,
  max,
}: InputProps) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      min={min}
      max={max}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded px-3 py-2",
        "text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)]",
        "focus:outline-none focus:border-[var(--color-accent)]/50",
        "disabled:opacity-40",
        className,
      )}
    />
  )
}
