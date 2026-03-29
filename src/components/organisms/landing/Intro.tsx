"use client"

import { useState } from "react"
import { useLingui } from "@lingui/react/macro"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { CreateGameModal } from "../../molecules/modals/CreateGameModal"
import { LandingHero } from "@/components/templates/LandingHero"
import { AuthMenu } from "../../molecules/AuthMenu"
import { getLocalizedPath, SupportedLocale } from "@/i18n"
import { AuthModal } from "@/components/molecules/modals/AuthModal"
import { useAuthStore } from "@/stores/authStore"

type ModalType = "craete-game" | "sign-up"

export function Intro() {
  const { t, i18n } = useLingui()
  const [codeInput, setCodeInput] = useState("")
  const [modalType, setModalType] = useState<ModalType | undefined>()
  const isAuth = useAuthStore((state) => state.isAuth)

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
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="absolute top-5 right-5 z-20">
          <AuthMenu />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block mb-4 px-3 py-1 text-xs font-mono text-accent border border-accent/30 rounded-full tracking-wider uppercase">
            {t`Survival Discussion Game`}
          </span>

          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter mb-4 leading-none">
            <span className="text-foreground">SURV</span>
            <span className="text-accent">ADE</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted mb-4 max-w-xl mx-auto leading-relaxed uppercase">
            {t`Survave and parsuade`}
          </p>

          <p className="text-lg sm:text-xl text-muted mb-10 max-w-xl mx-auto leading-relaxed">
            {t`The safe place has limited space. Your group must decide who gets in.`}
            {t`Argue, reveal secrets, vote — and survive.`}
          </p>

          <div className="flex flex-col gap-4 justify-center items-stretch sm:items-center">
            <Button
              size="lg"
              variant="primary"
              onClick={() => setModalType("craete-game")}
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

          {!isAuth && (
            <div className="flex flex-col gap-2 justify-center items-stretch sm:items-center mt-10">
              <span className="text-sm text-muted">{t`Want to see your stats, streaks, and saboteur performance?`}</span>

              <Button
                size="sm"
                variant="primary"
                onClick={() => setModalType("sign-up")}
                className="uppercase font-bold"
              >
                {t`Sign up for free`}
              </Button>
            </div>
          )}
        </div>
      </LandingHero>
      <AuthModal
        open={modalType === "sign-up"}
        onClose={() => setModalType(undefined)}
      />
      <CreateGameModal
        open={modalType === "craete-game"}
        onClose={() => setModalType(undefined)}
      />
    </>
  )
}
