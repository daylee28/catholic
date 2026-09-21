// Fixed bottom dock — auto-scroll + speed slider

import { SCROLL_SPEED_LABELS } from '../types'

type AutoScrollDockProps = {
  on: boolean
  speed: number
  onToggle: (on: boolean) => void
  onSpeedChange: (speed: number) => void
}

export function AutoScrollDock({
  on,
  speed,
  onToggle,
  onSpeedChange,
}: AutoScrollDockProps) {
  return (
    <div className="scroll-dock" role="region" aria-label="자동 스크롤">
      <div className="scroll-dock__inner">
        <button
          type="button"
          className={
            on
              ? 'scroll-dock__toggle scroll-dock__toggle--on'
              : 'scroll-dock__toggle'
          }
          aria-pressed={on}
          onClick={() => onToggle(!on)}
        >
          자동 스크롤 {on ? '켜짐' : '꺼짐'}
        </button>

        {on ? (
          <label className="scroll-dock__slider">
            <span className="scroll-dock__slider-ends">
              <span>느림</span>
              <span className="scroll-dock__slider-value">
                {SCROLL_SPEED_LABELS[speed]}
              </span>
              <span>빠름</span>
            </span>
            <input
              type="range"
              className="scroll-dock__range"
              min={1}
              max={5}
              step={1}
              value={speed}
              aria-label="자동 스크롤 속도"
              onChange={(e) => onSpeedChange(Number(e.target.value))}
            />
          </label>
        ) : (
          <p className="scroll-dock__hint">
            켜면 천천히 내려갑니다 · 오른쪽 바로 위치 이동
          </p>
        )}
      </div>
    </div>
  )
}
