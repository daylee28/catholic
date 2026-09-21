// Overlay scrubber — relative drag (finger delta), not absolute track mapping.
// Absolute mapping jumped to top when fixed-bar rect shifted mid-scroll.

import { useEffect, useRef, useState, type PointerEvent } from 'react'
import {
  notifyUserScrollIntent,
  setScrubberDragLock,
} from '../lib/useAutoScroll'

const HIDE_AFTER_MS = 1000

function maxScrollY(): number {
  const el = document.documentElement
  return Math.max(0, el.scrollHeight - el.clientHeight)
}

function currentScrollY(): number {
  return window.scrollY || document.documentElement.scrollTop || 0
}

function scrollRatio(): number {
  const max = maxScrollY()
  if (max <= 0) return 0
  return Math.min(1, Math.max(0, currentScrollY() / max))
}

type Props = {
  autoScrollOn?: boolean
}

export function ScrollScrubber({ autoScrollOn = false }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const dragStartClientYRef = useRef(0)
  const dragStartScrollYRef = useRef(0)
  const hideTimerRef = useRef(0)
  const userInteractedUntilRef = useRef(0)
  const autoScrollOnRef = useRef(autoScrollOn)
  const pendingTopRef = useRef<number | null>(null)
  const scrollRafRef = useRef(0)
  const [needed, setNeeded] = useState(false)

  autoScrollOnRef.current = autoScrollOn

  function paint(ratio: number) {
    const track = trackRef.current
    const fill = fillRef.current
    const thumb = thumbRef.current
    if (!track || !fill || !thumb) return

    const trackH = track.clientHeight
    const thumbH = thumb.offsetHeight || 14
    const travel = Math.max(0, trackH - thumbH)
    const y = ratio * travel

    fill.style.height = `${Math.max(thumbH / 2, y + thumbH / 2)}px`
    thumb.style.top = `${y}px`
  }

  function setVisible(on: boolean) {
    rootRef.current?.classList.toggle('scroll-scrubber--visible', on)
  }

  function showBriefly() {
    if (draggingRef.current) return
    userInteractedUntilRef.current = Date.now() + HIDE_AFTER_MS
    setVisible(true)
    window.clearTimeout(hideTimerRef.current)
    hideTimerRef.current = window.setTimeout(() => {
      if (!draggingRef.current) setVisible(false)
    }, HIDE_AFTER_MS)
  }

  function flushScroll() {
    scrollRafRef.current = 0
    const top = pendingTopRef.current
    if (top === null) return
    pendingTopRef.current = null
    const el = document.scrollingElement || document.documentElement
    el.scrollTop = top
  }

  function scheduleScroll(top: number) {
    pendingTopRef.current = top
    if (!scrollRafRef.current) {
      scrollRafRef.current = requestAnimationFrame(flushScroll)
    }
  }

  /** Jump page + thumb to absolute track position (track click only). */
  function jumpAbsolute(clientY: number) {
    const track = trackRef.current
    const thumb = thumbRef.current
    if (!track) return

    const rect = track.getBoundingClientRect()
    const thumbH = thumb?.offsetHeight || 14
    const travel = Math.max(1, rect.height - thumbH)
    const y = clientY - rect.top - thumbH / 2
    const ratio = Math.min(1, Math.max(0, y / travel))
    const max = maxScrollY()
    const top = ratio * max

    paint(ratio)
    dragStartClientYRef.current = clientY
    dragStartScrollYRef.current = top
    scheduleScroll(top)
  }

  /** Move by finger delta from drag start — stable while chrome/layout shifts. */
  function dragRelative(clientY: number) {
    const track = trackRef.current
    const thumb = thumbRef.current
    if (!track) return

    const thumbH = thumb?.offsetHeight || 14
    const travel = Math.max(1, track.clientHeight - thumbH)
    const max = maxScrollY()
    const deltaRatio = (clientY - dragStartClientYRef.current) / travel
    const top = Math.min(
      max,
      Math.max(0, dragStartScrollYRef.current + deltaRatio * max),
    )
    const ratio = max <= 0 ? 0 : top / max

    paint(ratio)
    scheduleScroll(top)
  }

  useEffect(() => {
    const syncNeeded = () => {
      setNeeded(maxScrollY() > 40)
      if (!draggingRef.current) paint(scrollRatio())
    }

    syncNeeded()

    const onScroll = () => {
      if (draggingRef.current) return
      paint(scrollRatio())
      if (
        autoScrollOnRef.current &&
        Date.now() > userInteractedUntilRef.current
      ) {
        setVisible(false)
      }
    }

    const onUserIntent = () => {
      if (draggingRef.current) return
      paint(scrollRatio())
      showBriefly()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onUserIntent, { passive: true })
    window.addEventListener('touchmove', onUserIntent, { passive: true })
    window.addEventListener('resize', syncNeeded)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onUserIntent)
      window.removeEventListener('touchmove', onUserIntent)
      window.removeEventListener('resize', syncNeeded)
      window.clearTimeout(hideTimerRef.current)
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current)
      setScrubberDragLock(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (autoScrollOn && Date.now() > userInteractedUntilRef.current) {
      if (!draggingRef.current) setVisible(false)
    }
  }, [autoScrollOn])

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    e.preventDefault()
    draggingRef.current = true
    setScrubberDragLock(true)
    notifyUserScrollIntent()
    userInteractedUntilRef.current = Date.now() + HIDE_AFTER_MS
    setVisible(true)
    window.clearTimeout(hideTimerRef.current)
    e.currentTarget.setPointerCapture(e.pointerId)

    const thumb = thumbRef.current
    let onThumb = false
    if (thumb) {
      const thumbRect = thumb.getBoundingClientRect()
      onThumb =
        e.clientY >= thumbRect.top && e.clientY <= thumbRect.bottom
    }

    if (onThumb) {
      // Grab thumb: keep current scroll, move relatively from here
      dragStartClientYRef.current = e.clientY
      dragStartScrollYRef.current = currentScrollY()
      paint(scrollRatio())
    } else {
      // Empty track: jump once, then relative from that point
      jumpAbsolute(e.clientY)
    }
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return
    dragRelative(e.clientY)
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    draggingRef.current = false
    setScrubberDragLock(false)
    if (scrollRafRef.current) {
      cancelAnimationFrame(scrollRafRef.current)
      flushScroll()
    }
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    paint(scrollRatio())
    window.clearTimeout(hideTimerRef.current)
    hideTimerRef.current = window.setTimeout(() => {
      setVisible(false)
    }, HIDE_AFTER_MS)
  }

  if (!needed) return null

  return (
    <div
      ref={rootRef}
      className="scroll-scrubber"
      aria-hidden
      aria-label="읽기 위치"
    >
      <div
        ref={trackRef}
        className="scroll-scrubber__track"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div ref={fillRef} className="scroll-scrubber__fill" />
        <div ref={thumbRef} className="scroll-scrubber__thumb" />
      </div>
    </div>
  )
}
