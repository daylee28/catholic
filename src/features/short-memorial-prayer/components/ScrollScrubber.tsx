// Overlay scrubber — only visible while the user is scrolling

import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'

const HIDE_AFTER_MS = 900

function getScrollMetrics() {
  const max = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  )
  const y = window.scrollY
  const ratio = max <= 0 ? 0 : Math.min(1, Math.max(0, y / max))
  return { max, ratio }
}

export function ScrollScrubber() {
  const trackRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const hideTimerRef = useRef(0)
  const [ratio, setRatio] = useState(0)
  const [needed, setNeeded] = useState(false)
  const [visible, setVisible] = useState(false)

  const refresh = useCallback(() => {
    const m = getScrollMetrics()
    setRatio(m.ratio)
    setNeeded(m.max > 40)
  }, [])

  const showBriefly = useCallback(() => {
    if (draggingRef.current) return
    setVisible(true)
    window.clearTimeout(hideTimerRef.current)
    hideTimerRef.current = window.setTimeout(() => {
      if (!draggingRef.current) setVisible(false)
    }, HIDE_AFTER_MS)
  }, [])

  useEffect(() => {
    refresh()

    const onScroll = () => {
      refresh()
      showBriefly()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', refresh)
    const ro = new ResizeObserver(refresh)
    ro.observe(document.documentElement)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', refresh)
      ro.disconnect()
      window.clearTimeout(hideTimerRef.current)
    }
  }, [refresh, showBriefly])

  const jumpToClientY = useCallback((clientY: number) => {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    const t = (clientY - rect.top) / rect.height
    const clamped = Math.min(1, Math.max(0, t))
    const max = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    )
    window.scrollTo({ top: clamped * max })
    setRatio(clamped)
  }, [])

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    draggingRef.current = true
    setVisible(true)
    window.clearTimeout(hideTimerRef.current)
    e.currentTarget.setPointerCapture(e.pointerId)
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
    window.clearTimeout(hideTimerRef.current)
    hideTimerRef.current = window.setTimeout(() => {
      setVisible(false)
    }, HIDE_AFTER_MS)
  }

  if (!needed) return null

  return (
    <div
      className={
        visible
          ? 'scroll-scrubber scroll-scrubber--visible'
          : 'scroll-scrubber'
      }
      aria-hidden={!visible}
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
        <div
          className="scroll-scrubber__fill"
          style={{ height: `${ratio * 100}%` }}
        />
        <div
          className="scroll-scrubber__thumb"
          style={{ top: `${ratio * 100}%` }}
        />
      </div>
    </div>
  )
}
