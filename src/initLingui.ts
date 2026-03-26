import { setI18n } from "@lingui/react/server"
import { type SupportedLocale } from "@/i18n"
import { getI18nInstance } from "@/app-router-i18n"

export async function initLingui(locale: SupportedLocale) {
  const i18n = await getI18nInstance(locale)
  setI18n(i18n)
  return i18n
}
