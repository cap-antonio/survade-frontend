import type { Metadata } from "next"
import { ProfilePage as Profile } from "@/components/organisms/profile/ProfilePage"
import { Header } from "@/components/templates/Header"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, getLocalizedPath } from "@/i18n"
import { initLingui } from "@/initLingui"
import { Providers } from "../providers"

export const metadata: Metadata = {
  title: "Statistics — Survade",
  description:
    "Review your Survade profile, performance statistics and games history.",
  alternates: {
    canonical: "/profile",
    languages: Object.fromEntries(
      SUPPORTED_LOCALES.map((locale) => [
        locale,
        getLocalizedPath(locale, "profile"),
      ]),
    ),
  },
}

export default async function ProfilePage(): Promise<React.ReactElement> {
  await initLingui(DEFAULT_LOCALE)

  return (
    <Providers locale={DEFAULT_LOCALE}>
      <main className="min-h-screen bg-background">
        <Header locale={DEFAULT_LOCALE} />
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <Profile locale={DEFAULT_LOCALE} />
        </div>
      </main>
    </Providers>
  )
}
