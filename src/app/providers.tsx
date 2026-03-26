"use client"

import { useState, useEffect } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { I18nProvider } from "@lingui/react"
import { queryClient } from "@/api/query"
import { i18n, getStoredLocale, setLocale } from "@/i18n"

export function Providers({ children }: { children: React.ReactNode }) {
  const [i18nReady, setI18nReady] = useState(false)

  useEffect(() => {
    const locale = getStoredLocale()
    setLocale(locale).then(() => setI18nReady(true))
  }, [])

  if (!i18nReady) return <></>

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}
