// Spec: docs/spec/features/short-memorial-prayer/short-memorial-prayer.md
// FR-5

type WakeLockToggleProps = {
  supported: boolean
  enabled: boolean
  onChange: (on: boolean) => void
}

export function WakeLockToggle({
  supported,
  enabled,
  onChange,
}: WakeLockToggleProps) {
  if (!supported) return null

  return (
    <label className="wake-lock">
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>화면 켜짐 유지</span>
    </label>
  )
}
