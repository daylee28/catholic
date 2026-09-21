// Right-edge scrubber: always visible, wide hit area, relative drag.
// Locks max-scroll at drag start so mobile chrome resize cannot bounce.

import { useEffect, useRef, useState, type PointerEvent } from 'react'
import {
  notifyUserScrollIntent,
  setScrubberDragLock,
} from '../lib/useAutoScroll'

function maxScrollY(): number {
  const el = document.documentElement
  return Math.max(0, el.scrollHeight - el.clientHeight)
}

function currentScrollY(): number {
  return window.scrollY || document.documentElement.scrollTop || 0
}

function scrollRatio(max: number): number {
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
  const lockedMaxRef = useRef(0)
  const pendingTopRef = useRef<number | null>(null)
  const scrollRafRef = useRef(0)
  const [needed, setNeeded] = useState(false)

  void autoScrollOn

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

  function setActive(on: boolean) {
    rootRef.current?.classList.toggle('scroll-scrubber--active', on)
  }

  function flushScroll() {
    scrollRafRef.current = 0
    const top = pendingTopRef.current
    if (top === null) return
    pendingTopRef.current = null
    window.scrollTo(0, top)
  }

  function scheduleScroll(top: number) {
    pendingTopRef.current = top
    if (!scrollRafRef.current) {
      scrollRafRef.current = requestAnimationFrame(flushScroll)
    }
  }

  function dragRelative(clientY: number) {
    const track = trackRef.current
    const thumb = thumbRef.current
    if (!track) return

    const thumbH = thumb?.offsetHeight || 24
    const travel = Math.max(1, track.clientHeight - thumbH)
    const max = lockedMaxRef.current
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
    const sync = () => {
      const max = maxScrollY()
      setNeeded(max > 40)
      if (!draggingRef.current) paint(scrollRatio(max))
    }

    sync()

    const onScroll = () => {
      if (draggingRef.current) return
      paint(scrollRatio(maxScrollY()))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', sync)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', sync)
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current)
      setScrubberDragLock(false)
      document.documentElement.classList.remove('smp--scrubbing')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    draggingRef.current = true
    lockedMaxRef.current = maxScrollY()
    setScrubberDragLock(true)
    notifyUserScrollIntent()
    setActive(true)
    document.documentElement.classList.add('smp--scrubbing')
    e.currentTarget.setPointerCapture(e.pointerId)

    dragStartClientYRef.current = e.clientY
    dragStartScrollYRef.current = currentScrollY()
    paint(scrollRatio(lockedMaxRef.current))
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return
    e.preventDefault()
    dragRelative(e.clientY)
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return
    draggingRef.current = false
    setScrubberDragLock(false)
    document.documentElement.classList.remove('smp--scrubbing')
    if (scrollRafRef.current) {
      cancelAnimationFrame(scrollRafRef.current)
      flushScroll()
    }
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    setActive(false)
    paint(scrollRatio(maxScrollY()))
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
