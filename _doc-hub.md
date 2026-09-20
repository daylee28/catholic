# 문서 허브 (plan / spec / code 계열 공통)

`/plan`, `/spec-update`, `/tasks`, `/code`, `/revise`, `/sync-code-spec`, `/knowledge`, `/suggest-plan`, `/update-readme`, `/git-push`, `/security-check` 를 실행하기 **전에** 이 파일을 읽는다.

## 정본 경로

폴백 없음. 아래만 유효하다.

| 본문에서 쓰는 말 | 실제 경로 |
|------------------|-----------|
| `spec/` | `docs/spec/` |
| `plan/` | `docs/plan/` |
| `tracking/` | `docs/tracking/` |
| `knowledge/` | `docs/knowledge/` |
| `decisions/` | `docs/decisions/` |

예: `spec/project.md` → `docs/spec/project.md`. `plan/PLAN-000001_init/plan.md` → `docs/plan/PLAN-000001_init/plan.md`.

엔진 폴더 (있을 때만):

- Unity: `<repo>_unity/` (예: `vivace_unity/`)
- 서버: `<repo>_server/` (예: `vivace_server/`)

Unity Editor는 `<repo>_unity/`를 연다. Cursor 워크스페이스는 저장소 루트다.

## 레이아웃 게이트

루트에 `spec/`, `plan/`, `tracking/`, `knowledge/`가 남아 있거나, Unity가 루트/`client/`에 있으면 **구 레이아웃**이다.

- 구 레이아웃이면 그 경로로 읽거나 쓰지 않는다.
- 같은 턴에서 [`check-mig.md`](check-mig.md) (`/check-mig`)를 수행한다.
- 끝난 뒤에만 원래 명령을 `docs/` 경로로 계속한다.

아직 문서가 없는 새 저장소는 구 레이아웃이 아니다. `/plan`이 `docs/plan/`, `docs/tracking/`을 만들면 된다.

`/knowledge --init`은 `docs/knowledge/`만 만든다. 루트 `knowledge/`가 있으면 먼저 `/check-mig`.
