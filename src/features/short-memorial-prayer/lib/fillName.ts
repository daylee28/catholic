// Spec: docs/spec/features/short-memorial-prayer/short-memorial-prayer.md
// FR-2: 이름 토큰 치환

import { applyParticle, type ParticleRule } from './particles'

const TOKEN_RE = /\{\{name:(eul|iga|eun|gwa|none)\}\}/g

export type FilledPart =
  | { type: 'text'; text: string }
  | { type: 'name'; text: string; empty: boolean }

export function fillNameParts(rawText: string, deceasedName: string): FilledPart[] {
  const parts: FilledPart[] = []
  let lastIndex = 0
  const name = deceasedName.trim()

  for (const match of rawText.matchAll(TOKEN_RE)) {
    const index = match.index ?? 0
    if (index > lastIndex) {
      parts.push({ type: 'text', text: rawText.slice(lastIndex, index) })
    }
    const rule = match[1] as ParticleRule
    if (!name) {
      parts.push({ type: 'name', text: '　　', empty: true })
    } else {
      parts.push({ type: 'name', text: applyParticle(name, rule), empty: false })
    }
    lastIndex = index + match[0].length
  }

  if (lastIndex < rawText.length) {
    parts.push({ type: 'text', text: rawText.slice(lastIndex) })
  }

  if (parts.length === 0) {
    parts.push({ type: 'text', text: rawText })
  }

  return parts
}
