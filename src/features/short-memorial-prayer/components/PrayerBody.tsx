// Spec: docs/spec/features/short-memorial-prayer/short-memorial-prayer.md
// FR-1, FR-2 — body + clickable 주님의 기도 / 성모송

import { fillNameParts } from '../lib/fillName'
import {
  splitKnownPrayerLabels,
  type KnownPrayerId,
} from '../data/known-prayers'
import type {
  AfterLitanyId,
  LineRole,
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

function TextWithKnownPrayerLinks({
  text,
  onOpenKnownPrayer,
}: {
  text: string
  onOpenKnownPrayer?: (id: KnownPrayerId) => void
}) {
  const chunks = splitKnownPrayerLabels(text)
  return (
    <>
      {chunks.map((chunk, i) =>
        chunk.type === 'prayer' && onOpenKnownPrayer ? (
          <button
            key={i}
            type="button"
            className="known-prayer-link"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onOpenKnownPrayer(chunk.id)
            }}
          >
            {chunk.label}
          </button>
        ) : chunk.type === 'prayer' ? (
          <span key={i}>{chunk.label}</span>
        ) : (
          <span key={i}>{chunk.text}</span>
        ),
      )}
    </>
  )
}

function PrayerLineView({
  line,
  deceasedName,
  onOpenKnownPrayer,
}: {
  line: PrayerLine
  deceasedName: string
  onOpenKnownPrayer?: (id: KnownPrayerId) => void
}) {
  const parts = fillNameParts(line.rawText, deceasedName)
  const mark = ROLE_MARK[line.role]
  const linkify =
    Boolean(onOpenKnownPrayer) &&
    (line.rawText.includes('주님의 기도') || line.rawText.includes('성모송'))

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
          ) : linkify ? (
            <TextWithKnownPrayerLinks
              key={i}
              text={part.text}
              onOpenKnownPrayer={onOpenKnownPrayer}
            />
          ) : (
            <span key={i}>{part.text}</span>
          ),
        )}
      </span>
    </p>
  )
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

type PrayerBodyProps = {
  sections: PrayerSection[]
  deceasedName: string
  situationId: SituationId
  readingId: ReadingId
  litanyOn: boolean
  afterLitanyId: AfterLitanyId
  onOpenKnownPrayer?: (id: KnownPrayerId) => void
}

export function PrayerBody({
  sections,
  deceasedName,
  situationId,
  readingId,
  litanyOn,
  afterLitanyId,
  onOpenKnownPrayer,
}: PrayerBodyProps) {
  return (
    <div className="prayer-body">
      {sections.map((section) => {
        if (
          !shouldShowSection(section, {
            situationId,
            readingId,
            litanyOn,
            afterLitanyId,
          })
        ) {
          return null
        }

        const titleIsKnown =
          section.title === '주님의 기도' || section.title === '성모송'

        return (
          <section
            key={section.id}
            className={`prayer-section prayer-section--${section.type}`}
            aria-label={section.title}
          >
            {section.title ? (
              titleIsKnown && onOpenKnownPrayer ? (
                <h2 className="prayer-section__title">
                  <button
                    type="button"
                    className="known-prayer-link known-prayer-link--title"
                    onClick={() =>
                      onOpenKnownPrayer(
                        section.title === '성모송'
                          ? 'hail-mary'
                          : 'lords-prayer',
                      )
                    }
                  >
                    {section.title}
                    <span className="known-prayer-link__hint">보기</span>
                  </button>
                </h2>
              ) : (
                <h2 className="prayer-section__title">{section.title}</h2>
              )
            ) : null}
            {section.lines.map((line, idx) => (
              <PrayerLineView
                key={`${section.id}-${idx}`}
                line={line}
                deceasedName={deceasedName}
                onOpenKnownPrayer={onOpenKnownPrayer}
              />
            ))}
          </section>
        )
      })}
    </div>
  )
}
