// Long prayer options — reading / litany / after-litany prayer

import {
  AFTER_LITANY_LABELS,
  READING_LABELS,
  type AfterLitanyId,
  type ReadingId,
} from '../types'

const READINGS: ReadingId[] = ['job', 'romans', 'john']
const AFTER: AfterLitanyId[] = ['visitor', 'child', 'friend']

type LongOptionsProps = {
  readingId: ReadingId
  litanyOn: boolean
  afterLitanyId: AfterLitanyId
  onReadingChange: (id: ReadingId) => void
  onLitanyChange: (on: boolean) => void
  onAfterChange: (id: AfterLitanyId) => void
}

export function LongOptions({
  readingId,
  litanyOn,
  afterLitanyId,
  onReadingChange,
  onLitanyChange,
  onAfterChange,
}: LongOptionsProps) {
  return (
    <div className="long-options">
      <p className="long-options__label">독서 선택</p>
      <div className="option-row" role="radiogroup" aria-label="독서">
        {READINGS.map((id) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={readingId === id}
            className={
              readingId === id
                ? 'option-row__btn option-row__btn--active'
                : 'option-row__btn'
            }
            onClick={() => onReadingChange(id)}
          >
            {READING_LABELS[id]}
          </button>
        ))}
      </div>

      <label className="long-options__toggle">
        <input
          type="checkbox"
          checked={litanyOn}
          onChange={(e) => onLitanyChange(e.target.checked)}
        />
        <span>성인 호칭 기도 포함</span>
      </label>

      <p className="long-options__label">호칭 기도 다음</p>
      <div className="option-row" role="radiogroup" aria-label="기도 선택">
        {AFTER.map((id) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={afterLitanyId === id}
            className={
              afterLitanyId === id
                ? 'option-row__btn option-row__btn--active'
                : 'option-row__btn'
            }
            onClick={() => onAfterChange(id)}
          >
            {AFTER_LITANY_LABELS[id]}
          </button>
        ))}
      </div>
    </div>
  )
}
