import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { HowToPlay } from "@/components/organisms/landing/HowToPlay"
import { Intro } from "@/components/organisms/landing/Intro"
import { SettingsGrid } from "@/components/organisms/landing/SettingsGrid"
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  getLocalizedPath,
  isSupportedLocale,
  type SupportedLocale,
} from "@/i18n"
import { initLingui } from "@/initLingui"
import { Providers } from "../providers"

type SlugPageProps = {
  params: Promise<{ slug: string }>
}

function isPublicLocale(locale: string): locale is Exclude<SupportedLocale, "en"> {
  return isSupportedLocale(locale) && locale !== DEFAULT_LOCALE
}

export function generateStaticParams(): { slug: string }[] {
  return SUPPORTED_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).map(
    (locale) => ({ slug: locale }),
  )
}

export async function generateMetadata({
  params,
}: SlugPageProps): Promise<Metadata> {
  const { slug } = await params

  if (isPublicLocale(slug)) {
    return {
      title: "Survade — Survival Discussion Game",
      description:
        "A group discussion game where you decide who deserves a spot in the safe place. Role cards, dark secrets, saboteurs.",
      alternates: {
        canonical: getLocalizedPath(slug),
        languages: Object.fromEntries(
          SUPPORTED_LOCALES.map((locale) => [
            locale,
            getLocalizedPath(locale),
          ]),
        ),
      },
    }
  }

  return {
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function SlugPage({
  params,
}: SlugPageProps): Promise<React.ReactElement> {
  const { slug } = await params

  if (slug === DEFAULT_LOCALE) {
    notFound()
  }

  if (!isPublicLocale(slug)) {
    notFound()
  }

  await initLingui(slug)

  return (
    <Providers locale={slug}>
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
