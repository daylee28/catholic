# Implementation Tasks - 짧은 위령기도 웹

**생성일**: 2026-09-16 02:02  
**Plan 파일**: `plan/PLAN-000001_init/plan.md`  
**Spec 파일**: `spec/features/short-memorial-prayer/short-memorial-prayer.md`

## 실행 가능한 Tasks (Quick Reference)

| Task ID | 한 줄 요약 | 상태 | 우선순위 | 의존성 | 예상 시간 |
|---------|-----------|------|----------|--------|-----------|
| `setup-vite` | Vite+React+TS 프로젝트 초기화 및 기본 레이아웃 | ✅ 완료 | High | - | 20분 |
| `data-prayer` | 짧은 위령기도 정적 데이터·플레이스홀더 구조화 | ✅ 완료 | High | setup-vite | 35분 |
| `impl-particles` | 한글 조사(을/를·이/가·은/는) 자동 처리 유틸 | ✅ 완료 | High | setup-vite | 25분 |
| `impl-name-fill` | 고인 이름 입력·본문 치환·빈칸 강조 | ✅ 완료 | High | data-prayer, impl-particles | 30분 |
| `impl-font-zoom` | A−/A+ 글자 크기 조절 및 localStorage 저장 | ✅ 완료 | High | setup-vite | 20분 |
| `impl-situation` | 상황별 맺음 기도 4종 선택·표시 | ✅ 완료 | High | data-prayer, impl-name-fill | 25분 |
| `ui-elder` | 노인 친화 UI·고정 상단바·접근성·출처 표기 | ✅ 완료 | High | impl-name-fill, impl-font-zoom, impl-situation | 35분 |
| `impl-wakelock` | 화면 켜짐 유지(Wake Lock) 토글 | ✅ 완료 | Medium | ui-elder | 15분 |
| `add-prefs` | 이름·상황·글자크기 prefs 통합 저장/복원 | ✅ 완료 | Medium | impl-name-fill, impl-font-zoom, impl-situation | 15분 |
| `polish-deploy` | 반응형 점검·README·정적 빌드 확인 | ✅ 완료 | Medium | ui-elder, add-prefs | 20분 |

**전체 진행률**: 100% (10/10 tasks 완료)  
**마지막 업데이트**: 2026-09-16 02:20

> 💡 **사용법**: `/code <plan-id> <task-id>` 형식으로 실행 (예: `/code PLAN-000001 setup-vite`). 전부: `/code PLAN-000001 *`

---

## Tasks 상세 목록

### Phase 1: 프로젝트 기반

#### Task setup-vite
- [x] **상태**: 완료
- **Task ID**: `setup-vite`
- **한 줄 요약**: Vite+React+TS 프로젝트 초기화 및 기본 레이아웃
- **설명**: 저장소 루트에 Vite + React + TypeScript 앱을 구성하고, 앱 셸·전역 CSS 변수·한국어 메타를 준비한다. feature 폴더 `src/features/short-memorial-prayer/`를 만든다.
- **의존성**: 없음
- **우선순위**: High
- **예상 시간**: 20분
- **구현 위치**: `package.json`, `vite.config.ts`, `index.html`, `src/`, `src/features/short-memorial-prayer/`

### Phase 2: 데이터·도메인

#### Task data-prayer
- [x] **상태**: 완료
- **Task ID**: `data-prayer`
- **한 줄 요약**: 짧은 위령기도 정적 데이터·플레이스홀더 구조화
- **설명**: FR-1에 맞춰 기도문 섹션/라인/역할/이름 자리·조사 규칙을 타입과 JSON·TS 모듈로 구조화한다. 상황별 맺음 기도 4종을 별도 situation 섹션으로 둔다. 외부 스크래핑 없이 정적 데이터만 사용한다.
- **의존성**: `setup-vite`
- **우선순위**: High
- **예상 시간**: 35분
- **구현 위치**: `src/features/short-memorial-prayer/data/`, `src/features/short-memorial-prayer/types.ts`

#### Task impl-particles
- [x] **상태**: 완료
- **Task ID**: `impl-particles`
- **한 줄 요약**: 한글 조사(을/를·이/가·은/는) 자동 처리 유틸
- **설명**: 이름의 마지막 글자 받침 여부로 `을/를`, `이/가`, `은/는`을 선택하는 순수 함수를 구현하고, 받침 있음/없음·빈 문자열 케이스를 검증한다.
- **의존성**: `setup-vite`
- **우선순위**: High
- **예상 시간**: 25분
- **구현 위치**: `src/features/short-memorial-prayer/lib/particles.ts`

### Phase 3: 핵심 UI 기능

#### Task impl-name-fill
- [x] **상태**: 완료
- **Task ID**: `impl-name-fill`
- **한 줄 요약**: 고인 이름 입력·본문 치환·빈칸 강조
- **설명**: FR-2. 상단 이름 입력과 기도문 렌더러를 연결해 플레이스홀더를 치환한다. 이름 없을 때 빈칸을 시각적으로 강조한다. 쉼표로 이어 쓴 여러 이름은 마지막 글자 기준 조사를 적용한다.
- **의존성**: `data-prayer`, `impl-particles`
- **우선순위**: High
- **예상 시간**: 30분
- **구현 위치**: `src/features/short-memorial-prayer/components/NameInput.tsx`, `PrayerBody.tsx`, `lib/fillName.ts`

#### Task impl-font-zoom
- [x] **상태**: 완료
- **Task ID**: `impl-font-zoom`
- **한 줄 요약**: A−/A+ 글자 크기 조절 및 localStorage 저장
- **설명**: FR-3. 기본 22px, 16~40px 범위의 단계 조절. CSS 변수로 본문 크기를 바꾸고 localStorage에 저장한다.
- **의존성**: `setup-vite`
- **우선순위**: High
- **예상 시간**: 20분
- **구현 위치**: `src/features/short-memorial-prayer/components/FontZoom.tsx`, `lib/prefs.ts`

#### Task impl-situation
- [x] **상태**: 완료
- **Task ID**: `impl-situation`
- **한 줄 요약**: 상황별 맺음 기도 4종 선택·표시
- **설명**: FR-4. 큰 터치 버튼으로 4상황 중 하나만 표시. 기본값 `anniversary`(기일). 선택 시 이름 치환도 함께 적용한다.
- **의존성**: `data-prayer`, `impl-name-fill`
- **우선순위**: High
- **예상 시간**: 25분
- **구현 위치**: `src/features/short-memorial-prayer/components/SituationPicker.tsx`

### Phase 4: UX·마무리

#### Task ui-elder
- [x] **상태**: 완료
- **Task ID**: `ui-elder`
- **한 줄 요약**: 노인 친화 UI·고정 상단바·접근성·출처 표기
- **설명**: FR-5. 높은 대비·줄간격·터치 44px+, 고정 상단바, 단열 읽기 폭, 역할 기호 스타일, 하단 출처 링크. 불필요 메뉴 없음.
- **의존성**: `impl-name-fill`, `impl-font-zoom`, `impl-situation`
- **우선순위**: High
- **예상 시간**: 35분
- **구현 위치**: `src/features/short-memorial-prayer/ShortMemorialPrayerPage.tsx`, `src/features/short-memorial-prayer/*.css`, `src/App.tsx`

#### Task impl-wakelock
- [x] **상태**: 완료
- **Task ID**: `impl-wakelock`
- **한 줄 요약**: 화면 켜짐 유지(Wake Lock) 토글
- **설명**: 지원 브라우저에서만 Wake Lock API로 화면 유지. 미지원 시 토글 숨김 또는 비활성 안내.
- **의존성**: `ui-elder`
- **우선순위**: Medium
- **예상 시간**: 15분
- **구현 위치**: `src/features/short-memorial-prayer/components/WakeLockToggle.tsx`, `lib/wakeLock.ts`

#### Task add-prefs
- [x] **상태**: 완료
- **Task ID**: `add-prefs`
- **한 줄 요약**: 이름·상황·글자크기 prefs 통합 저장/복원
- **설명**: AppPrefs를 한 모듈로 묶어 로드/저장하고, 페이지 마운트 시 복원한다. 키 스키마는 spec 데이터 모델을 따른다.
- **의존성**: `impl-name-fill`, `impl-font-zoom`, `impl-situation`
- **우선순위**: Medium
- **예상 시간**: 15분
- **구현 위치**: `src/features/short-memorial-prayer/lib/prefs.ts`

#### Task polish-deploy
- [x] **상태**: 완료
- **Task ID**: `polish-deploy`
- **한 줄 요약**: 반응형 점검·README·정적 빌드 확인
- **설명**: 모바일 세로 기준 가로 스크롤 없음 확인, `npm run build` 성공, README에 실행·빌드·출처 안내를 적는다. 실제 원격 배포는 선택.
- **의존성**: `ui-elder`, `add-prefs`
- **우선순위**: Medium
- **예상 시간**: 20분
- **구현 위치**: `README.md`, `package.json` scripts

## 의존성 그래프
```
setup-vite
├── data-prayer ──────────────┐
├── impl-particles ───────────┼── impl-name-fill ── impl-situation ──┐
└── impl-font-zoom ───────────┴──────────────────────────────────────┼── ui-elder ── impl-wakelock
                                                                      │
                    impl-name-fill + impl-font-zoom + impl-situation ─┴── add-prefs
                                                                              │
                                                         ui-elder + add-prefs ┴── polish-deploy
```

## 변경 이력
- 2026-09-16 02:02: 초기 tasks.md 생성 (`short-memorial-prayer` feature 기준)
- 2026-09-16 02:02: `/tasks` 선행 조건으로 `spec/project.md`·feature spec을 plan에서 동기화 생성
- 2026-09-16 02:20: `/code PLAN-000001 *` — 10/10 tasks 완료, build 통과
