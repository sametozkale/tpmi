# TPMI

TPMI is a global precious metals portfolio tracker: live international spot context, physical holdings in any currency, and a warm, editorially minimal interface (Cosmos-inspired recessive chrome).

Phase 0 ships **project bootstrap**, **Supabase auth**, **protected app shell**, and a **Markets dashboard skeleton** with placeholder prices.

## Tech stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 + CSS design tokens (`app/globals.css`)
- **UI:** HeroUI v3 (`@heroui/react`, `@heroui/styles`)
- **Icons:** `@hugeicons/react` + `@hugeicons/core-free-icons`
- **Auth & data:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- **State (later):** Zustand
- **Charts (later):** Liveline

## Getting started

```bash
pnpm install
# configure .env.local (Supabase keys + site URL — see Environment variables)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase setup

1. Create a Supabase project and copy **Project URL** + **anon key** into `.env.local`.
2. In the SQL editor, run the schema from **Section 8** of your project plan (profiles + `metal_prices` cache + RLS). The SQL matches the original GoldVault plan; table names are unchanged.
3. **Auth → URL configuration:** add `http://localhost:3000/auth/callback` (and production callback) to **Redirect URLs**.
4. **Email auth:** enable email/password and configure SMTP or Supabase default mailer for confirmations.
5. **Google OAuth (optional but recommended):**
   - Supabase Dashboard → Authentication → Providers → **Google** → enable.
   - Google Cloud Console → OAuth client → **Authorized redirect URIs** must include  
     `https://<your-project-ref>.supabase.co/auth/v1/callback`.

## Environment variables

Configure `.env.local` with values from the Supabase dashboard (and generate `CRON_SECRET` for production refresh).

| Key | When | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Required | Supabase API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Required | Browser + server Supabase client |
| `NEXT_PUBLIC_SITE_URL` | Recommended | OAuth + email redirect base (match dev port, e.g. `http://localhost:3003`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Cron / refresh | Server-only writes to `spot_cache` / `fx_cache` via `/api/prices/refresh` |
| `CRON_SECRET` | Cron / refresh | `Authorization: Bearer` secret for `/api/prices/refresh` |

Spot quotes use **api.gold-api.com** (see [Gold API docs](https://gold-api.com/docs)) and **open.er-api.com**; no API keys required. Symbol labels come from the public metals-api symbols page or built-in defaults.

## Routes

| Path | Notes |
| --- | --- |
| `/sign-in`, `/sign-up` | Email + Google; errors via `?error=` |
| `/auth/callback` | OAuth + email confirmation exchange |
| `/auth/signout` | `POST` to sign out |
| `/dashboard` | Live spot + Turkiye derived pricing sections |
| `/watchlist` | Watchlist + live spot-derived prices |
| `/portfolio` | Portfolio summary + allocations |
| `/settings` | Placeholder for future preferences |

## Live pricing cron

- `vercel.json` defines a 2-minute cron for `/api/prices/refresh`.
- Vercel cron must send `Authorization: Bearer ${CRON_SECRET}`.
- `SUPABASE_SERVICE_ROLE_KEY` is used only server-side in `app/api/prices/refresh/route.ts` and never exposed to client code.

## Phase roadmap

1. Liveline charts + optional Supabase historical cache
2. Holdings / physical portfolio
3. Notifications and alerts (e.g. email via Edge Functions)
4. Multi-currency calculator
5. Historical charts (third-party APIs as needed)
6. i18n
7. Marketing / landing site

## Scripts

- `pnpm dev` — development server (**Webpack**; avoids Turbopack dev-cache bugs that surface as Internal Server Error / missing `[turbopack]_runtime.js`)
- `pnpm dev:turbo` — dev with Turbopack (faster HMR when stable)

If the app shows **Internal Server Error** or 500s after editing `.env` or hot reload, stop the server, run `rm -rf .next`, then `pnpm dev` again.
- `pnpm build` — production build
- `pnpm start` — run production build
- `pnpm lint` — ESLint

## Product naming

Internal documents referred to **GoldVault**; this codebase and UI use **TPMI**.
