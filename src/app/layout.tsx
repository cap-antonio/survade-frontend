import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://survade.io"),
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
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
