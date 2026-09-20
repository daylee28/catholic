// Spec: docs/spec/features/short-memorial-prayer/short-memorial-prayer.md
// 기도 선택 — 지금은 2개, 카탈로그만 늘리면 확장 가능

import { PRAYER_CATALOG } from '../data/catalog'
import type { PrayerId } from '../types'

type PrayerPickerProps = {
  value: PrayerId
  onChange: (id: PrayerId) => void
}

export function PrayerPicker({ value, onChange }: PrayerPickerProps) {
  return (
    <div className="prayer-picker" role="radiogroup" aria-label="기도 선택">
      {PRAYER_CATALOG.map((item) => (
        <button
          key={item.id}
          type="button"
          role="radio"
          aria-checked={value === item.id}
          className={
            value === item.id
              ? 'prayer-picker__btn prayer-picker__btn--active'
              : 'prayer-picker__btn'
          }
          onClick={() => onChange(item.id)}
        >
          <span className="prayer-picker__title">{item.shortTitle}</span>
          <span className="prayer-picker__desc">{item.description}</span>
        </button>
      ))}
    </div>
  )
}
