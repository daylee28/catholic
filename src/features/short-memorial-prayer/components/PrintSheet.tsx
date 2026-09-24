// Screen-hidden prayer sheet used only for print / Save as PDF

import { PrayerBody } from './PrayerBody'
import type {
  AfterLitanyId,
  PrayerDocument,
  ReadingId,
  SituationId,
} from '../types'

type Props = {
  prayer: PrayerDocument
  deceasedName: string
  situationId: SituationId
  readingId: ReadingId
  litanyOn: boolean
  afterLitanyId: AfterLitanyId
}

export function PrintSheet({
  prayer,
  deceasedName,
  situationId,
  readingId,
  litanyOn,
  afterLitanyId,
}: Props) {
  const name = deceasedName.trim()

  return (
    <article className="print-sheet" aria-hidden>
      <header className="print-sheet__header">
        <p className="print-sheet__eyebrow">천주교 위령기도</p>
        <h1 className="print-sheet__title">{prayer.title}</h1>
        {name ? (
          <p className="print-sheet__deceased">
            고인 <strong>{name}</strong>
          </p>
        ) : (
          <p className="print-sheet__deceased print-sheet__deceased--empty">
            고인 이름: ________________
          </p>
        )}
      </header>

      <PrayerBody
        sections={prayer.sections}
        deceasedName={deceasedName}
        situationId={situationId}
        readingId={readingId}
        litanyOn={litanyOn}
        afterLitanyId={afterLitanyId}
      />

      <footer className="print-sheet__footer">
        <p>
          출처: {prayer.sourceLabel}
          {prayer.sourceUrl ? ` (${prayer.sourceUrl})` : ''}
        </p>
        <p>가정·본당 기도 보조용 인쇄본입니다.</p>
      </footer>
    </article>
  )
}
