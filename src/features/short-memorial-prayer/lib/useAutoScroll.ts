// Auto-scroll on the reading pane — speed is px/sec (0 = idle)

import { useEffect, useRef } from 'react'
import { getMaxScroll, getScrollTop, scrollByY } from './scrollRoot'

const RESUME_AFTER_MS = 1800

export const USER_SCROLL_INTENT_EVENT = 'prayer-user-scroll-intent'

/** True while user is dragging the scrubber — auto-scroll must not move at all */
let scrubberDragLock = false
/** True while known-prayer sheet is open */
let overlayPauseLock = false

export function setScrubberDragLock(locked: boolean) {
  scrubberDragLock = locked
}

export function setOverlayPauseLock(locked: boolean) {
  overlayPauseLock = locked
}

export function notifyUserScrollIntent() {
  window.dispatchEvent(new Event(USER_SCROLL_INTENT_EVENT))
}

export function useAutoScroll(enabled: boolean, pxPerSec: number) {
  const pausedUntilRef = useRef(0)
  const lastTsRef = useRef(0)
  const carryRef = useRef(0)
  const speedRef = useRef(pxPerSec)
  speedRef.current = pxPerSec

  useEffect(() => {
    if (!enabled) {
      lastTsRef.current = 0
      carryRef.current = 0
      return
    }

    const pauseFromUser = () => {
      pausedUntilRef.current = Date.now() + RESUME_AFTER_MS
      lastTsRef.current = 0
      carryRef.current = 0
    }

    let raf = 0

    const tick = (ts: number) => {
      raf = requestAnimationFrame(tick)

      const speed = speedRef.current
      if (
        speed <= 0 ||
        scrubberDragLock ||
        overlayPauseLock ||
        Date.now() < pausedUntilRef.current
      ) {
        lastTsRef.current = 0
        return
      }

      const max = getMaxScroll()
      const y = getScrollTop()
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
      carryRef.current += speed * dt

      if (carryRef.current < 1) return

      const delta = Math.floor(carryRef.current)
      carryRef.current -= delta
      scrollByY(Math.min(delta, max - y))
    }

    raf = requestAnimationFrame(tick)

    window.addEventListener('wheel', pauseFromUser, { passive: true })
    window.addEventListener('touchmove', pauseFromUser, { passive: true })
    window.addEventListener('keydown', pauseFromUser, { passive: true })
    window.addEventListener(USER_SCROLL_INTENT_EVENT, pauseFromUser)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('wheel', pauseFromUser)
      window.removeEventListener('touchmove', pauseFromUser)
      window.removeEventListener('keydown', pauseFromUser)
      window.removeEventListener(USER_SCROLL_INTENT_EVENT, pauseFromUser)
    }
  }, [enabled])
}
