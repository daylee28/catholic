# 짧은 위령기도

노인·가족이 **짧은 위령기도(위령기도 2)** 를 크게 읽고, 고인 이름을 본문에 자동으로 넣어 바칠 수 있는 웹 앱입니다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 안내된 주소(보통 `http://localhost:5173`)를 엽니다.

## 빌드

```bash
npm run build
npm run preview
```

정적 결과물은 `dist/`에 생성됩니다.

## GitHub Pages 배포

`daylee28.github.io` 유저 사이트는 다른 리포용이므로, **이 프로젝트는 별도 리포의 Project Pages**로 올립니다.

최종 URL 예: `https://daylee28.github.io/<리포이름>/`  
(예: 리포가 `catholic`이면 `https://daylee28.github.io/catholic/`)

### 한 번만 하면 되는 설정

1. GitHub에 **새 리포** 만들기 (예: `catholic`) — `daylee28.github.io` 리포에 넣지 말 것
2. 이 폴더를 푸시
   ```bash
   git init
   git add .
   git commit -m "Initial short memorial prayer site"
   git branch -M main
   git remote add origin https://github.com/daylee28/<리포이름>.git
   git push -u origin main
   ```
3. 리포 **Settings → Pages → Build and deployment → Source: GitHub Actions**
4. Actions 탭에서 `Deploy to GitHub Pages` 성공 후 위 URL로 접속

빌드 시 `GITHUB_REPOSITORY`로 Vite `base`가 자동 `/<리포이름>/`이 됩니다.  
로컬에서 Pages와 같은 base로 미리보려면:

```bash
# Windows PowerShell 예
$env:VITE_BASE="/catholic/"; npm run build; npm run preview
```

## 주요 기능

- 고인 이름 입력 → 본문 `( )` 자리 자동 치환 + 조사(을/를, 이/가, 은/는, 과/와)
- A− / A+ 글자 크기 (16–40px, 기기 저장)
- 상황별 맺음 기도 4종 (사망~장례 / 탈상 / 기일 / 설·한가위)
- 화면 켜짐 유지(지원 브라우저)

## 출처

기도문: [가톨릭 굿뉴스 위령기도 2(짧은 위령 기도)](https://app.catholic.or.kr/web/prayer/?flag=7&ingId=69)  
가정·본당 기도 보조용이며, 이름·설정은 브라우저 `localStorage`에만 저장됩니다.

## 문서

- Plan: `docs/plan/PLAN-000001_init/plan.md`
- Spec: `docs/spec/features/short-memorial-prayer/short-memorial-prayer.md`
