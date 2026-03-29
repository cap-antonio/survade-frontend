import { notFound } from "next/navigation"
import { LeaderboardPage } from "@/components/organisms/profile/LeaderboardPage"
import { Header } from "@/components/templates/Header"
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  isSupportedLocale,
  type SupportedLocale,
} from "@/i18n"
import { initLingui } from "@/initLingui"
import { Providers } from "../../providers"

type LocalizedLeaderboardPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams(): { slug: string }[] {
  return SUPPORTED_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).map(
    (locale) => ({ slug: locale }),
  )
}

export default async function LocalizedLeaderboardPage({
  params,
}: LocalizedLeaderboardPageProps): Promise<React.ReactElement> {
  const { slug } = await params

  if (!isSupportedLocale(slug) || slug === DEFAULT_LOCALE) {
    notFound()
  }

  await initLingui(slug)

  return (
    <Providers locale={slug as SupportedLocale}>
      <main className="min-h-screen bg-background">
        <Header locale={slug as SupportedLocale} />
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <LeaderboardPage />
        </section>
      </main>
    </Providers>
  )
}
