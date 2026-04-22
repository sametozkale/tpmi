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
cp .env.local.example .env.local
# fill in Supabase keys + site URL
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

| Key | Phase 0 | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Required | Supabase API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Required | Browser + server client |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Reserved for server-only jobs (not used in Phase 0 UI) |
| `NEXT_PUBLIC_SITE_URL` | Recommended | OAuth + email redirect base |
| `GOLDAPI_IO_KEY` | Phase 1+ | Live spot polling |
| `METALS_API_KEY` | Phase 1+ | Historical / fallback |

## Routes

| Path | Notes |
| --- | --- |
| `/sign-in`, `/sign-up` | Email + Google; errors via `?error=` |
| `/auth/callback` | OAuth + email confirmation exchange |
| `/auth/signout` | `POST` to sign out |
| `/dashboard` | Markets skeleton (mock metals) |
| `/holdings` | Placeholder |
| `/settings` | Theme + copy for future prefs |

## Phase roadmap

1. Live spot polling (GoldAPI.io) + Liveline charts + Supabase `metal_prices` cache
2. Holdings / physical portfolio
3. Notifications and alerts (e.g. email via Edge Functions)
4. Multi-currency calculator
5. Historical charts (Metals-API / alternatives)
6. i18n
7. Marketing / landing site

## Scripts

- `pnpm dev` — development server
- `pnpm build` — production build
- `pnpm start` — run production build
- `pnpm lint` — ESLint

## Product naming

Internal documents referred to **GoldVault**; this codebase and UI use **TPMI**.
