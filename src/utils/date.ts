import { SupportedLocale } from "@/i18n"

const EMPTY_STATE = "—"

export function formatDate(
  value: string | null,
  locale: SupportedLocale,
): string {
  if (!value) return EMPTY_STATE

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return EMPTY_STATE

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}
