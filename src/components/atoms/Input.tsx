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
  required?: boolean
  label?: string
}

const PARASITIC_CHARS_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200D\u2060\uFEFF]/g

const sanitizeInputValue = (
  nextValue: string,
  type: InputProps["type"],
): string => {
  const valueWithoutParasiticChars = nextValue.replace(PARASITIC_CHARS_REGEX, "")

  if (type === "password") {
    return valueWithoutParasiticChars
  }

  const singleLineValue = valueWithoutParasiticChars.replace(/[\r\n\t]+/g, " ")

  if (type === "email") {
    return singleLineValue.replace(/\s+/g, "")
  }

  return singleLineValue
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
  required,
  label,
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="block text-xs text-[var(--color-muted)] uppercase tracking-wider">
          {label}

          {required ? (
            <span className="text-[var(--color-accent)] ml-1">*</span>
          ) : null}
        </label>
      )}
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
        onChange={(e) => onChange(sanitizeInputValue(e.target.value, type))}
        className={cn(
          "w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded px-3 py-2",
          "text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)]",
          "focus:outline-none focus:border-[var(--color-accent)]/50",
          "disabled:opacity-40",
          className,
        )}
      />
    </div>
  )
}
