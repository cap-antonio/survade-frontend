import type { Metadata } from "next"
import { Header } from "@/components/templates/Header"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, getLocalizedPath } from "@/i18n"
import { initLingui } from "@/initLingui"
import { Providers } from "../providers"

export const metadata: Metadata = {
  title: "Leaderboard — Survade",
  description: "View Survade leaderboard rankings.",
  alternates: {
    canonical: "/leaderboard",
    languages: Object.fromEntries(
      SUPPORTED_LOCALES.map((locale) => [
        locale,
        getLocalizedPath(locale, "leaderboard"),
      ]),
    ),
  },
}

export default async function LeaderboardPage(): Promise<React.ReactElement> {
  await initLingui(DEFAULT_LOCALE)

  return (
    <Providers locale={DEFAULT_LOCALE}>
      <main className="min-h-screen bg-background">
        <Header locale={DEFAULT_LOCALE} />
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h1 className="text-4xl font-black tracking-tight">Leaderboard</h1>
        </section>
      </main>
    </Providers>
  )
}
