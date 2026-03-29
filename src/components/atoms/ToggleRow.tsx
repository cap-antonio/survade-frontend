import cn from "classnames"

type ToggleRowItem = {
  title: string
  isActive: boolean
  onClick: () => void
}

type ToggleRowProps = {
  items: ToggleRowItem[]
}

export function ToggleRow({ items }: ToggleRowProps) {
  const activeIndex = items.findIndex((item) => item.isActive)

  return (
    <div
      className={cn(
        "relative grid gap-2 rounded-full border border-border bg-surface-elevated p-1",
      )}
      style={{
        gridTemplateColumns: `repeat(${Math.max(items.length, 1)}, minmax(0, 1fr))`,
      }}
    >
      {activeIndex >= 0 ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-1 left-1 rounded-full bg-primary shadow-[0_0_24px_rgba(230,57,70,0.22)] transition-transform duration-300 ease-out"
          style={{
            width: `calc((100% - 0.5rem) / ${Math.max(items.length, 1)})`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
      ) : null}

      {items.map((item) => (
        <button
          key={item.title}
          type="button"
          onClick={item.onClick}
          className={cn(
            "relative z-10 rounded-full px-4 py-2 text-sm font-bold transition-colors duration-300 cursor-pointer",
            item.isActive ? "text-white" : "text-muted",
          )}
        >
          {item.title}
        </button>
      ))}
    </div>
  )
}
