// Reading helpers: auto-scroll + wake lock — large, simple controls

import { SCROLL_SPEED_LABELS } from '../types'

const SPEEDS = [1, 2, 3, 4, 5] as const

type ReadingAidsProps = {
  autoScrollOn: boolean
  autoScrollSpeed: number
  onAutoScrollChange: (on: boolean) => void
  onSpeedChange: (speed: number) => void
  wakeSupported: boolean
  wakeLockOn: boolean
  onWakeLockChange: (on: boolean) => void
}

export function ReadingAids({
  autoScrollOn,
  autoScrollSpeed,
  onAutoScrollChange,
  onSpeedChange,
  wakeSupported,
  wakeLockOn,
  onWakeLockChange,
}: ReadingAidsProps) {
  return (
    <section className="reading-aids" aria-label="읽기 도우미">
      <div className="reading-aids__row">
        <button
          type="button"
          className={
            autoScrollOn
              ? 'reading-aids__main reading-aids__main--on'
              : 'reading-aids__main'
          }
          aria-pressed={autoScrollOn}
          onClick={() => onAutoScrollChange(!autoScrollOn)}
        >
          자동 스크롤 {autoScrollOn ? '켜짐' : '꺼짐'}
        </button>
      </div>

      {autoScrollOn ? (
        <div className="reading-aids__speed" role="group" aria-label="스크롤 속도">
          <span className="reading-aids__speed-label">속도</span>
          {SPEEDS.map((level) => (
            <button
              key={level}
              type="button"
              className={
                autoScrollSpeed === level
                  ? 'reading-aids__chip reading-aids__chip--active'
                  : 'reading-aids__chip'
              }
              aria-pressed={autoScrollSpeed === level}
              onClick={() => onSpeedChange(level)}
            >
              {SCROLL_SPEED_LABELS[level]}
            </button>
          ))}
        </div>
      ) : null}

      <p className="reading-aids__hint">
        손으로 스크롤하면 잠시 멈춘 뒤 다시 이어집니다.
      </p>

      {wakeSupported ? (
        <label className="reading-aids__wake">
          <input
            type="checkbox"
            checked={wakeLockOn}
            onChange={(e) => onWakeLockChange(e.target.checked)}
          />
          <span>화면 켜짐 유지</span>
        </label>
      ) : null}
    </section>
  )
}
