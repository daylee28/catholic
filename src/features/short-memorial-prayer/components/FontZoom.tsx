// Spec: docs/spec/features/short-memorial-prayer/short-memorial-prayer.md
// FR-3

import { FONT_SIZE_MAX, FONT_SIZE_MIN } from '../types'

type FontZoomProps = {
  fontSizePx: number
  onChange: (size: number) => void
  step?: number
}

export function FontZoom({ fontSizePx, onChange, step = 2 }: FontZoomProps) {
  return (
    <div className="font-zoom" role="group" aria-label="글자 크기">
      <button
        type="button"
        className="font-zoom__btn"
        aria-label="글자 작게"
        disabled={fontSizePx <= FONT_SIZE_MIN}
        onClick={() => onChange(Math.max(FONT_SIZE_MIN, fontSizePx - step))}
      >
        A−
      </button>
      <span className="font-zoom__value" aria-live="polite">
        {fontSizePx}
      </span>
      <button
        type="button"
        className="font-zoom__btn"
        aria-label="글자 크게"
        disabled={fontSizePx >= FONT_SIZE_MAX}
        onClick={() => onChange(Math.min(FONT_SIZE_MAX, fontSizePx + step))}
      >
        A+
      </button>
    </div>
  )
}
