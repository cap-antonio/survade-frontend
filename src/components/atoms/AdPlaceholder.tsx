import cn from "classnames"

type AdSlot = "lobby" | "scenario_loading" | "end_screen"

type AdPlaceholderProps = {
  slot: AdSlot
  className?: string
}

const slotSizes: Record<AdSlot, string> = {
  lobby: "w-full h-[90px]",
  scenario_loading: "w-[300px] h-[250px]",
  end_screen: "w-full h-[120px]",
}

export function AdPlaceholder({ slot, className }: AdPlaceholderProps) {
  // TODO: replace with real ad SDK (Google AdSense, Yandex Adfox, etc.)
  return (
    <div
      data-ad-slot={slot}
      className={cn(
        "ad-placeholder flex items-center justify-center",
        "border border-dashed border-white/10 rounded-lg",
        "text-white/20 text-xs font-mono select-none",
        slotSizes[slot],
        className,
      )}
      aria-hidden="true"
    >
      ad · {slot}
    </div>
  )
}
