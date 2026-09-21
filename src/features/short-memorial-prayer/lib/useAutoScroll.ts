// Auto-scroll — pause only on real user input (not our own scroll events)

import { useEffect, useRef } from 'react'

const SPEED_PX_PER_SEC: Record<number, number> = {
  1: 22,
  2: 40,
  3: 70,
}

const RESUME_AFTER_MS = 1800

function maxScrollY(): number {
  const el = document.documentElement
  return Math.max(0, el.scrollHeight - el.clientHeight)
}

export function useAutoScroll(enabled: boolean, speedLevel: number) {
  const pausedUntilRef = useRef(0)
  const lastTsRef = useRef(0)
  const carryRef = useRef(0)

  useEffect(() => {
    if (!enabled) {
      lastTsRef.current = 0
      carryRef.current = 0
      return
    }

    const pxPerSec = SPEED_PX_PER_SEC[speedLevel] ?? SPEED_PX_PER_SEC[2]

    const pauseFromUser = () => {
      pausedUntilRef.current = Date.now() + RESUME_AFTER_MS
      lastTsRef.current = 0
      carryRef.current = 0
    }

    let raf = 0

    const tick = (ts: number) => {
      raf = requestAnimationFrame(tick)

      if (Date.now() < pausedUntilRef.current) {
        lastTsRef.current = 0
        return
      }

      const max = maxScrollY()
      const y = window.scrollY || document.documentElement.scrollTop
      if (max <= 0 || y >= max - 1) {
        lastTsRef.current = 0
        return
      }

      if (!lastTsRef.current) {
        lastTsRef.current = ts
        return
      }

      const dt = Math.min(64, ts - lastTsRef.current) / 1000
      lastTsRef.current = ts
      carryRef.current += pxPerSec * dt

      if (carryRef.current < 1) return

      const delta = Math.floor(carryRef.current)
      carryRef.current -= delta
      window.scrollBy(0, Math.min(delta, max - y))
    }

    raf = requestAnimationFrame(tick)

    // Do NOT listen to `scroll` — auto-scroll itself fires scroll and was
    // falsely pausing/resuming, which made the scrubber jump.
    window.addEventListener('wheel', pauseFromUser, { passive: true })
    window.addEventListener('touchmove', pauseFromUser, { passive: true })
    window.addEventListener('keydown', pauseFromUser, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('wheel', pauseFromUser)
      window.removeEventListener('touchmove', pauseFromUser)
      window.removeEventListener('keydown', pauseFromUser)
    }
  }, [enabled, speedLevel])
}
