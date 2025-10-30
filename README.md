# Moviestat

A personal movie/TV evaluation statistics & infographics 

Nuxt 3 frontend (client/) and Express backend (server/) with MongoDB for storage. SCSS-based styling and small custom composables for auth, evaluation management and statistics.

## Quick start

Prerequisites
- Node 18+ (use nvm / nvm-windows)
- MongoDB (or a hosted Mongo instance)
- Yarn or npm

Install & run (dev)
1. Server
   - Open `server/` (or project root if server lives there)
   - Install deps: `npm install`
   - Run dev: `npm run dev` (or `node server.js` / check `package.json`)

2. Client (Nuxt 3)
   - Open `client/`
   - Install deps: `npm install`
   - Run dev: `npm run dev`

Open browser: http://localhost:3000 (client) — API default: http://localhost:3001/ (see runtimeConfig in `client/nuxt.config.ts`)

## Project structure (high level)
- client/ — Nuxt 3 app
  - pages/ — route pages (e.g. `index.vue`, `media/[id].vue`, `signup.vue`)
  - components/ — UI components (MovieTable, MovieTableRow, partials)
  - composables/ — client-side composables (useAuth, loadData, changeRate, statistics)
  - assets/styles/ — SCSS architecture, mixins, partials
  - plugins/ — client plugins (e.g. `toast.client.ts`)
  - nuxt.config.ts — Nuxt configuration & runtimeConfig
- server/ — Express API
  - routes/ — route modules (mediaRoutes.js, auth, etc.)
  - services/ — DB/service logic (evaluationService, etc.)
  - middleware/ — auth, CORS, etc.

## Environment / config
- Nuxt runtime config: `runtimeConfig.public.apiBase` default `http://localhost:3001/`.
- Server: provide DB URI, JWT secret, CORS origin etc. (check server `config`).

## Development tips
- Restart dev server after adding plugins.
- Use browser devtools to confirm plugin console messages.
- Use `console.log` in composables to trace state hydration and watch handlers.