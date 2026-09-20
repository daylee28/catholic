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

export type SituationId = 'funeral' | 'mourning' | 'anniversary' | 'holiday'

export interface PrayerLine {
  role: LineRole
  /** Use {{name:eul|iga|eun|gwa|none}} tokens for deceased name slots */
  rawText: string
}

export interface PrayerSection {
  id: string
  type: SectionType
  title?: string
  situationId?: SituationId
  lines: PrayerLine[]
}

export interface PrayerDocument {
  title: string
  sourceUrl: string
  sections: PrayerSection[]
}

export interface AppPrefs {
  deceasedName: string
  fontSizePx: number
  situationId: SituationId
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
