// Shared reading scroll root (not window) — avoids mobile chrome jump-to-top.

let scrollRoot: HTMLElement | null = null

export function setScrollRoot(el: HTMLElement | null) {
  scrollRoot = el
}

export function getScrollRoot(): HTMLElement {
  return scrollRoot ?? document.documentElement
}

export function getMaxScroll(): number {
  const el = getScrollRoot()
  return Math.max(0, el.scrollHeight - el.clientHeight)
}

export function getScrollTop(): number {
  return getScrollRoot().scrollTop
}

export function setScrollTop(top: number) {
  const el = getScrollRoot()
  const max = Math.max(0, el.scrollHeight - el.clientHeight)
  el.scrollTop = Math.min(max, Math.max(0, top))
}

export function scrollByY(delta: number) {
  setScrollTop(getScrollTop() + delta)
}
