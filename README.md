
# ChurchEden

ChurchEden is a React/Vite church management interface for landing, onboarding, and dashboard workflows.

## Deployment

| Service | URL | Host |
|---|---|---|
| Frontend | https://churcheden.app | Cloudflare Pages |
| Backend API | https://api.churcheden.app | Railway |

**Health check (verified live):**
```bash
curl https://api.churcheden.app/health
# {"status":"OK","date":"...","service":"ChurchEden Backend API"}
```

## Stack

- React 18
- Vite 6
- TypeScript
- Tailwind CSS v4
- React Router v7
- Radix UI / shadcn-style primitives

## Environment Variables

Vite only exposes variables prefixed with `VITE_`.

| Variable | Production | Local dev |
|---|---|---|
| `VITE_APP_NAME` | `ChurchEden` | `ChurchEden` |
| `VITE_APP_URL` | `https://churcheden.app` | `http://localhost:5173` |
| `VITE_API_BASE_URL` | `https://api.churcheden.app/api/v1` | `http://localhost:3000/api/v1` |

**Files:**
- `.env` — production domains (default)
- `.env.development` — localhost overrides for `npm run dev`
- `.env.production` — used by `npm run build` / Cloudflare Pages

**Cloudflare Pages:** set all three `VITE_*` variables in Build → Environment variables.

**Usage in code:**
```ts
import { env } from "@/env";
import { apiUrl } from "@/lib/api";

apiUrl("/auth/login"); // https://api.churcheden.app/api/v1/auth/login
```

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Verification

Run TypeScript checks:

```bash
npm run typecheck
```

Run ESLint:

```bash
npm run lint
```

Note: this project was migrated from a Figma Make export. Some older dashboard files may still contain pre-existing lint warnings/errors unrelated to the landing and onboarding redesign.

## Testing

Vitest + React Testing Library (jsdom). Covers the auth/session layer (incl. the `/auth/me` 401 no-refresh-loop regression), route guards, and shared logic.

```bash
npm test              # run once (CI)
npm run test:watch    # watch mode
npm run test:run      # run once (alias)
npm run test:coverage # run with v8 coverage
```

Configuration lives in `vitest.config.ts` (setup file: `src/test/setup.ts`).

## App Routes

- `/` - ChurchEden landing page
- `/onboarding/welcome` - sign-up entry
- `/onboarding/sign-in` - sign-in entry
- `/onboarding/church-profile` - church profile setup
- `/onboarding/complete` - setup completion and dashboard redirect
- `/dashboard` - existing dashboard

## Backend Integration

Auth is wired to the live Railway API at `https://api.churcheden.app/api/v1`. See **`guidelines/MASTER-INTEGRATION-PROMPT.md`** for the full API reference.
