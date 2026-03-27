"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLingui } from "@lingui/react/macro"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { CreateGameModal } from "./CreateGameModal"
import { LandingHero } from "@/components/templates/LandingHero"
import { LocalesButtons } from "@/components/molecules/LocalesButtons"
import { getLocalizedPath, setLocale, SupportedLocale } from "@/i18n"

export function Intro() {
  const { t, i18n } = useLingui()
  const router = useRouter()
  const [codeInput, setCodeInput] = useState("")
  const [showCreate, setShowCreate] = useState(false)

  const handleJoin = (): void => {
    const code = codeInput.trim().toUpperCase()
    if (code.length >= 4) {
      window.location.href = getLocalizedPath(
        i18n.locale as SupportedLocale,
        code,
      )
    }
  }

  return (
    <>
      <LandingHero>
        {/* Atmospheric background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-accent)]/5 blur-[120px]" />
        </div>

        <LocalesButtons
          className="absolute top-5 right-5"
          activeLocales={[i18n.locale as SupportedLocale]}
          onChange={(code) => {
            void setLocale(code)
            router.push(getLocalizedPath(code))
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block mb-4 px-3 py-1 text-xs font-mono text-[var(--color-accent)] border border-[var(--color-accent)]/30 rounded-full tracking-wider uppercase">
            {t`Survival Discussion Game`}
          </span>

          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter mb-4 leading-none">
            <span className="text-[var(--color-text)]">SUR</span>
            <span className="text-[var(--color-accent)]">VADE</span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--color-muted)] mb-10 max-w-xl mx-auto leading-relaxed">
            {t`The safe place has limited space. Your group must decide who gets in.`}
            {t`Argue, reveal secrets, vote — and survive.`}
          </p>

          <div className="flex flex-col gap-4 justify-center items-stretch sm:items-center">
            <Button
              size="lg"
              variant="primary"
              onClick={() => setShowCreate(true)}
              className="sm:min-w-[180px] uppercase font-bold"
            >
              {t`Create Game`}
            </Button>

            <div className="flex gap-2 self-center">
              <Input
                value={codeInput}
                onChange={setCodeInput}
                placeholder={t`Game code (e.g. XKTMW)`}
                maxLength={6}
                className="uppercase tracking-widest font-mono w-44"
              />
              <Button
                size="md"
                variant="secondary"
                onClick={handleJoin}
                disabled={codeInput.trim().length < 4}
              >
                {t`Join`}
              </Button>
            </div>
          </div>
        </div>
      </LandingHero>

      <CreateGameModal open={showCreate} onClose={() => setShowCreate(false)} />
    </>
  )
}
