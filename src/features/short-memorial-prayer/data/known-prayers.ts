// Common prayers referenced by memorial rites (for on-demand reading aid)

export type KnownPrayerId = 'lords-prayer' | 'hail-mary'

export type KnownPrayer = {
  id: KnownPrayerId
  title: string
  /** Display lines (reading-friendly breaks) */
  lines: string[]
  note?: string
}

export const KNOWN_PRAYERS: Record<KnownPrayerId, KnownPrayer> = {
  'lords-prayer': {
    id: 'lords-prayer',
    title: '주님의 기도',
    note: '위령기도에서는 끝에 「아멘」을 생략하고 마침 기도로 이어가기도 합니다.',
    lines: [
      '하늘에 계신 우리 아버지,',
      '아버지의 이름이 거룩히 빛나시며',
      '아버지의 나라가 오시며',
      '아버지의 뜻이 하늘에서와 같이',
      '땅에서도 이루어지소서!',
      '',
      '오늘 저희에게 일용할 양식을 주시고',
      '저희에게 잘못한 이를 저희가 용서하오니',
      '저희 죄를 용서하시고',
      '저희를 유혹에 빠지지 않게 하시고',
      '악에서 구하소서.',
      '아멘.',
    ],
  },
  'hail-mary': {
    id: 'hail-mary',
    title: '성모송',
    lines: [
      '은총이 가득하신 마리아님, 기뻐하소서!',
      '주님께서 함께 계시니 여인 중에 복되시며',
      '태중의 아들 예수님 또한 복되시나이다.',
      '천주의 성모 마리아님,',
      '이제와 저희 죽을 때에',
      '저희 죄인을 위하여 빌어주소서.',
      '아멘.',
    ],
  },
}

const LABEL_TO_ID: Record<string, KnownPrayerId> = {
  '주님의 기도': 'lords-prayer',
  성모송: 'hail-mary',
}

/** Split text so 「주님의 기도」/「성모송」 can become open buttons */
export function splitKnownPrayerLabels(text: string): Array<
  | { type: 'text'; text: string }
  | { type: 'prayer'; id: KnownPrayerId; label: string }
> {
  const re = /주님의 기도|성모송/g
  const parts: Array<
    | { type: 'text'; text: string }
    | { type: 'prayer'; id: KnownPrayerId; label: string }
  > = []
  let last = 0
  for (const match of text.matchAll(re)) {
    const index = match.index ?? 0
    if (index > last) {
      parts.push({ type: 'text', text: text.slice(last, index) })
    }
    const label = match[0]
    parts.push({ type: 'prayer', id: LABEL_TO_ID[label], label })
    last = index + label.length
  }
  if (last < text.length) {
    parts.push({ type: 'text', text: text.slice(last) })
  }
  if (parts.length === 0) {
    parts.push({ type: 'text', text })
  }
  return parts
}
