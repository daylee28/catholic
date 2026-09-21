// Optional setup helpers (scroll away with content)

type ReadingAidsProps = {
  wakeSupported: boolean
  wakeLockOn: boolean
  onWakeLockChange: (on: boolean) => void
}

export function ReadingAids({
  wakeSupported,
  wakeLockOn,
  onWakeLockChange,
}: ReadingAidsProps) {
  if (!wakeSupported) return null

  return (
    <section className="reading-aids" aria-label="화면 설정">
      <label className="reading-aids__wake">
        <input
          type="checkbox"
          checked={wakeLockOn}
          onChange={(e) => onWakeLockChange(e.target.checked)}
        />
        <span>화면 켜짐 유지</span>
      </label>
      <p className="reading-aids__hint">
        아래 □자동 으로 자동 스크롤을 켜고, 바로 옆 바로 속도를 조절할 수 있습니다.
        손으로 스크롤하면 잠시 멈춘 뒤 다시 이어집니다.
      </p>
    </section>
  )
}
