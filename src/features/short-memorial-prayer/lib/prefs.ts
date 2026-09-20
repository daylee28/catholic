// Spec: docs/spec/features/short-memorial-prayer/short-memorial-prayer.md
// AppPrefs localStorage

import { isPrayerId } from '../data/catalog'
import {
  FONT_SIZE_DEFAULT,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  type AfterLitanyId,
  type AppPrefs,
  type ReadingId,
  type SituationId,
} from '../types'

const STORAGE_KEY = 'short-memorial-prayer-prefs'

const DEFAULT_PREFS: AppPrefs = {
  prayerId: 'short',
  deceasedName: '',
  fontSizePx: FONT_SIZE_DEFAULT,
  situationId: 'anniversary',
  readingId: 'job',
  litanyOn: true,
  afterLitanyId: 'visitor',
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

function isReadingId(value: unknown): value is ReadingId {
  return value === 'job' || value === 'romans' || value === 'john'
}

function isAfterLitanyId(value: unknown): value is AfterLitanyId {
  return value === 'visitor' || value === 'child' || value === 'friend'
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
      prayerId: isPrayerId(parsed.prayerId) ? parsed.prayerId : 'short',
      deceasedName:
        typeof parsed.deceasedName === 'string' ? parsed.deceasedName : '',
      fontSizePx:
        typeof parsed.fontSizePx === 'number'
          ? clampFont(parsed.fontSizePx)
          : FONT_SIZE_DEFAULT,
      situationId: isSituationId(parsed.situationId)
        ? parsed.situationId
        : 'anniversary',
      readingId: isReadingId(parsed.readingId) ? parsed.readingId : 'job',
      litanyOn:
        typeof parsed.litanyOn === 'boolean' ? parsed.litanyOn : true,
      afterLitanyId: isAfterLitanyId(parsed.afterLitanyId)
        ? parsed.afterLitanyId
        : 'visitor',
      wakeLockOn: Boolean(parsed.wakeLockOn),
    }
  } catch {
    return { ...DEFAULT_PREFS }
  }
}

export function savePrefs(prefs: AppPrefs): void {
  const next: AppPrefs = {
    prayerId: prefs.prayerId,
    deceasedName: prefs.deceasedName,
    fontSizePx: clampFont(prefs.fontSizePx),
    situationId: prefs.situationId,
    readingId: prefs.readingId,
    litanyOn: prefs.litanyOn,
    afterLitanyId: prefs.afterLitanyId,
    wakeLockOn: prefs.wakeLockOn,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export { DEFAULT_PREFS, clampFont }
