// Spec: docs/spec/features/short-memorial-prayer/short-memorial-prayer.md
// Plan: docs/plan/PLAN-000001_init/plan.md

export type ParticleRule = 'eul' | 'iga' | 'eun' | 'gwa' | 'none'

export type LineRole = 'leader' | 'all' | 'odd' | 'even' | 'none'

export type SectionType =
  | 'intro'
  | 'sign'
  | 'prayer'
  | 'psalm'
  | 'response'
  | 'situation'
  | 'note'
  | 'closing'
  | 'reading'
  | 'litany'

/** Catalog ids — add more prayers here later */
export type PrayerId = 'short' | 'long'

export type SituationId = 'funeral' | 'mourning' | 'anniversary' | 'holiday'

export type ReadingId = 'job' | 'romans' | 'john'

export type AfterLitanyId = 'visitor' | 'child' | 'friend'

export type VariantGroup = 'reading' | 'litany' | 'afterLitany' | 'shortSituation'

export interface PrayerLine {
  role: LineRole
  /** Use {{name:eul|iga|eun|gwa|none}} tokens for deceased name slots */
  rawText: string
}

export interface PrayerSection {
  id: string
  type: SectionType
  title?: string
  /** Short prayer: situation filter */
  situationId?: SituationId
  /** Long prayer (and future): optional variant filters */
  variantGroup?: VariantGroup
  variantId?: string
  lines: PrayerLine[]
}

export interface PrayerDocument {
  id: PrayerId
  /** Header / picker short label */
  shortTitle: string
  title: string
  sourceUrl: string
  sourceLabel: string
  /** Show short-prayer situation buttons */
  hasShortSituations?: boolean
  /** Show long-prayer option panel */
  hasLongOptions?: boolean
  sections: PrayerSection[]
}

export interface PrayerCatalogItem {
  id: PrayerId
  shortTitle: string
  description: string
}

export interface AppPrefs {
  prayerId: PrayerId
  deceasedName: string
  fontSizePx: number
  situationId: SituationId
  readingId: ReadingId
  litanyOn: boolean
  afterLitanyId: AfterLitanyId
  wakeLockOn: boolean
}

export const FONT_SIZE_MIN = 16
export const FONT_SIZE_MAX = 40
export const FONT_SIZE_DEFAULT = 22
export const FONT_SIZE_STEP = 2

export const SITUATION_LABELS: Record<SituationId, string> = {
  funeral: '사망일~장례',
  mourning: '장례 후~탈상',
  anniversary: '기일',
  holiday: '설·한가위',
}

export const READING_LABELS: Record<ReadingId, string> = {
  job: '욥기',
  romans: '로마서',
  john: '요한복음',
}

export const AFTER_LITANY_LABELS: Record<AfterLitanyId, string> = {
  visitor: '일반 문상',
  child: '자녀의 기도',
  friend: '친구의 기도',
}
