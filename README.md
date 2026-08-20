# Forum Diskusi App

Aplikasi forum diskusi berbasis React + Redux yang dibangun untuk submission Dicoding.

## 🚀 Demo
**URL Vercel:** _https://forum-sub2-es-lint-cypress.vercel.app/_

## 🛠️ Tech Stack
- React 18 + Vite
- Redux Toolkit
- React Router v6
- Vitest + React Testing Library (unit & integration test)
- Cypress (E2E test)
- ESLint (Airbnb config)
- GitHub Actions (CI)
- Vercel (CD)

## Menjalankan Aplikasi

```bash
npm install
npm run dev
```

## Menjalankan Test

### Unit & Integration Test
```bash
npm test
```
Output yang diharapkan: semua test pass (35 tests).

### E2E Test (butuh app jalan dulu)
```bash
# Terminal 1: jalankan app
npm run dev

# Terminal 2: jalankan cypress
npm run e2e:open    # mode GUI (lebih mudah untuk debug)
npm run e2e         # mode headless (untuk CI)
```

## Lint Check
```bash
npm run lint
```
Output yang diharapkan: 0 errors, 0 warnings.

## Fitur Aplikasi
- ✅ Daftar thread dengan filter kategori
- ✅ Detail thread + komentar
- ✅ Buat thread & komentar (perlu login)
- ✅ Vote thread & komentar (optimistic UI)
- ✅ Halaman leaderboard
- ✅ Register & login
- ✅ Loading indicator
