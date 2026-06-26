# Zenith — Personal Instrument

A quiet, high-contrast life tracker. You log daily tasks across four life
pillars — **Fitness**, **Work**, **Learning**, and **Relationships** — give each
a weight, and Zenith turns that into a single weighted "resonance" score per day,
charted over the month. Built as a single-user app: your data is private behind a
login gate and Postgres row-level security.

The visual language is **Zen Nocturne** — ink-black surfaces, Deep Gold accents,
Newsreader + Inter type. See [design/zen_nocturne/DESIGN.md](design/zen_nocturne/DESIGN.md).

## Screens

| Screen | What it does |
| --- | --- |
| **Today** | Greeting, overall + per-category scores for today with month-to-date sparklines, a "Monthly Resonance" line chart, a category-balance donut, and today's task list (click to toggle complete). |
| **Plan Tomorrow** | Add tasks for tomorrow — name, category, and an intensity/weight slider — grouped into a "Planned Rhythm" preview. |
| **Charts** | Full-month trajectory (overall + each category) with a month selector, plus stats: average resonance, peak day, and longest 70%+ streak. |
| **Category Weights** | Set how much each pillar counts **this month** with sliders. Past months stay frozen, so history never re-scores. |

## How scoring works

- **Per category, per day:** `100 × (weight of completed tasks) / (weight of all tasks)`.
- **Overall, per day:** the weighted average of the four category percentages, using
  **that month's** category weights.

Both are computed in Postgres as views (`daily_category_pct`, `daily_overall_pct`),
so the math lives with the data — see [supabase/migration.sql](supabase/migration.sql).

## Tech stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) + [Vite 7](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com) (theme tokens in [src/index.css](src/index.css))
- [Supabase](https://supabase.com) — Postgres, auth, and row-level security
- [TanStack Query](https://tanstack.com/query) for data fetching/caching
- [React Router](https://reactrouter.com) and [Recharts](https://recharts.org)

**Requires Node.js 20.19+ or 22.12+.**

## Getting started

### 1. Clone & install

```bash
git clone https://github.com/aryanovin9024/zenith-life-tracker.git
cd zenith-life-tracker
npm install
```

### 2. Create a Supabase project

At [supabase.com](https://supabase.com), create a project. Then copy your
credentials from **Project Settings → API**.

### 3. Configure environment

```bash
cp .env.example .env
```

Fill in `.env` with your project's **base** URL and anon key:

```
VITE_SUPABASE_URL=https://<your-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

> The URL is the bare project URL — **no** `/rest/v1` or other path. The client
> adds those itself. The anon key is exposed to the browser by design; privacy
> comes from RLS + the login gate, not from hiding it.

### 4. Set up the database

In the Supabase dashboard, open **SQL Editor → New query** and run, in order:

1. [supabase/migration.sql](supabase/migration.sql) — tables, scoring views, RLS, indexes.
2. [supabase/seed.sql](supabase/seed.sql) — ~5 weeks of sample data (re-runnable).

### 5. Create your login

The tables have RLS enabled, so the app shows data only to an authenticated user.
Run the app (below), click **"Create one"** on the login screen, and sign up.

> Supabase enables email confirmation by default. For a frictionless single-user
> setup, turn it off at **Authentication → Providers → Email → "Confirm email"**.

### 6. Run

```bash
npm run dev
```

Open http://localhost:5173.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server. |
| `npm run build` | Type-check and build for production. |
| `npm run preview` | Preview the production build. |
| `npm run lint` | Lint with [oxlint](https://oxc.rs). |

## Project structure

```
src/
  auth/         AuthProvider (session) + Login screen
  components/   AppShell (nav), charts, sparkline, add-task form
  lib/          supabase client, types, date helpers, queries, scoring
  pages/        Today, PlanTomorrow, Charts, CategoryWeights
supabase/       migration.sql (schema + views + RLS) and seed.sql
design/         Zen Nocturne design system + reference screens
```
