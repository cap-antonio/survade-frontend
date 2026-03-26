import "server-only"

import { setupI18n, type I18n, type Messages } from "@lingui/core"
import { DEFAULT_LOCALE, type SupportedLocale } from "@/i18n"

async function loadCatalog(locale: SupportedLocale): Promise<Record<string, Messages>> {
  const { messages } = await import(`./locales/${locale}/messages.po`)

  return {
    [locale]: messages,
  }
}

const catalogs = await Promise.all([loadCatalog(DEFAULT_LOCALE)])

export const allMessages = catalogs.reduce<Record<string, Messages>>((acc, catalog) => {
  return { ...acc, ...catalog }
}, {})

export function getI18nInstance(): I18n {
  return setupI18n({
    locale: DEFAULT_LOCALE,
    messages: {
      [DEFAULT_LOCALE]: allMessages[DEFAULT_LOCALE] ?? {},
    },
  })
}
