import type { Metadata } from "next"
import { HowToPlay } from "@/components/organisms/landing/HowToPlay"
import { Intro } from "@/components/organisms/landing/Intro"
import { SettingsGrid } from "@/components/organisms/landing/SettingsGrid"
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  getLocalizedPath,
} from "@/i18n"
import { initLingui } from "@/initLingui"
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "Survade — Survival Discussion Game",
  description:
    "A group discussion game where you decide who deserves a spot in the safe place. Role cards, dark secrets, saboteurs.",
  alternates: {
    canonical: "/",
    languages: Object.fromEntries(
      SUPPORTED_LOCALES.map((locale) => [locale, getLocalizedPath(locale)]),
    ),
  },
}

export default async function RootPage(): Promise<React.ReactElement> {
  await initLingui(DEFAULT_LOCALE)

  return (
    <Providers locale={DEFAULT_LOCALE}>
      <main className="min-h-screen bg-background">
        <Intro />
        <HowToPlay />
        <SettingsGrid />
        <footer className="border-t border-border py-8 text-center text-xs text-muted font-mono">
          survade.io · {new Date().getFullYear()}
        </footer>
      </main>
    </Providers>
  )
}
