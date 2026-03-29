import { notFound } from "next/navigation"
import { ProfilePage } from "@/components/organisms/profile/ProfilePage"
import { Header } from "@/components/templates/Header"
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  isSupportedLocale,
  type SupportedLocale,
} from "@/i18n"
import { initLingui } from "@/initLingui"
import { Providers } from "../../providers"

type LocalizedProfilePageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams(): { slug: string }[] {
  return SUPPORTED_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).map(
    (locale) => ({ slug: locale }),
  )
}

export default async function LocalizedProfilePage({
  params,
}: LocalizedProfilePageProps): Promise<React.ReactElement> {
  const { slug } = await params

  if (!isSupportedLocale(slug) || slug === DEFAULT_LOCALE) {
    notFound()
  }

  await initLingui(slug)

  return (
    <Providers locale={slug as SupportedLocale}>
      <main className="min-h-screen bg-background">
        <Header locale={slug as SupportedLocale} />
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <ProfilePage locale={slug as SupportedLocale} />
        </div>
      </main>
    </Providers>
  )
}
