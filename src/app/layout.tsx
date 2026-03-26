import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"
import { initLingui } from "@/initLingui"

export const metadata: Metadata = {
  title: "Survade — Survival Discussion Game",
  description:
    "A discussion game where your group must decide who survives the apocalypse. Role cards, dark secrets, and one possible saboteur.",
  openGraph: {
    title: "Survade",
    description: "Who gets into the safe place?",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  initLingui()

  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
