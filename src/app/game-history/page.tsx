import type { Metadata } from "next"
import { Header } from "@/components/templates/Header"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, getLocalizedPath } from "@/i18n"
import { initLingui } from "@/initLingui"
import { Providers } from "../providers"

export const metadata: Metadata = {
  title: "Game history — Survade",
  description: "Browse your recent Survade game history.",
  alternates: {
    canonical: "/game-history",
    languages: Object.fromEntries(
      SUPPORTED_LOCALES.map((locale) => [
        locale,
        getLocalizedPath(locale, "game-history"),
      ]),
    ),
  },
}

export default async function GameHistoryPage(): Promise<React.ReactElement> {
  await initLingui(DEFAULT_LOCALE)

  return (
    <Providers locale={DEFAULT_LOCALE}>
      <main className="min-h-screen bg-background">
        <Header locale={DEFAULT_LOCALE} />
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h1 className="text-4xl font-black tracking-tight">Game history</h1>
        </section>
      </main>
    </Providers>
  )
}
