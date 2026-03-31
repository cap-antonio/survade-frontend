import { GameRouteContent } from "@/components/organisms/game/GameRouteContent"
import { DEFAULT_LOCALE } from "@/i18n"
import { initLingui } from "@/initLingui"
import { Providers } from "../providers"

export default async function PlayPage(): Promise<React.ReactElement> {
  await initLingui(DEFAULT_LOCALE)

  return (
    <Providers locale={DEFAULT_LOCALE}>
      <GameRouteContent locale={DEFAULT_LOCALE} />
    </Providers>
  )
}
