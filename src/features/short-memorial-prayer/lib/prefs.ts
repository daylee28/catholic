// Spec: docs/spec/features/short-memorial-prayer/short-memorial-prayer.md
// AppPrefs localStorage

import {
  FONT_SIZE_DEFAULT,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  type AppPrefs,
  type SituationId,
} from '../types'

const STORAGE_KEY = 'short-memorial-prayer-prefs'

const DEFAULT_PREFS: AppPrefs = {
  deceasedName: '',
  fontSizePx: FONT_SIZE_DEFAULT,
  situationId: 'anniversary',
  wakeLockOn: false,
}

function isSituationId(value: unknown): value is SituationId {
  return (
    value === 'funeral' ||
    value === 'mourning' ||
    value === 'anniversary' ||
    value === 'holiday'
  )
}

function clampFont(size: number): number {
  return Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, size))
}

export function loadPrefs(): AppPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PREFS }
    const parsed = JSON.parse(raw) as Partial<AppPrefs>
    return {
      deceasedName:
        typeof parsed.deceasedName === 'string' ? parsed.deceasedName : '',
      fontSizePx:
        typeof parsed.fontSizePx === 'number'
          ? clampFont(parsed.fontSizePx)
          : FONT_SIZE_DEFAULT,
      situationId: isSituationId(parsed.situationId)
        ? parsed.situationId
        : 'anniversary',
      wakeLockOn: Boolean(parsed.wakeLockOn),
    }
  } catch {
    return { ...DEFAULT_PREFS }
  }
}

export function savePrefs(prefs: AppPrefs): void {
  const next: AppPrefs = {
    deceasedName: prefs.deceasedName,
    fontSizePx: clampFont(prefs.fontSizePx),
    situationId: prefs.situationId,
    wakeLockOn: prefs.wakeLockOn,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export { DEFAULT_PREFS, clampFont }
