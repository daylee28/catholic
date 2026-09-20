// Spec: docs/spec/features/short-memorial-prayer/short-memorial-prayer.md
// FR-4

import { SITUATION_LABELS, type SituationId } from '../types'

const ORDER: SituationId[] = ['funeral', 'mourning', 'anniversary', 'holiday']

type SituationPickerProps = {
  value: SituationId
  onChange: (id: SituationId) => void
}

export function SituationPicker({ value, onChange }: SituationPickerProps) {
  return (
    <div className="situation-picker" role="radiogroup" aria-label="맺음 기도 상황">
      {ORDER.map((id) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={value === id}
          className={
            value === id
              ? 'situation-picker__btn situation-picker__btn--active'
              : 'situation-picker__btn'
          }
          onClick={() => onChange(id)}
        >
          {SITUATION_LABELS[id]}
        </button>
      ))}
    </div>
  )
}
