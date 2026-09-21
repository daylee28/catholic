// Fixed bottom dock — always reachable while reading

import { SCROLL_SPEED_LABELS } from '../types'

const SPEEDS = [1, 2, 3, 4, 5] as const

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
            on ? 'scroll-dock__toggle scroll-dock__toggle--on' : 'scroll-dock__toggle'
          }
          aria-pressed={on}
          onClick={() => onToggle(!on)}
        >
          자동 스크롤 {on ? '켜짐' : '꺼짐'}
        </button>

        {on ? (
          <div className="scroll-dock__speed" role="group" aria-label="스크롤 속도">
            {SPEEDS.map((level) => (
              <button
                key={level}
                type="button"
                className={
                  speed === level
                    ? 'scroll-dock__chip scroll-dock__chip--active'
                    : 'scroll-dock__chip'
                }
                aria-pressed={speed === level}
                aria-label={SCROLL_SPEED_LABELS[level]}
                onClick={() => onSpeedChange(level)}
              >
                {level}
              </button>
            ))}
            <span className="scroll-dock__speed-text">
              {SCROLL_SPEED_LABELS[speed]}
            </span>
          </div>
        ) : (
          <p className="scroll-dock__hint">켜면 천천히 내려갑니다</p>
        )}
      </div>
    </div>
  )
}
