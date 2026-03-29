import { notFound } from "next/navigation"
import { GameHistoryPage } from "@/components/organisms/profile/GameHistoryPage"
import { Header } from "@/components/templates/Header"
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  isSupportedLocale,
  type SupportedLocale,
} from "@/i18n"
import { initLingui } from "@/initLingui"
import { Providers } from "../../providers"

type LocalizedGameHistoryPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams(): { slug: string }[] {
  return SUPPORTED_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).map(
    (locale) => ({ slug: locale }),
  )
}

export default async function LocalizedGameHistoryPage({
  params,
}: LocalizedGameHistoryPageProps): Promise<React.ReactElement> {
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
          <GameHistoryPage locale={slug as SupportedLocale} />
        </section>
      </main>
    </Providers>
  )
}
