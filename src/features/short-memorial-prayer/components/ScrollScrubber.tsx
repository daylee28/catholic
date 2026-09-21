// Right scrubber — show only while scrolling/dragging; wide hit when visible.

import { useEffect, useRef, useState, type PointerEvent } from 'react'
import {
  getMaxScroll,
  getScrollRoot,
  getScrollTop,
  setScrollTop,
} from '../lib/scrollRoot'
import {
  notifyUserScrollIntent,
  setScrubberDragLock,
} from '../lib/useAutoScroll'

const HIDE_AFTER_MS = 1200
/** Ignore single-frame finger deltas larger than this (px) — usually a coord glitch */
const MAX_FRAME_DY = 48

type Props = {
  autoScrollOn?: boolean
}

export function ScrollScrubber({ autoScrollOn = false }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const lastClientYRef = useRef(0)
  const scrollAtDragRef = useRef(0)
  const lockedMaxRef = useRef(0)
  const lockedTravelRef = useRef(1)
  const hideTimerRef = useRef(0)
  const autoScrollOnRef = useRef(autoScrollOn)
  const [needed, setNeeded] = useState(false)

  autoScrollOnRef.current = autoScrollOn

  function paint(ratio: number) {
    const track = trackRef.current
    const fill = fillRef.current
    const thumb = thumbRef.current
    if (!track || !fill || !thumb) return

    const trackH = track.clientHeight
    const thumbH = thumb.offsetHeight || 24
    const travel = Math.max(0, trackH - thumbH)
    const y = ratio * travel

    fill.style.height = `${Math.max(thumbH / 2, y + thumbH / 2)}px`
    thumb.style.top = `${y}px`
  }

  function setVisible(on: boolean) {
    rootRef.current?.classList.toggle('scroll-scrubber--visible', on)
  }

  function setActive(on: boolean) {
    rootRef.current?.classList.toggle('scroll-scrubber--active', on)
  }

  function showBriefly() {
    if (draggingRef.current) return
    setVisible(true)
    window.clearTimeout(hideTimerRef.current)
    hideTimerRef.current = window.setTimeout(() => {
      if (!draggingRef.current) setVisible(false)
    }, HIDE_AFTER_MS)
  }

  function applyDrag(clientY: number) {
    let dy = clientY - lastClientYRef.current
    lastClientYRef.current = clientY

    if (Math.abs(dy) > MAX_FRAME_DY) dy = 0

    const max = lockedMaxRef.current
    const travel = lockedTravelRef.current
    const next = Math.min(
      max,
      Math.max(0, scrollAtDragRef.current + (dy / travel) * max),
    )
    scrollAtDragRef.current = next
    setScrollTop(next)
    paint(max <= 0 ? 0 : next / max)
  }

  useEffect(() => {
    const sync = () => {
      const max = getMaxScroll()
      setNeeded(max > 40)
      if (!draggingRef.current) {
        paint(max <= 0 ? 0 : getScrollTop() / max)
      }
    }

    const onScroll = () => {
      if (draggingRef.current) return
      const max = getMaxScroll()
      paint(max <= 0 ? 0 : getScrollTop() / max)
      if (autoScrollOnRef.current) {
        setVisible(false)
        return
      }
      showBriefly()
    }

    const pane =
      (document.querySelector('.smp__scroll') as HTMLElement | null) ??
      getScrollRoot()
    sync()
    pane.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', sync)

    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(sync) : null
    ro?.observe(pane)

    return () => {
      pane.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', sync)
      ro?.disconnect()
      window.clearTimeout(hideTimerRef.current)
      setScrubberDragLock(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (autoScrollOn && !draggingRef.current) setVisible(false)
  }, [autoScrollOn])

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()

    const ae = document.activeElement
    if (ae instanceof HTMLElement && ae.closest('.smp__header')) {
      ae.blur()
    }

    const track = trackRef.current
    const thumb = thumbRef.current
    const thumbH = thumb?.offsetHeight || 24
    const travel = Math.max(1, (track?.clientHeight || 1) - thumbH)

    draggingRef.current = true
    lockedMaxRef.current = getMaxScroll()
    lockedTravelRef.current = travel
    scrollAtDragRef.current = getScrollTop()
    lastClientYRef.current = e.clientY

    setScrubberDragLock(true)
    notifyUserScrollIntent()
    window.clearTimeout(hideTimerRef.current)
    setVisible(true)
    setActive(true)
    e.currentTarget.setPointerCapture(e.pointerId)

    const max = lockedMaxRef.current
    paint(max <= 0 ? 0 : scrollAtDragRef.current / max)
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return
    e.preventDefault()
    applyDrag(e.clientY)
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return
    draggingRef.current = false
    setScrubberDragLock(false)
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    setActive(false)
    const max = getMaxScroll()
    paint(max <= 0 ? 0 : getScrollTop() / max)
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
      role="scrollbar"
      aria-orientation="vertical"
      aria-label="읽기 위치"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div ref={trackRef} className="scroll-scrubber__track">
        <div ref={fillRef} className="scroll-scrubber__fill" />
        <div ref={thumbRef} className="scroll-scrubber__thumb" />
      </div>
    </div>
  )
}
