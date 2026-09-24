// Compact bottom dock — 자동 + speed slider + numeric input (one row)

import {
  AUTO_SCROLL_SPEED_MAX,
  AUTO_SCROLL_SPEED_MIN,
  AUTO_SCROLL_SPEED_STEP,
} from '../types'
import { clampSpeed } from '../lib/prefs'

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
  function setSpeed(next: number) {
    onSpeedChange(clampSpeed(next))
    if (!on && next > 0) onToggle(true)
  }

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

        <div className="scroll-dock__speed" role="group" aria-label="스크롤 속도">
          <span className="scroll-dock__speed-edge" aria-hidden>
            0
          </span>
          <input
            className="scroll-dock__slider"
            type="range"
            min={AUTO_SCROLL_SPEED_MIN}
            max={AUTO_SCROLL_SPEED_MAX}
            step={AUTO_SCROLL_SPEED_STEP}
            value={speed}
            aria-valuemin={AUTO_SCROLL_SPEED_MIN}
            aria-valuemax={AUTO_SCROLL_SPEED_MAX}
            aria-valuenow={speed}
            aria-label="스크롤 속도"
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
          <input
            className="scroll-dock__speed-num"
            type="number"
            inputMode="numeric"
            min={AUTO_SCROLL_SPEED_MIN}
            max={AUTO_SCROLL_SPEED_MAX}
            step={AUTO_SCROLL_SPEED_STEP}
            value={speed}
            aria-label="스크롤 속도 숫자"
            onChange={(e) => {
              const n = Number(e.target.value)
              if (Number.isFinite(n)) setSpeed(n)
            }}
            onBlur={(e) => {
              const n = Number(e.target.value)
              setSpeed(Number.isFinite(n) ? n : speed)
            }}
          />
          <span className="scroll-dock__speed-edge" aria-hidden>
            {AUTO_SCROLL_SPEED_MAX}
          </span>
        </div>
      </div>
    </div>
  )
}
