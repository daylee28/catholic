// Right-edge reading scrubber — drag to jump through long prayers

import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'

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
  const [ratio, setRatio] = useState(0)
  const [needed, setNeeded] = useState(false)

  const refresh = useCallback(() => {
    const m = getScrollMetrics()
    setRatio(m.ratio)
    setNeeded(m.max > 40)
  }, [])

  useEffect(() => {
    refresh()
    window.addEventListener('scroll', refresh, { passive: true })
    window.addEventListener('resize', refresh)
    const ro = new ResizeObserver(refresh)
    ro.observe(document.documentElement)
    return () => {
      window.removeEventListener('scroll', refresh)
      window.removeEventListener('resize', refresh)
      ro.disconnect()
    }
  }, [refresh])

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
  }

  if (!needed) return null

  return (
    <div
      className="scroll-scrubber"
      aria-label="읽기 위치"
      role="slider"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(ratio * 100)}
      tabIndex={0}
      onKeyDown={(e) => {
        const max = Math.max(
          0,
          document.documentElement.scrollHeight - window.innerHeight,
        )
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
          e.preventDefault()
          window.scrollBy({ top: window.innerHeight * 0.35 })
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          e.preventDefault()
          window.scrollBy({ top: -window.innerHeight * 0.35 })
        } else if (e.key === 'Home') {
          e.preventDefault()
          window.scrollTo({ top: 0 })
        } else if (e.key === 'End') {
          e.preventDefault()
          window.scrollTo({ top: max })
        }
      }}
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
      <span className="scroll-scrubber__label">위치</span>
    </div>
  )
}
