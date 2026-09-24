// Screen-hidden prayer sheet used only for print / Save as PDF

import { fillNameParts } from '../lib/fillName'
import { KNOWN_PRAYERS } from '../data/known-prayers'
import type { PrintKnownOptions } from './PrintOptionsDialog'
import type {
  AfterLitanyId,
  LineRole,
  PrayerDocument,
  PrayerLine,
  PrayerSection,
  ReadingId,
  SituationId,
} from '../types'

const ROLE_MARK: Record<LineRole, string> = {
  leader: '╋',
  all: '◎',
  odd: '○',
  even: '●',
  none: '',
}

function shouldShowSection(
  section: PrayerSection,
  opts: {
    situationId: SituationId
    readingId: ReadingId
    litanyOn: boolean
    afterLitanyId: AfterLitanyId
  },
): boolean {
  if (section.type === 'situation' && section.situationId) {
    return section.situationId === opts.situationId
  }
  if (section.variantGroup === 'reading') {
    return section.variantId === opts.readingId
  }
  if (section.variantGroup === 'litany') {
    return opts.litanyOn
  }
  if (section.variantGroup === 'afterLitany') {
    return section.variantId === opts.afterLitanyId
  }
  return true
}

function isInlineLordsPrayerLine(line: PrayerLine): boolean {
  return (
    line.role === 'all' && line.rawText.includes('하늘에 계신 우리 아버지')
  )
}

function isInsertPoint(section: PrayerSection): boolean {
  return section.id === 'our-father-note' || section.id === 'our-father'
}

function PrintLine({
  line,
  deceasedName,
}: {
  line: PrayerLine
  deceasedName: string
}) {
  const parts = fillNameParts(line.rawText, deceasedName)
  const mark = ROLE_MARK[line.role]
  return (
    <p className={`prayer-line prayer-line--${line.role}`}>
      {mark ? <span className="prayer-line__mark">{mark}</span> : null}
      <span className="prayer-line__text">
        {parts.map((part, i) =>
          part.type === 'name' ? (
            <span
              key={i}
              className={
                part.empty ? 'prayer-name prayer-name--empty' : 'prayer-name'
              }
            >
              {part.text}
            </span>
          ) : (
            <span key={i}>{part.text}</span>
          ),
        )}
      </span>
    </p>
  )
}

function KnownPrayerBoxes({ options }: { options: PrintKnownOptions }) {
  const ids = [
    options.includeLordsPrayer ? ('lords-prayer' as const) : null,
    options.includeHailMary ? ('hail-mary' as const) : null,
  ].filter(Boolean) as Array<'lords-prayer' | 'hail-mary'>

  if (ids.length === 0) return null

  return (
    <div className="print-known-block">
      {ids.map((id) => {
        const prayer = KNOWN_PRAYERS[id]
        return (
          <div key={id} className="print-known-box">
            <h3 className="print-known-box__title">{prayer.title}</h3>
            {prayer.note ? (
              <p className="print-known-box__note">{prayer.note}</p>
            ) : null}
            <div className="print-known-box__body">
              {prayer.lines.map((line, i) =>
                line === '' ? (
                  <div key={i} className="print-known-box__gap" />
                ) : (
                  <p key={i} className="print-known-box__line">
                    {line}
                  </p>
                ),
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

type Props = {
  prayer: PrayerDocument
  deceasedName: string
  situationId: SituationId
  readingId: ReadingId
  litanyOn: boolean
  afterLitanyId: AfterLitanyId
  knownOptions: PrintKnownOptions
}

export function PrintSheet({
  prayer,
  deceasedName,
  situationId,
  readingId,
  litanyOn,
  afterLitanyId,
  knownOptions,
}: Props) {
  const name = deceasedName.trim()
  const opts = { situationId, readingId, litanyOn, afterLitanyId }
  let inserted = false

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

      <div className="print-sheet__body">
        {prayer.sections.map((section) => {
          if (!shouldShowSection(section, opts)) return null

          const skipInlineLords =
            knownOptions.includeLordsPrayer && section.id === 'our-father'

          const node = (
            <section
              key={section.id}
              className={`prayer-section prayer-section--${section.type}`}
            >
              {section.title ? (
                <h2 className="prayer-section__title">{section.title}</h2>
              ) : null}
              {section.lines.map((line, idx) => {
                if (skipInlineLords && isInlineLordsPrayerLine(line)) {
                  return null
                }
                return (
                  <PrintLine
                    key={`${section.id}-${idx}`}
                    line={line}
                    deceasedName={deceasedName}
                  />
                )
              })}
              {isInsertPoint(section) ? (
                <KnownPrayerBoxes options={knownOptions} />
              ) : null}
            </section>
          )

          if (isInsertPoint(section)) inserted = true
          return node
        })}

        {!inserted ? <KnownPrayerBoxes options={knownOptions} /> : null}
      </div>

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
