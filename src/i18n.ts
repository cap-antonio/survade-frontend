import { i18n } from "@lingui/core"

export const SUPPORTED_LOCALES = [
  "en",
  "ru",
  "pl",
  "de",
  "fr",
  "es",
  "tr",
  "zh",
  "uk",
] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export const LANGS_DICT: { code: SupportedLocale; label: string }[] = [
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
  { code: "pl", label: "PL" },
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
  { code: "tr", label: "TR" },
  { code: "zh", label: "ZH" },
  { code: "uk", label: "UK" },
]

export const DEFAULT_LOCALE: SupportedLocale = "en"
const loadedLocales = new Set<SupportedLocale>()

export function getStoredLocale(): SupportedLocale {
  if (typeof window === "undefined") return DEFAULT_LOCALE
  const stored = localStorage.getItem("ui_locale")
  if (stored && (SUPPORTED_LOCALES as readonly string[]).includes(stored)) {
    return stored as SupportedLocale
  }
  return DEFAULT_LOCALE
}

export async function loadCatalog(locale: SupportedLocale): Promise<void> {
  if (loadedLocales.has(locale)) return

  const { messages } = await import(`./locales/${locale}/messages.po`)
  i18n.load(locale, messages)
  loadedLocales.add(locale)
}

export async function setLocale(locale: SupportedLocale): Promise<void> {
  await loadCatalog(locale)
  i18n.activate(locale)

  if (typeof window !== "undefined") {
    localStorage.setItem("ui_locale", locale)
  }
}

export { i18n }
