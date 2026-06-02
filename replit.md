# CineMate

A full movie and TV streaming discovery site — search any title, get TMDB details, and watch via embedded VidKing player.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/cinemate run dev` — run the frontend (port auto-assigned)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required env: `TMDB_API_KEY` — TMDB API key for movie data

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind + Framer Motion + Wouter
- API: Express 5 (no DB — all data is live from TMDB)
- Validation: Zod (`zod/v4`)
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Player: VidKing embed (iframe)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/api-client-react/src/generated/` — generated React Query hooks
- `lib/api-zod/src/generated/` — generated Zod schemas
- `artifacts/api-server/src/routes/movies.ts` — search/trending/popular/genres endpoints
- `artifacts/api-server/src/routes/media.ts` — details/similar/credits/seasons endpoints
- `artifacts/cinemate/src/` — React frontend

## Architecture decisions

- No database — all content is fetched live from TMDB and cached by React Query
- TMDB API key is kept server-side only (never exposed to frontend)
- VidKing embed uses path `/embed/movie/{id}` for movies and `/embed/tv/{id}/{season}/{episode}` for TV
- OpenAPI path params use `mediaType` in path (not query) to avoid Orval TS2308 collisions
- All media type endpoints use `/media/{mediaType}/{mediaId}` pattern for type safety

## Product

- Home: trending hero, popular movies/TV rows, top-rated
- Search: real-time search across movies and TV shows
- Movie detail: full info + VidKing player embed + cast + similar
- TV detail: season/episode selector + VidKing player + cast + similar
- Genre browsing

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Run codegen after any spec change: `pnpm --filter @workspace/api-spec run codegen`
- Path params on endpoints with shared query param names (like `type`) cause Orval TS2308 — use distinct path params instead (e.g. `/media/{mediaType}/{mediaId}`)
- VidKing embed only shows after user clicks "Watch Now" — not autoplay

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
