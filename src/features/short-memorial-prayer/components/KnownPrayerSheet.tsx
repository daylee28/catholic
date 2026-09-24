// Floating sheet: 주님의 기도 / 성모송 — pauses auto-scroll while open

import { useEffect } from 'react'
import {
  KNOWN_PRAYERS,
  type KnownPrayerId,
} from '../data/known-prayers'
import { setOverlayPauseLock } from '../lib/useAutoScroll'

type Props = {
  prayerId: KnownPrayerId | null
  onClose: () => void
  onSwitch?: (id: KnownPrayerId) => void
  /** Which prayers to offer as tabs (default: both) */
  tabs?: KnownPrayerId[]
}

export function KnownPrayerSheet({
  prayerId,
  onClose,
  onSwitch,
  tabs = ['lords-prayer', 'hail-mary'],
}: Props) {
  useEffect(() => {
    if (!prayerId) {
      setOverlayPauseLock(false)
      return
    }
    setOverlayPauseLock(true)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      setOverlayPauseLock(false)
    }
  }, [prayerId, onClose])

  if (!prayerId) return null

  const prayer = KNOWN_PRAYERS[prayerId]

  return (
    <div className="known-prayer-sheet" role="dialog" aria-modal aria-label={prayer.title}>
      <button
        type="button"
        className="known-prayer-sheet__backdrop"
        aria-label="닫기"
        onClick={onClose}
      />
      <div className="known-prayer-sheet__panel">
        <div className="known-prayer-sheet__top">
          <div className="known-prayer-sheet__tabs" role="tablist">
            {tabs.map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={id === prayerId}
                className={
                  id === prayerId
                    ? 'known-prayer-sheet__tab known-prayer-sheet__tab--active'
                    : 'known-prayer-sheet__tab'
                }
                onClick={() => onSwitch?.(id)}
              >
                {KNOWN_PRAYERS[id].title}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="known-prayer-sheet__close"
            onClick={onClose}
          >
            닫기
          </button>
        </div>

        <h2 className="known-prayer-sheet__title">{prayer.title}</h2>
        {prayer.note ? (
          <p className="known-prayer-sheet__note">{prayer.note}</p>
        ) : null}
        <div className="known-prayer-sheet__body">
          {prayer.lines.map((line, i) =>
            line === '' ? (
              <div key={i} className="known-prayer-sheet__gap" />
            ) : (
              <p key={i} className="known-prayer-sheet__line">
                {line}
              </p>
            ),
          )}
        </div>
      </div>
    </div>
  )
}
