// Spec: docs/spec/features/short-memorial-prayer/short-memorial-prayer.md
// FR-2

type NameInputProps = {
  value: string
  onChange: (value: string) => void
}

export function NameInput({ value, onChange }: NameInputProps) {
  return (
    <label className="name-input">
      <span className="name-input__label">이름</span>
      <input
        className="name-input__field"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="고인 이름 (예: 김영희)"
        autoComplete="off"
        enterKeyHint="done"
        aria-label="고인 이름"
      />
    </label>
  )
}
