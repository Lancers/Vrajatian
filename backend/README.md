# Vrajatian Backend — Phase 1

NestJS API for the travel platform. Phase 1 scope: the **packages catalog** —
public read endpoints for the website, admin-guarded endpoints to upload and
manage packages (with cover-image upload). Built per `docs/backend-architecture.md`.

## Architecture (Phase 1)

```
Browser (React)                    Backend (NestJS)                 Supabase
──────────────                     ────────────────                 ────────
public pages   ──GET /packages──►  PackagesController  ──service-role──►  Postgres
admin panel    ──POST/PATCH/DEL─►  AdminPackagesController                Storage
   │  (Bearer <supabase JWT>)        │  AdminGuard: verify JWT + admins    │
   └──login──────────────────────────┴──────────────────────────────► Supabase Auth
```

- **Reads/writes go through this API**, not straight to Postgres. The API uses
  the Supabase **service-role key** (server-only) and enforces access in the
  `AdminGuard` — it verifies the caller's Supabase JWT and checks the `admins`
  allow-list. The frontend still uses Supabase **only for auth** (login/session).

## Endpoints (`/api/v1`)

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/health` | public | liveness check |
| GET | `/packages` | public | list published packages |
| GET | `/packages/:slug` | public | one published package |
| GET | `/admin/me` | admin | who am I? — the frontend gates the admin UI on this |
| GET | `/admin/packages` | admin | list all (incl. drafts) |
| POST | `/admin/packages` | admin | create (multipart: fields + `image`) |
| PATCH | `/admin/packages/:id` | admin | update (multipart: fields + optional `image`) |
| DELETE | `/admin/packages/:id` | admin | delete (also removes the cover image) |

Admin requests must send `Authorization: Bearer <supabase access token>`.
Anyone can hold a Supabase session (travellers register too), so `/admin/me` is
the check that separates an admin from a merely logged-in user — the React
`AdminLayout` calls it before rendering the dashboard.

## Setup

Do these in order — nothing runs until Supabase is configured.

1. **Create a Supabase project**, then open Project Settings → API and copy the
   project URL, the `anon` key, and the `service_role` key.
2. **Run the schema.** Paste `../frontend/supabase/schema.sql` into the Supabase
   SQL Editor and run it. It creates `packages`, the `admins` allow-list, and the
   RLS policies.
3. **Create the storage bucket** — Storage → New bucket → name it exactly
   `package-images` and mark it **public**.
4. **Make yourself an admin.** Authentication → Users → Add user (tick "Auto
   Confirm User"), copy the new UID, then run in the SQL Editor:
   ```sql
   insert into public.admins (user_id) values ('PASTE-ADMIN-UID-HERE');
   ```
5. **Fill in the env files** (both already exist, with blanks):
   - `backend/.env` → `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `frontend/.env.local` → `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
6. **Run both halves** in separate terminals:
   ```bash
   cd backend  && npm install && npm run start:dev   # http://localhost:3000/api/v1
   cd frontend && npm install && npm run dev         # http://localhost:5173
   ```
7. Log in at `/login` with the admin email/password from step 4 — you land on
   `/admin`. Add a package with a cover image and it appears on the public site.

The admin allow-list (`public.admins`) is what both this API's guard and the SQL
RLS policies check. If the config is incomplete the API refuses to boot and
prints exactly which variable is missing.

## What the admin controls

Everything the public site shows about a package is editable from `/admin`:
title, location, price, duration, region, difficulty, group size, cover image,
description, inclusions, itinerary, **rating**, plus two visibility switches —
`status` (published/draft, i.e. on or off the website) and `is_featured` (which
packages fill the "Featured Vacations" row on the homepage; if none are flagged
the homepage falls back to the highest rated).

## Notes / next phases

- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS — keep it server-side only, never in
  the frontend bundle.
- `PATCH /admin/packages/:id` sends the whole object, not a partial patch — the
  admin form always submits every field. The slug is fixed at creation and is
  not changed by later edits, so existing links keep working.
- Phase 2+ (bookings, payments, workflow, notifications) slot in as new modules
  under `src/modules/` per the architecture doc.
