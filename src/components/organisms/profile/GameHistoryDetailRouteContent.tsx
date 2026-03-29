"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useLingui } from "@lingui/react/macro"
import { Button } from "@/components/atoms/Button"
import { getLocalizedPath, type SupportedLocale } from "@/i18n"
import { GameHistoryDetailPage } from "./GameHistoryDetailPage"

type GameHistoryDetailRouteContentProps = {
  locale: SupportedLocale
}

function GameHistoryDetailRouteInner({
  locale,
}: GameHistoryDetailRouteContentProps): React.ReactElement {
  const { t } = useLingui()
  const searchParams = useSearchParams()
  const gameId = searchParams.get("gameId")

  if (!gameId) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-8 text-center">
        <h1 className="text-2xl font-black tracking-tight">
          {t`Game history is unavailable`}
        </h1>
        <p className="mt-3 text-sm text-muted">
          {t`Open a match from the history table to see its details.`}
        </p>
        <Link
          href={getLocalizedPath(locale, "game-history")}
          className="mt-6 inline-flex"
        >
          <Button variant="secondary">{t`Back to history`}</Button>
        </Link>
      </div>
    )
  }

  return <GameHistoryDetailPage gameId={gameId} locale={locale} />
}

export function GameHistoryDetailRouteContent({
  locale,
}: GameHistoryDetailRouteContentProps): React.ReactElement {
  return (
    <Suspense
      fallback={
        <div className="rounded-3xl border border-border bg-surface p-8 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      }
    >
      <GameHistoryDetailRouteInner locale={locale} />
    </Suspense>
  )
}
