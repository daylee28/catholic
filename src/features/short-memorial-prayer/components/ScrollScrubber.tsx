// Overlay scrubber — show only on user wheel/touch; position via DOM (no React jitter)

import { useEffect, useRef, useState, type PointerEvent } from 'react'

const HIDE_AFTER_MS = 1000

function maxScrollY(): number {
  const el = document.documentElement
  return Math.max(0, el.scrollHeight - el.clientHeight)
}

function scrollRatio(): number {
  const max = maxScrollY()
  if (max <= 0) return 0
  const y = document.documentElement.scrollTop || window.scrollY
  return Math.min(1, Math.max(0, y / max))
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
  const dragOffsetRef = useRef(0)
  const hideTimerRef = useRef(0)
  const userInteractedUntilRef = useRef(0)
  const autoScrollOnRef = useRef(autoScrollOn)
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

    fill.style.height = `${y + thumbH / 2}px`
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

  function jumpToClientY(clientY: number) {
    const track = trackRef.current
    const thumb = thumbRef.current
    if (!track) return

    const rect = track.getBoundingClientRect()
    const thumbH = thumb?.offsetHeight || 14
    const travel = Math.max(1, rect.height - thumbH)
    const y = clientY - rect.top - dragOffsetRef.current
    const ratio = Math.min(1, Math.max(0, y / travel))
    const max = maxScrollY()
    // Instant scroll — avoid smooth scroll fighting the thumb
    document.documentElement.scrollTop = ratio * max
    paint(ratio)
  }

  useEffect(() => {
    const syncNeeded = () => {
      setNeeded(maxScrollY() > 40)
      if (!draggingRef.current) paint(scrollRatio())
    }

    syncNeeded()

    // Position follows scroll (incl. auto), but never overwrite thumb while dragging
    const onScroll = () => {
      if (draggingRef.current) return
      paint(scrollRatio())
      // Pure auto-scroll: keep scrubber hidden
      if (
        autoScrollOnRef.current &&
        Date.now() > userInteractedUntilRef.current
      ) {
        setVisible(false)
      }
    }

    // Visibility only from real user scroll input — not from `scroll` events
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // When auto-scroll turns on with no recent hand/wheel, force hide
  useEffect(() => {
    if (autoScrollOn && Date.now() > userInteractedUntilRef.current) {
      if (!draggingRef.current) setVisible(false)
    }
  }, [autoScrollOn])

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    draggingRef.current = true
    userInteractedUntilRef.current = Date.now() + HIDE_AFTER_MS
    setVisible(true)
    window.clearTimeout(hideTimerRef.current)
    e.currentTarget.setPointerCapture(e.pointerId)

    const thumb = thumbRef.current
    const thumbH = thumb?.offsetHeight || 14
    if (thumb) {
      const thumbRect = thumb.getBoundingClientRect()
      const onThumb =
        e.clientY >= thumbRect.top && e.clientY <= thumbRect.bottom
      // Grabbing the thumb: keep finger offset. Empty track: center under finger.
      dragOffsetRef.current = onThumb
        ? e.clientY - thumbRect.top
        : thumbH / 2
    } else {
      dragOffsetRef.current = thumbH / 2
    }

    jumpToClientY(e.clientY)
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return
    jumpToClientY(e.clientY)
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    draggingRef.current = false
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    // Sync once from settled scroll position
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
