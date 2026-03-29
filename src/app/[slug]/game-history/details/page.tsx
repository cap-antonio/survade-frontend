import { notFound } from "next/navigation"
import { GameHistoryDetailRouteContent } from "@/components/organisms/profile/GameHistoryDetailRouteContent"
import { Header } from "@/components/templates/Header"
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  isSupportedLocale,
  type SupportedLocale,
} from "@/i18n"
import { initLingui } from "@/initLingui"
import { Providers } from "../../../providers"

type LocalizedGameHistoryDetailRouteProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams(): { slug: string }[] {
  return SUPPORTED_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).map(
    (locale) => ({ slug: locale }),
  )
}

export default async function LocalizedGameHistoryDetailRoutePage({
  params,
}: LocalizedGameHistoryDetailRouteProps): Promise<React.ReactElement> {
  const { slug } = await params

  if (!isSupportedLocale(slug) || slug === DEFAULT_LOCALE) {
    notFound()
  }

  await initLingui(slug)

  return (
    <Providers locale={slug as SupportedLocale}>
      <main className="min-h-screen bg-background">
        <Header locale={slug as SupportedLocale} />
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <GameHistoryDetailRouteContent locale={slug as SupportedLocale} />
        </section>
      </main>
    </Providers>
  )
}
