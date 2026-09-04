
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
- `/onboarding/church-basics` - Step 1: church basics (founder + church info)
- `/onboarding/location-contact` - Step 2: location & contact
- `/onboarding/service-branding` - Step 3: service times + church logo upload
- `/onboarding/ministries` - Step 4: ministries & departments
- `/onboarding/complete` - setup completion; calls `completeChurchOnboarding` then redirects to `/dashboard`
- `/dashboard` - existing dashboard

Each step persists to the backend on submit (`PATCH /onboarding/church/step-N`).
The backend enforces strictly sequential onboarding (every earlier step must be
saved first) and returns `STEP_1_REQUIRED` / `STEP_2_REQUIRED` /
`STEP_3_REQUIRED` (or `INCOMPLETE_ONBOARDING` from `/complete`); the UI redirects
to the corresponding step when one of those is returned.

## Pricing Plan Tiers

ChurchEden defines three plan tiers:
- **Explorer** (`EXPLORER`) — For churches getting started (£0 / Forever free)
- **Plus** (`PLUS`) — For growing churches (£49.99/mo or £39.99/mo annually)
- **Core** (`CORE`) — For established churches & larger ministries (£99.99/mo or £79.99/mo annually)

## Backend Integration

Auth is wired to the live Railway API at `https://api.churcheden.app/api/v1`. See [MASTER-INTEGRATION-PROMPT.md](file:///c:/Users/SIMPATY%20SOLUTIONS/ChurchEden-Web/guidelines/MASTER-INTEGRATION-PROMPT.md) for full API reference.
