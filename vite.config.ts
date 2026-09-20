import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * daylee28.github.io(유저 사이트)와 별개로,
 * 이 앱은 프로젝트 Pages: https://daylee28.github.io/<repo>/ 에 배포한다.
 * GitHub Actions에는 GITHUB_REPOSITORY=owner/repo 가 자동 설정된다.
 * 로컬 `npm run dev` / `npm run build` 는 base `/` 유지.
 */
function resolveBase(): string {
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
  if (repo) return `/${repo}/`
  if (process.env.VITE_BASE) {
    const base = process.env.VITE_BASE
    return base.endsWith('/') ? base : `${base}/`
  }
  return '/'
}

export default defineConfig({
  plugins: [react()],
  base: resolveBase(),
})
