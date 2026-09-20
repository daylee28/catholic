# 프로젝트 계획

**기반 계획서**: [plan/PLAN-000001_init/plan.md](../plan/PLAN-000001_init/plan.md)  
**동기화일**: 2026-09-16

## 프로젝트 개요
노인·가족이 짧은 위령기도(위령기도 2)를 크게 읽고, 고인 이름을 본문 괄호 자리에 자동으로 넣어 바칠 수 있는 정적 웹 앱.

## 기술 스택
- Vite + React + TypeScript
- 순수 CSS(변수 기반)
- `localStorage`로 글자 크기·이름·상황 선택 유지
- 백엔드·DB 없음 (정적 호스팅)

## 구현 위치
- 앱 루트: 저장소 루트 Vite + React + TypeScript (`src/`)
- 기능 코드: `src/features/short-memorial-prayer/`
- 기도문 데이터: `src/features/short-memorial-prayer/data/`
- 추적: `docs/tracking/SPEC_TRACKING.md`

## Feature 목록
| Feature | 설명 | Spec |
|---------|------|------|
| `short-memorial-prayer` | 짧은 위령기도 본문, 이름 치환·조사, 글자 확대, 상황별 맺음 기도, 노인 친화 UI | [features/short-memorial-prayer/short-memorial-prayer.md](features/short-memorial-prayer/short-memorial-prayer.md) |

## 범위 (v1)
- 짧은 위령기도만
- 한국어 UI
- 온라인 접속 기준 (PWA/오프라인은 후속)

## 비범위
- 긴 위령기도·기타 기도문
- 로그인·서버 저장
- 광고·부가 메뉴
