// Spec: docs/spec/features/short-memorial-prayer/short-memorial-prayer.md
// FR-2: 한글 조사 자동 처리

/** 마지막 글자에 받침(종성)이 있으면 true */
export function hasBatchim(text: string): boolean {
  const trimmed = text.trim()
  if (!trimmed) return false
  const last = trimmed[trimmed.length - 1]
  const code = last.charCodeAt(0)
  // Hangul syllables: AC00–D7A3
  if (code < 0xac00 || code > 0xd7a3) return false
  return (code - 0xac00) % 28 !== 0
}

/** 여러 명일 때 쉼표 구분 — 조사는 마지막 이름(마지막 글자) 기준 */
export function nameForParticle(fullName: string): string {
  const parts = fullName
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
  if (parts.length === 0) return ''
  return parts[parts.length - 1]
}

export function particleEul(name: string): string {
  return hasBatchim(nameForParticle(name)) ? '을' : '를'
}

export function particleIga(name: string): string {
  return hasBatchim(nameForParticle(name)) ? '이' : '가'
}

export function particleEun(name: string): string {
  return hasBatchim(nameForParticle(name)) ? '은' : '는'
}

export function particleGwa(name: string): string {
  return hasBatchim(nameForParticle(name)) ? '과' : '와'
}

export type ParticleRule = 'eul' | 'iga' | 'eun' | 'gwa' | 'none'

export function applyParticle(name: string, rule: ParticleRule): string {
  const display = name.trim() || ''
  if (!display) return ''
  switch (rule) {
    case 'eul':
      return display + particleEul(display)
    case 'iga':
      return display + particleIga(display)
    case 'eun':
      return display + particleEun(display)
    case 'gwa':
      return display + particleGwa(display)
    case 'none':
      return display
  }
}
