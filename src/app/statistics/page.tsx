import type { Metadata } from "next"
import { StatisticsView } from "@/components/organisms/profile/StatisticsView"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, getLocalizedPath } from "@/i18n"
import { initLingui } from "@/initLingui"
import { Providers } from "../providers"

export const metadata: Metadata = {
  title: "Statistics — Survade",
  description: "Review your Survade profile and performance statistics.",
  alternates: {
    canonical: "/statistics",
    languages: Object.fromEntries(
      SUPPORTED_LOCALES.map((locale) => [
        locale,
        getLocalizedPath(locale, "statistics"),
      ]),
    ),
  },
}

export default async function StatisticsPage(): Promise<React.ReactElement> {
  await initLingui(DEFAULT_LOCALE)

  return (
    <Providers locale={DEFAULT_LOCALE}>
      <main className="min-h-screen bg-[var(--color-bg)] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <StatisticsView locale={DEFAULT_LOCALE} />
        </div>
      </main>
    </Providers>
  )
}
