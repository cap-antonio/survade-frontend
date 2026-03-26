import classNames from "classnames"
import { PropsWithChildren } from "react"

type Props = {
  bgInverse?: boolean
}
export const LandingHero = ({
  children,
  bgInverse,
}: PropsWithChildren<Props>) => {
  return (
    <section
      className={classNames(
        "relative min-h-[100vh] flex flex-col items-center justify-center px-4 text-center overflow-hidden",
        {
          "bg-[var(--color-surface)]/40": bgInverse,
        },
      )}
    >
      {children}
    </section>
  )
}
