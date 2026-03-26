import { notFound } from "next/navigation"
import { GameShell } from "@/components/organisms/game/GameShell"
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  isSupportedLocale,
  type SupportedLocale,
} from "@/i18n"
import { initLingui } from "@/initLingui"
import { Providers } from "../../providers"

type LocalizedGamePageProps = {
  params: Promise<{ slug: string; code: string }>
}

export function generateStaticParams(): {
  slug: string
  code: string
}[] {
  return SUPPORTED_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).map(
    (locale) => ({
      slug: locale,
      code: "SHELL",
    }),
  )
}

export default async function LocalizedGamePage({
  params,
}: LocalizedGamePageProps): Promise<React.ReactElement> {
  const { slug, code } = await params

  if (!isSupportedLocale(slug) || slug === DEFAULT_LOCALE) {
    notFound()
  }

  await initLingui(slug)

  return (
    <Providers locale={slug as SupportedLocale}>
      <GameShell code={code.toUpperCase()} locale={slug as SupportedLocale} />
    </Providers>
  )
}
