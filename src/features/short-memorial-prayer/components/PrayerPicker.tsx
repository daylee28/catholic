// Spec: docs/spec/features/short-memorial-prayer/short-memorial-prayer.md
// 기도 선택 — compact sticky labels

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
          aria-label={item.shortTitle}
          title={item.description}
          className={
            value === item.id
              ? 'prayer-picker__btn prayer-picker__btn--active'
              : 'prayer-picker__btn'
          }
          onClick={() => onChange(item.id)}
        >
          {item.compactTitle}
        </button>
      ))}
    </div>
  )
}
