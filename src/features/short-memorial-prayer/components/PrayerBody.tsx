// Spec: docs/spec/features/short-memorial-prayer/short-memorial-prayer.md
// FR-1, FR-2

import { fillNameParts } from '../lib/fillName'
import type { LineRole, PrayerLine, PrayerSection, SituationId } from '../types'

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

type PrayerBodyProps = {
  sections: PrayerSection[]
  deceasedName: string
  situationId: SituationId
}

export function PrayerBody({
  sections,
  deceasedName,
  situationId,
}: PrayerBodyProps) {
  return (
    <div className="prayer-body">
      {sections.map((section) => {
        if (
          section.type === 'situation' &&
          section.situationId &&
          section.situationId !== situationId
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
