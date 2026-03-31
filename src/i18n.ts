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
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "de", label: "DE" },
  { code: "pl", label: "PL" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
  { code: "tr", label: "TR" },
  { code: "zh", label: "ZH" },
  { code: "uk", label: "UK" },
]

export const DEFAULT_LOCALE: SupportedLocale = "en"
const loadedLocales = new Set<SupportedLocale>()

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale)
}

export function getLocalizedPath(locale: SupportedLocale, path = ""): string {
  const normalizedPath = path.replace(/^\/+|\/+$/g, "")

  if (locale === DEFAULT_LOCALE) {
    return normalizedPath ? `/${normalizedPath}` : "/"
  }

  return normalizedPath ? `/${locale}/${normalizedPath}` : `/${locale}`
}

export function getPlayPath(locale: SupportedLocale, code: string): string {
  const normalizedCode = code.trim().toUpperCase()
  const query = new URLSearchParams({ code: normalizedCode }).toString()

  return `${getLocalizedPath(locale, "play")}?${query}`
}

export function getStoredLocale(): SupportedLocale {
  if (typeof window === "undefined") return DEFAULT_LOCALE
  const stored = localStorage.getItem("ui_locale")
  if (stored && isSupportedLocale(stored)) {
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
