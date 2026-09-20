// Prayer catalog — add entries here when new prayers are added
import { longMemorialPrayer } from './long-prayer'
import { shortMemorialPrayer } from './short-prayer'
import type { PrayerCatalogItem, PrayerDocument, PrayerId } from '../types'

export const PRAYER_CATALOG: PrayerCatalogItem[] = [
  {
    id: 'short',
    shortTitle: '짧은 위령기도',
    description: '위령기도 2 · 짧게 바칠 때',
  },
  {
    id: 'long',
    shortTitle: '긴 위령기도',
    description: '위령기도 1 · 성인호칭·시편 포함',
  },
]

const BY_ID: Record<PrayerId, PrayerDocument> = {
  short: shortMemorialPrayer,
  long: longMemorialPrayer,
}

export function getPrayerDocument(id: PrayerId): PrayerDocument {
  return BY_ID[id] ?? shortMemorialPrayer
}

export function isPrayerId(value: unknown): value is PrayerId {
  return value === 'short' || value === 'long'
}
