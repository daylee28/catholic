// Spec: docs/spec/features/short-memorial-prayer/short-memorial-prayer.md
// FR-1: 짧은 위령기도 정적 본문
// 출처: 가톨릭 기도서 / 굿뉴스 위령기도 2(짧은 위령 기도)

import type { PrayerDocument } from '../types'

export const shortMemorialPrayer: PrayerDocument = {
  id: 'short',
  shortTitle: '짧은 위령기도',
  title: '위령기도 2 (짧은 위령 기도)',
  sourceUrl: 'https://app.catholic.or.kr/web/prayer/?flag=7&ingId=69',
  sourceLabel: '가톨릭 굿뉴스 위령기도 2(짧은 위령 기도)',
  hasShortSituations: true,
  sections: [
    {
      id: 'intro',
      type: 'intro',
      lines: [
        {
          role: 'none',
          rawText:
            "상황에 따라 '짧은 위령 기도'를 바치고자 할 때에는 이 양식에 따라 '위령 기도'를 바친다.",
        },
      ],
    },
    {
      id: 'sign',
      type: 'sign',
      title: '성호경',
      lines: [
        { role: 'leader', rawText: '성부와 성자와 성령의 이름으로.' },
        { role: 'all', rawText: '아멘.' },
      ],
    },
    {
      id: 'opening-prayer',
      type: 'prayer',
      title: '본기도',
      lines: [
        {
          role: 'leader',
          rawText:
            '지극히 어지신 하느님 아버지, 저희는 그리스도를 믿으며 살다가 이 세상을 떠난 모든 이가 그리스도와 함께 부활하리라 믿으며 {{name:eul}} 아버지 손에 맡겨 드리나이다.',
        },
        {
          role: 'odd',
          rawText:
            '{{name:iga}} 세상에 살아 있을 때에 무수한 은혜를 베푸시어 아버지의 사랑과 모든 성인의 통공을 드러내 보이셨으니 감사하나이다.',
        },
        {
          role: 'even',
          rawText:
            '하느님 아버지, 저희 기도를 자애로이 들으시어 {{name:none}}에게 천국 낙원의 문을 열어 주시고 남아 있는 저희는 그리스도 안에서 다시 만날 때까지 믿음의 말씀으로 서로 위로하며 살게 하소서. 우리 주 그리스도를 통하여 비나이다.',
        },
        { role: 'all', rawText: '아멘.' },
      ],
    },
    {
      id: 'psalm-130',
      type: 'psalm',
      title: '시편 129(130)',
      lines: [
        {
          role: 'odd',
          rawText: '깊은구렁 속에서 주님께 부르짖사오니 주님 제 소리를 들어주소서',
        },
        { role: 'even', rawText: '제가 비는 소리를 귀여겨 들으소서' },
        {
          role: 'odd',
          rawText: '주님께서 죄악을 헤아리신다면 주님 감당할 자 누구이리까',
        },
        {
          role: 'even',
          rawText:
            '오히려 용서하심이 주님께 있사와 더 더욱 당신을 섬기라 하시나이다',
        },
        {
          role: 'odd',
          rawText: '제 영혼이 주님을 기다리오며 당신의 말씀을 기다리나이다',
        },
        {
          role: 'even',
          rawText: '파수꾼이 새벽을 기다리기보다 제 영혼이 주님을 더 기다리나이다',
        },
        {
          role: 'odd',
          rawText:
            '파수꾼이 새벽을 기다리기보다 이스라엘이 주님을 더 기다리나이다',
        },
        {
          role: 'even',
          rawText: '주님께는 자비가 있사옵고 풍요로운 구속이 있음이오니',
        },
        {
          role: 'odd',
          rawText: '당신께서는 그 모든 죄악에서 이스라엘을 구속하시리이다',
        },
      ],
    },
    {
      id: 'rest-1',
      type: 'response',
      lines: [
        {
          role: 'leader',
          rawText: '주님 {{name:none}}에게 영원한 안식을 주소서',
        },
        { role: 'all', rawText: '영원한 빛을 그에게 비추소서' },
      ],
    },
    {
      id: 'psalm-51',
      type: 'psalm',
      title: '시편 50(51), 3-21',
      lines: [
        { role: 'odd', rawText: '하느님 자비 하시니 저를 불쌍히 여기소서' },
        { role: 'even', rawText: '애련함이 크오시니 저의 죄를 없이 하소서' },
        {
          role: 'odd',
          rawText: '제 잘못을 말끔히 씻어 주시고 제 허물을 깨끗이 없애주소서',
        },
        {
          role: 'even',
          rawText: '저는 저의 죄를 알고 있사 오며 저의 죄 항상 제 앞에 있삽나이다',
        },
        {
          role: 'odd',
          rawText:
            '당신께 오로지 당신께 죄를 얻었삽고 당신의 눈앞 에서 죄를 지었사오니',
        },
        {
          role: 'even',
          rawText: '판결 하심 공정 하고 심판에 휘지 않으심이 드러나리이다',
        },
        {
          role: 'odd',
          rawText: '보소서 저는 죄중에 생겨 났고 제 어머니가 죄 중에 저를 배었나이다',
        },
        {
          role: 'even',
          rawText:
            '당신께서는 마음의 진실을 반기시니 가슴깊이 슬기를 제게 가르치시나이다',
        },
        {
          role: 'odd',
          rawText: '정화수의 채로써 제게 뿌려 주소서 저는 곧 깨끗하여 지리이다',
        },
        { role: 'even', rawText: '저를 씻어 주소서 눈 보다 더 희어지리이다' },
        {
          role: 'odd',
          rawText: '기쁨과 즐거움을 돌려 주시어 바수어진 뼈들이 춤추게 하소서',
        },
        {
          role: 'even',
          rawText: '저의죄에서 당신 얼굴 돌이키시고 저의 모든 허물을 없애주소서',
        },
        {
          role: 'odd',
          rawText: '하느님 제 마음을 깨끗이 만드시고 제 안에 굳센 정신을 새로하소서',
        },
        {
          role: 'even',
          rawText:
            '당신의 면전에서 저를 내치지 마옵시고 당신의 거룩한 얼을 거두지 마옵소서',
        },
        {
          role: 'odd',
          rawText:
            '당신 구원 그 기쁨을 제게 도로 주시고 정성된 마음을 도로 굳혀주소서',
        },
        {
          role: 'even',
          rawText: '악인들에게 당신의 길을 가르치오리니 죄인들이 당신께 돌아오리이다',
        },
        {
          role: 'odd',
          rawText:
            '하느님 저를 구하시는 하느님 피흘린 죄벌에서 저를 구하소서',
        },
        { role: 'even', rawText: '제 혀가 당신 정의를 높이 일컬으오리다' },
        {
          role: 'odd',
          rawText: '주님 제 입시 울을 열어 주소서 제 입이 당신의 찬미 전하오리니',
        },
        {
          role: 'even',
          rawText:
            '제사는 당신께서 즐기지 않으시고 번제를 드리어도 받지 아니 하시리이다',
        },
        {
          role: 'odd',
          rawText:
            '하느님 저의 제사는 통회의 정신 하느님께서는 부서 지고 낮추인 마음을 낮추 아니 보시나이다',
        },
        {
          role: 'even',
          rawText: '주님 인자로이 시온을 돌보시고 예루살렘의 성을 다시 쌓아주소서',
        },
        {
          role: 'odd',
          rawText: '법 다운 제사와 제물과 번제를 그 때에 받으시리니',
        },
        {
          role: 'even',
          rawText: '그때에는 사람들이 송아지들을 당신 제단 위에 바치리이다',
        },
      ],
    },
    {
      id: 'rest-2',
      type: 'response',
      lines: [
        {
          role: 'leader',
          rawText: '주님 {{name:none}}에게 영원한 안식을 주소서',
        },
        { role: 'all', rawText: '영원한 빛을 그에게 비추소서' },
        { role: 'leader', rawText: '주님 저희의 기도를 들으소서' },
        {
          role: 'all',
          rawText: '또한 저희의 부르짖음이 주님께 이르게 하소서',
        },
        { role: 'leader', rawText: '주님께서 여러분과 함께.' },
        { role: 'all', rawText: '또한 사제의 영과 함께.' },
      ],
    },
    {
      id: 'situation-prompt',
      type: 'note',
      lines: [
        {
          role: 'none',
          rawText: '아래의 기도문 가운데 하나를 골라서 바친다.',
        },
      ],
    },
    {
      id: 'sit-funeral',
      type: 'situation',
      situationId: 'funeral',
      title: '1. 사망일부터 장례일까지',
      lines: [
        { role: 'leader', rawText: '기도합시다.' },
        {
          role: 'leader',
          rawText:
            '언제나 저희를 불쌍히 여기시어 너그러이 용서하시는 하느님, 오늘 이 세상을 떠난 {{name:eul}} 기억하시어 사탄의 손에 넘기지 마시고 거룩한 천사들에게 고향 낙원으로 데려가게 하소서. {{name:eun}} 세상에서 주님을 바라고 믿었사오니 지옥 벌을 면하고 영원한 기쁨을 얻게 하소서. 우리 주 그리스도를 통하여 비나이다.',
        },
        { role: 'all', rawText: '아멘.' },
      ],
    },
    {
      id: 'sit-mourning',
      type: 'situation',
      situationId: 'mourning',
      title: '2. 장례 후 탈상일까지',
      lines: [
        { role: 'leader', rawText: '기도합시다.' },
        {
          role: 'leader',
          rawText:
            '주님, 세상을 떠난 {{name:eul}} 생각하며 비오니 주님의 성인들과 뽑힌 이들 반열에 들어 주님의 영원한 기쁨을 누리게 하소서. 우리 주 그리스도를 통하여 비나이다.',
        },
        { role: 'all', rawText: '아멘.' },
      ],
    },
    {
      id: 'sit-anniversary',
      type: 'situation',
      situationId: 'anniversary',
      title: '3. 기일에는',
      lines: [
        { role: 'leader', rawText: '기도합시다.' },
        {
          role: 'leader',
          rawText:
            '너그러우신 주 하느님, {{name:none}}의 기일에 천국 영광을 바라보며 비오니 세상에 사는 저희가 주님의 말씀을 따라 살게 하소서. 우리 주 그리스도를 통하여 비나이다.',
        },
        { role: 'all', rawText: '아멘.' },
      ],
    },
    {
      id: 'sit-holiday',
      type: 'situation',
      situationId: 'holiday',
      title: '4. 설이나 한가위에는',
      lines: [
        { role: 'leader', rawText: '기도합시다.' },
        {
          role: 'leader',
          rawText:
            '주님, 세상을 떠난 조상들을 생각하며 비오니 그들이 주님의 성인들과 뽑힌 이들 반열에 들어 주님의 영원한 기쁨을 누리게 하소서. 우리 주 그리스도를 통하여 비나이다.',
        },
        { role: 'all', rawText: '아멘.' },
      ],
    },
    {
      id: 'our-father-note',
      type: 'note',
      lines: [
        {
          role: 'none',
          rawText:
            "모두 무릎을 꿇고 '주님의 기도', '성모송'을 각각 한 번씩 하고, 아래의 기도로 위령기도를 마친다.",
        },
      ],
    },
    {
      id: 'closing',
      type: 'closing',
      title: '마침 기도',
      lines: [
        {
          role: 'leader',
          rawText: '주님, {{name:none}}에게 영원한 안식을 주소서.',
        },
        { role: 'all', rawText: '영원한 빛을 그에게 비추소서.' },
        {
          role: 'leader',
          rawText:
            '{{name:gwa}} 세상을 떠난 모든 이가 하느님의 자비로 평화의 안식을 얻게 하소서.',
        },
        { role: 'all', rawText: '아멘.' },
      ],
    },
  ],
}
