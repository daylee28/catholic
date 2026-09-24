// Small confirm dialog before print / Save as PDF

export type PrintKnownOptions = {
  includeLordsPrayer: boolean
  includeHailMary: boolean
}

type Props = {
  open: boolean
  value: PrintKnownOptions
  onChange: (next: PrintKnownOptions) => void
  onCancel: () => void
  onConfirm: () => void
}

export function PrintOptionsDialog({
  open,
  value,
  onChange,
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null

  return (
    <div
      className="print-options no-print"
      role="dialog"
      aria-modal
      aria-label="인쇄 옵션"
    >
      <button
        type="button"
        className="print-options__backdrop"
        aria-label="취소"
        onClick={onCancel}
      />
      <div className="print-options__panel">
        <h2 className="print-options__title">PDF 인쇄</h2>
        <p className="print-options__desc">
          인쇄본에 아래 기도문을 넣을지 선택하세요.
        </p>
        <label className="print-options__check">
          <input
            type="checkbox"
            checked={value.includeLordsPrayer}
            onChange={(e) =>
              onChange({ ...value, includeLordsPrayer: e.target.checked })
            }
          />
          <span>주님의 기도</span>
        </label>
        <label className="print-options__check">
          <input
            type="checkbox"
            checked={value.includeHailMary}
            onChange={(e) =>
              onChange({ ...value, includeHailMary: e.target.checked })
            }
          />
          <span>성모송</span>
        </label>
        <div className="print-options__actions">
          <button
            type="button"
            className="print-options__btn print-options__btn--ghost"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            type="button"
            className="print-options__btn print-options__btn--primary"
            onClick={onConfirm}
          >
            인쇄
          </button>
        </div>
      </div>
    </div>
  )
}
