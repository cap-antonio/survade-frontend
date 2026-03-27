"use client"

import {
  Dispatch,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react"

type Props = {
  items: ReactNode
  open?: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
}

export function Dropdown({
  children,
  items,
  open: parentOpen,
  setOpen: setParentOpen,
}: PropsWithChildren<Props>) {
  const menuRef = useRef<HTMLDivElement | null>(null)

  const [localOpen, setOpenLocal] = useState(false)

  const open = parentOpen || localOpen
  const setOpen = setParentOpen || setOpenLocal

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  return (
    <>
      <div ref={menuRef} className="relative">
        {children}

        {open ? (
          <div className="absolute right-0 top-[calc(100%+0.75rem)] z-30 min-w-52 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-2 shadow-2xl backdrop-blur-md">
            {items}
          </div>
        ) : null}
      </div>
    </>
  )
}
