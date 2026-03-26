import "server-only"

import { setupI18n, type I18n, type Messages } from "@lingui/core"
import { DEFAULT_LOCALE, type SupportedLocale } from "@/i18n"

async function loadCatalog(locale: SupportedLocale): Promise<Messages> {
  const { messages } = await import(`./locales/${locale}/messages.po`)

  return messages
}

export async function getI18nInstance(
  locale: SupportedLocale = DEFAULT_LOCALE,
): Promise<I18n> {
  const messages = await loadCatalog(locale)

  return setupI18n({
    locale,
    messages: {
      [locale]: messages,
    },
  })
}
