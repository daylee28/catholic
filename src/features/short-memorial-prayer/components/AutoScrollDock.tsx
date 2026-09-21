// Compact bottom dock — checkbox + speed slider on one thin row

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
        <label className="scroll-dock__check">
          <input
            type="checkbox"
            checked={on}
            onChange={(e) => onToggle(e.target.checked)}
          />
          <span>자동</span>
        </label>

        <input
          type="range"
          className="scroll-dock__range"
          min={1}
          max={5}
          step={1}
          value={speed}
          disabled={!on}
          aria-label={`스크롤 속도 ${SCROLL_SPEED_LABELS[speed]}`}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
        />

        <span
          className={
            on ? 'scroll-dock__speed-label' : 'scroll-dock__speed-label is-off'
          }
        >
          {on ? SCROLL_SPEED_LABELS[speed] : '꺼짐'}
        </span>
      </div>
    </div>
  )
}
