"use client"

import {
  Dispatch,
  CSSProperties,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"

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
  const anchorRef = useRef<HTMLDivElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  const [localOpen, setOpenLocal] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({})

  const open = parentOpen ?? localOpen
  const setOpen = setParentOpen ?? setOpenLocal

  const updatePosition = useCallback(() => {
    if (!anchorRef.current) return

    const rect = anchorRef.current.getBoundingClientRect()
    const viewportPadding = 16

    setMenuStyle({
      position: "fixed",
      top: rect.bottom + 12,
      right: Math.max(viewportPadding, window.innerWidth - rect.right),
      maxWidth: `calc(100vw - ${viewportPadding * 2}px)`,
    })
  }, [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      if (
        !anchorRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
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
  }, [open, setOpen])

  useEffect(() => {
    if (!open || !isMounted) return

    updatePosition()

    const handleReposition = () => {
      updatePosition()
    }

    window.addEventListener("resize", handleReposition)
    window.addEventListener("scroll", handleReposition, true)

    return () => {
      window.removeEventListener("resize", handleReposition)
      window.removeEventListener("scroll", handleReposition, true)
    }
  }, [isMounted, open, updatePosition])

  return (
    <>
      <div ref={anchorRef} className="relative">
        {children}
      </div>

      {open && isMounted
        ? createPortal(
            <div
              ref={menuRef}
              style={menuStyle}
              className="z-[1000] min-w-52 overflow-hidden rounded-2xl border border-border bg-surface/95 p-2 shadow-2xl backdrop-blur-md"
            >
              {items}
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
