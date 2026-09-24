// Spec: docs/spec/features/short-memorial-prayer/short-memorial-prayer.md
// AppPrefs localStorage (device-local — survives revisit)

import { isPrayerId } from '../data/catalog'
import {
  AUTO_SCROLL_SPEED_DEFAULT,
  AUTO_SCROLL_SPEED_MAX,
  AUTO_SCROLL_SPEED_MIN,
  FONT_SIZE_DEFAULT,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  PREFS_VERSION,
  type AfterLitanyId,
  type AppPrefs,
  type ReadingId,
  type SituationId,
} from '../types'

const STORAGE_KEY = 'short-memorial-prayer-prefs'

/** Old discrete levels (1–5) → px/sec */
const LEGACY_LEVEL_PX: Record<number, number> = {
  1: 22,
  2: 40,
  3: 70,
  4: 90,
  5: 110,
}

const DEFAULT_PREFS: AppPrefs = {
  prayerId: 'short',
  deceasedName: '',
  fontSizePx: FONT_SIZE_DEFAULT,
  situationId: 'anniversary',
  readingId: 'job',
  litanyOn: true,
  afterLitanyId: 'visitor',
  wakeLockOn: false,
  autoScrollOn: false,
  autoScrollSpeed: AUTO_SCROLL_SPEED_DEFAULT,
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

export function clampSpeed(speed: number): number {
  if (!Number.isFinite(speed)) return AUTO_SCROLL_SPEED_DEFAULT
  return Math.min(
    AUTO_SCROLL_SPEED_MAX,
    Math.max(AUTO_SCROLL_SPEED_MIN, Math.round(speed)),
  )
}

function migrateSpeed(rawSpeed: number, prefsVersion: number): number {
  if (prefsVersion >= 2) return clampSpeed(rawSpeed)
  const level = Math.round(rawSpeed)
  if (level >= 1 && level <= 5 && LEGACY_LEVEL_PX[level] != null) {
    return LEGACY_LEVEL_PX[level]
  }
  return clampSpeed(rawSpeed)
}

type StoredPrefs = Partial<AppPrefs> & { prefsVersion?: number }

export function loadPrefs(): AppPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PREFS }
    const parsed = JSON.parse(raw) as StoredPrefs
    const version =
      typeof parsed.prefsVersion === 'number' ? parsed.prefsVersion : 1
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
      autoScrollOn: Boolean(parsed.autoScrollOn),
      autoScrollSpeed:
        typeof parsed.autoScrollSpeed === 'number'
          ? migrateSpeed(parsed.autoScrollSpeed, version)
          : AUTO_SCROLL_SPEED_DEFAULT,
    }
  } catch {
    return { ...DEFAULT_PREFS }
  }
}

export function savePrefs(prefs: AppPrefs): void {
  const next = {
    prefsVersion: PREFS_VERSION,
    prayerId: prefs.prayerId,
    deceasedName: prefs.deceasedName,
    fontSizePx: clampFont(prefs.fontSizePx),
    situationId: prefs.situationId,
    readingId: prefs.readingId,
    litanyOn: prefs.litanyOn,
    afterLitanyId: prefs.afterLitanyId,
    wakeLockOn: prefs.wakeLockOn,
    autoScrollOn: prefs.autoScrollOn,
    autoScrollSpeed: clampSpeed(prefs.autoScrollSpeed),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export { DEFAULT_PREFS, clampFont }
