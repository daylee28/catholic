// Auto-scroll for prayer reading — pauses on manual scroll, resumes after idle

import { useEffect, useRef } from 'react'

/** px per second for speed levels 1–5 (elderly-friendly slow range) */
const SPEED_PX_PER_SEC: Record<number, number> = {
  1: 18,
  2: 28,
  3: 42,
  4: 60,
  5: 85,
}

const RESUME_AFTER_MS = 1800

export function useAutoScroll(enabled: boolean, speedLevel: number) {
  const ignoreScrollUntilRef = useRef(0)
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

    const onUserScroll = () => {
      if (Date.now() < ignoreScrollUntilRef.current) return
      pauseFromUser()
    }

    let raf = 0

    const tick = (ts: number) => {
      raf = requestAnimationFrame(tick)

      if (Date.now() < pausedUntilRef.current) {
        lastTsRef.current = 0
        return
      }

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      if (maxScroll <= 0 || window.scrollY >= maxScroll - 1) {
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

      ignoreScrollUntilRef.current = Date.now() + 80
      window.scrollBy(0, delta)
    }

    raf = requestAnimationFrame(tick)

    window.addEventListener('wheel', pauseFromUser, { passive: true })
    window.addEventListener('touchmove', pauseFromUser, { passive: true })
    window.addEventListener('keydown', pauseFromUser, { passive: true })
    window.addEventListener('scroll', onUserScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('wheel', pauseFromUser)
      window.removeEventListener('touchmove', pauseFromUser)
      window.removeEventListener('keydown', pauseFromUser)
      window.removeEventListener('scroll', onUserScroll)
    }
  }, [enabled, speedLevel])
}
