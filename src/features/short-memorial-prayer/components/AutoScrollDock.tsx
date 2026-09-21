// Compact bottom dock — checkbox + 느림/보통/빠름

import { SCROLL_SPEED_LEVELS, SCROLL_SPEED_LABELS } from '../types'

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
        <label className="scroll-dock__check">
          <input
            type="checkbox"
            checked={on}
            onChange={(e) => onToggle(e.target.checked)}
          />
          <span>자동</span>
        </label>

        <div
          className={on ? 'scroll-dock__speeds' : 'scroll-dock__speeds is-disabled'}
          role="group"
          aria-label="스크롤 속도"
        >
          {SCROLL_SPEED_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              disabled={!on}
              className={
                speed === level
                  ? 'scroll-dock__speed-btn scroll-dock__speed-btn--active'
                  : 'scroll-dock__speed-btn'
              }
              aria-pressed={speed === level}
              onClick={() => onSpeedChange(level)}
            >
              {SCROLL_SPEED_LABELS[level]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
