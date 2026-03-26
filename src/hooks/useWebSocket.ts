"use client"

import { useEffect, useRef, useCallback } from "react"
import { useGameStore } from "@/stores/gameStore"
import { queryClient } from "@/api/query"
import { CACHE_KEYS } from "@/api/CACHE_KEYS"
import type { GameEvent } from "@/api/generated/schema"

const WS_BASE = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000"
const MAX_RECONNECT_DELAY_MS = 30_000

export function useWebSocket(
  code: string,
  playerId: number | null,
  playerToken: string | null,
): void {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectDelayRef = useRef(1_000)
  const unmountedRef = useRef(false)
  const applyEvent = useGameStore((s) => s.applyEvent)

  const connect = useCallback(() => {
    if (!playerId || !playerToken || unmountedRef.current) return

    const url = `${WS_BASE}/ws/${code}?player_id=${playerId}&token=${playerToken}`
    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      reconnectDelayRef.current = 1_000
    }

    ws.onmessage = (evt) => {
      let event: GameEvent
      try {
        event = JSON.parse(evt.data as string) as GameEvent
      } catch {
        return
      }
      applyEvent(event)

      // Re-sync full game state for structural events
      if (
        event.type === "ROUND_STARTED" ||
        event.type === "GAME_ENDED" ||
        event.type === "PLAYER_ELIMINATED" ||
        event.type === "PLAYER_KICKED"
      ) {
        queryClient.invalidateQueries({ queryKey: CACHE_KEYS.game.detail })
      }
    }

    ws.onclose = () => {
      if (unmountedRef.current) return
      const delay = reconnectDelayRef.current
      reconnectDelayRef.current = Math.min(delay * 2, MAX_RECONNECT_DELAY_MS)
      setTimeout(connect, delay)
    }

    ws.onerror = () => {
      ws.close()
    }
  }, [code, playerId, playerToken, applyEvent])

  useEffect(() => {
    unmountedRef.current = false
    connect()

    return () => {
      unmountedRef.current = true
      wsRef.current?.close()
    }
  }, [connect])
}
