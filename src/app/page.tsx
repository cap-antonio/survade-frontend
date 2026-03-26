import type { Metadata } from "next"
import { Intro } from "@/components/organisms/landing/Intro"
import { HowToPlay } from "@/components/organisms/landing/HowToPlay"
import { SettingsGrid } from "@/components/organisms/landing/SettingsGrid"

export const metadata: Metadata = {
  title: "Survade — Survival Discussion Game",
  description:
    "A group discussion game where you decide who deserves a spot in the safe place. Role cards, dark secrets, saboteurs.",
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Intro />
      <HowToPlay />
      <SettingsGrid />
      <footer className="border-t border-[var(--color-border)] py-8 text-center text-xs text-[var(--color-muted)] font-mono">
        survade.io · {new Date().getFullYear()}
      </footer>
    </main>
  )
}
