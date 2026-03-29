import type { Metadata } from "next"
import { GameHistoryDetailRouteContent } from "@/components/organisms/profile/GameHistoryDetailRouteContent"
import { Header } from "@/components/templates/Header"
import { DEFAULT_LOCALE } from "@/i18n"
import { initLingui } from "@/initLingui"
import { Providers } from "../../providers"

export const metadata: Metadata = {
  title: "Game history detail — Survade",
  description: "Browse a full Survade match history.",
}

export default async function GameHistoryDetailRoutePage(): Promise<React.ReactElement> {
  await initLingui(DEFAULT_LOCALE)

  return (
    <Providers locale={DEFAULT_LOCALE}>
      <main className="min-h-screen bg-background">
        <Header locale={DEFAULT_LOCALE} />
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <GameHistoryDetailRouteContent locale={DEFAULT_LOCALE} />
        </section>
      </main>
    </Providers>
  )
}
