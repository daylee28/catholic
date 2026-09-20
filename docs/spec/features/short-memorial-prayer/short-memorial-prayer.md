# Feature: short-memorial-prayer

**동기화일**: 2026-09-16  
**기반 계획서**: [plan/PLAN-000001_init/plan.md](../../plan/PLAN-000001_init/plan.md)  
**참고 원문**: [가톨릭 굿뉴스 위령기도 2(짧은 위령 기도)](https://app.catholic.or.kr/web/prayer/?flag=7&ingId=69)

## 1. 개요
짧은 위령기도 전체를 한 화면 흐름으로 표시하고, 고인 이름·글자 크기·상황별 맺음 기도를 로컬에서 조절할 수 있게 한다.

## 2. 기능 요구사항 (FR)

### FR-1. 기도문 본문 표시
- 안내 → 성호경 → 본기도 → 시편 129(130) → 안식 응답 → 시편 50(51) → 응답·교환 → 상황별 맺음 → 주님의 기도·성모송 안내 → 마침 기도를 순서대로 표시한다.
- 역할 기호(╋ / ○ / ● / ◎)를 시각적으로 구분한다.
- 기도문은 앱 내 정적 데이터로 보유한다(외부 스크래핑 없음).
- 하단에 출처 링크를 작게 표기한다.

### FR-2. 고인 이름 입력·치환
- 고정 상단에 「고인 이름」입력칸을 둔다.
- 입력 시 `( )`, `(연령)`, `(망자)` 등 이름 자리를 동일 이름으로 채운다.
- 조사 자동 처리:
  - `를(을)` → 받침 유무에 따라 `을` / `를`
  - `가(이)` → `이` / `가`
  - `는(은)` → `은` / `는`
  - `과(와)` → `과` / `와` (마침 기도 「…과 세상을 떠난…」)
  - `에게` 등 불변 조사는 템플릿에 고정
- 본문 토큰: `{{name:eul|iga|eun|gwa|none}}`
- 이름 비어 있으면 빈칸을 밑줄/박스로 강조한다.
- 여러 명은 쉼표로 한 줄 입력 허용, 조사는 마지막 글자 기준.
- 최근 이름은 `localStorage`에 저장한다.

### FR-3. 글자 확대·축소
- 고정 컨트롤 `A−` / `A+`(또는 `−` / `+`).
- 기본 약 22px, 범위 16px~40px, 단계 조절.
- 선택 크기를 `localStorage`에 저장한다.
- 앱 내 본문 글자 크기만 변경한다.

### FR-4. 상황별 맺음 기도
- 선택지 4개: 사망일~장례 / 장례 후~탈상 / 기일 / 설·한가위.
- 선택 항목만 본문에 표시한다.
- 기본값: 기일.
- 선택을 `localStorage`에 저장한다.

### FR-5. 노인 친화 UI·접근성
- 높은 대비, 넉넉한 줄간격, 터치 영역 ≥ 44px.
- 모바일 우선 단열 레이아웃, 읽기 폭 제한, 가로 스크롤 없음.
- (지원 시) 화면 켜짐 유지(Wake Lock) 토글 제공.

## 3. 비기능 요구사항 (NFR)
- NFR-1: 정적 배포 가능 (Vite build).
- NFR-2: 개인정보(이름)는 기기 로컬만 사용.
- NFR-3: 한국어 UI만.
- NFR-4: 서버·로그인 없음.

## 4. 데이터 모델
### PrayerDocument
- `sections[]`: id, type(`intro`|`sign`|`prayer`|`psalm`|`response`|`situation`|`note`|`closing`), title?, lines[]
- `lines[]`: role(`leader`|`all`|`odd`|`even`|`priest`|`none`), rawText, placeholders[]
- 라인 `rawText` 내 토큰 `{{name:…}}`, particleRule(`eul`|`iga`|`eun`|`gwa`|`none`)

### AppPrefs (localStorage)
- `deceasedName: string`
- `fontSizePx: number`
- `situationId: 'funeral' | 'mourning' | 'anniversary' | 'holiday'`
- `wakeLockOn?: boolean`

## 5. UI 구조
1. 고정 상단바: 제목 · A−/A+ · 이름 입력 · (지원 시) 화면 켜짐 유지
2. 상황 선택 버튼 4개 (본문 상단)
3. 본문: 치환된 기도문(선택 상황의 맺음 기도만 표시)
4. 하단: 출처 링크

## 6. 구현 위치
- 앱 루트: 저장소 루트 Vite + React + TypeScript
- 페이지: `src/features/short-memorial-prayer/ShortMemorialPrayerPage.tsx`
- 컴포넌트: `src/features/short-memorial-prayer/components/`
- 유틸: `src/features/short-memorial-prayer/lib/`
- 기도문 데이터: `src/features/short-memorial-prayer/data/prayer.ts`

## 코드 구조 (동기화 2026-09-16)
```
src/features/short-memorial-prayer/
├── ShortMemorialPrayerPage.tsx
├── short-memorial-prayer.css
├── types.ts
├── components/   # NameInput, FontZoom, PrayerBody, SituationPicker, WakeLockToggle
├── data/prayer.ts
└── lib/          # particles, fillName, prefs, wakeLock
```

## 7. 테스트 관점
- 받침 있는/없는 이름으로 조사가 올바르게 바뀐다.
- 글자 크기·이름·상황이 새로고침 후에도 유지된다.
- 상황 전환 시 다른 맺음 기도가 보이지 않는다.
- 좁은 뷰포트에서 가로 스크롤이 없다.
