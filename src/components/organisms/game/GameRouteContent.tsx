"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useLingui } from "@lingui/react/macro"
import { Button } from "@/components/atoms/Button"
import { getLocalizedPath, type SupportedLocale } from "@/i18n"
import { GameShell } from "./GameShell"

type GameRouteContentProps = {
  locale: SupportedLocale
}

function GameRouteInner({
  locale,
}: GameRouteContentProps): React.ReactElement {
  const { t } = useLingui()
  const searchParams = useSearchParams()
  const code = searchParams.get("code")?.trim().toUpperCase()

  if (!code) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 text-center">
          <h1 className="text-2xl font-black tracking-tight">
            {t`Game code is missing`}
          </h1>
          <p className="mt-3 text-sm text-muted">
            {t`Open the invite link again or enter a game code on the home page.`}
          </p>
          <Link href={getLocalizedPath(locale)} className="mt-6 inline-flex">
            <Button variant="secondary">{t`Back to home`}</Button>
          </Link>
        </div>
      </div>
    )
  }

  return <GameShell code={code} locale={locale} />
}

export function GameRouteContent({
  locale,
}: GameRouteContentProps): React.ReactElement {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      }
    >
      <GameRouteInner locale={locale} />
    </Suspense>
  )
}
