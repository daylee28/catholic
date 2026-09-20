// Spec: docs/spec/features/short-memorial-prayer/short-memorial-prayer.md
// FR-1, FR-2

import { fillNameParts } from '../lib/fillName'
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

function PrayerLineView({
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
}

export function PrayerBody({
  sections,
  deceasedName,
  situationId,
  readingId,
  litanyOn,
  afterLitanyId,
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

        return (
          <section
            key={section.id}
            className={`prayer-section prayer-section--${section.type}`}
            aria-label={section.title}
          >
            {section.title ? (
              <h2 className="prayer-section__title">{section.title}</h2>
            ) : null}
            {section.lines.map((line, idx) => (
              <PrayerLineView
                key={`${section.id}-${idx}`}
                line={line}
                deceasedName={deceasedName}
              />
            ))}
          </section>
        )
      })}
    </div>
  )
}
