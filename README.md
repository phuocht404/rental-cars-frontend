# Rental Cars Client

Next.js 16 (App Router) + React 19 frontend for the Rental Cars platform.

## Getting Started

```bash
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm dev                     # http://localhost:3000
```

The backend must be running (see `rental-cars-backend`). Browser requests go to `/api/v1/*` on the same
origin and are rewritten to `API_URL`, so the httpOnly auth cookies set by the backend are first-party.

## Scripts

| Script           | Description                     |
| ---------------- | ------------------------------- |
| `pnpm dev`       | Development server              |
| `pnpm build`     | Production build                |
| `pnpm start`     | Run the production build        |
| `pnpm lint`      | ESLint (flat config)            |
| `pnpm typecheck` | TypeScript without emitting     |

## Rendering

- Public pages (`/`, `/car/[slug]`, `/search`, guides) are server-rendered with ISR so the HTML already
  contains the content for users and search engines. Each car page has its own metadata, Open Graph tags
  and Product JSON-LD; `sitemap.xml` and `robots.txt` are generated from the API.
- Search filters live in the URL (`/search?startDate=…&price=300-1000&seats=4-7`), so results are
  shareable and paginated with real links.
- `src/proxy.ts` reads the role from the JWT cookie, protects private routes and refreshes an expired
  access token before the page renders.
