import { setI18n } from "@lingui/react/server"
import { getI18nInstance } from "@/app-router-i18n"

export function initLingui() {
  const i18n = getI18nInstance()
  setI18n(i18n)
  return i18n
}
