-- ============================================================================
-- Zenith Life Tracker — schema, scoring views, RLS, indexes.
-- Paste into the Supabase SQL editor and run, then run seed.sql.
--
-- Changes vs. BUILD.md §4 (so the data is actually private, as BUILD.md intends):
--   * RLS enabled on both tables; only an authenticated session has access.
--   * Views created WITH (security_invoker = on) so RLS applies to the caller.
--   * Helpful indexes for the view aggregations.
-- The schema, the two views, and the scoring math are exactly as specified.
-- ============================================================================

-- ---------- tables ----------
create table if not exists tasks (
  id          bigint generated always as identity primary key,
  category    text not null check (category in ('fitness','work','learning','relationships')),
  name        text not null,
  weight      numeric not null default 1,   -- task weight, set per day
  task_date   date not null,                -- the day this task is for
  completed   boolean not null default false
);

create table if not exists category_weights (
  month       date not null,                -- first day of the month, e.g. 2026-06-01
  category    text not null check (category in ('fitness','work','learning','relationships')),
  weight      numeric not null default 1,
  primary key (month, category)
);

-- ---------- indexes ----------
create index if not exists tasks_task_date_idx on tasks (task_date);
create index if not exists tasks_category_date_idx on tasks (category, task_date);

-- ---------- scoring views ----------
-- Each category's daily completion %
create or replace view daily_category_pct
with (security_invoker = on) as
select
  task_date,
  category,
  round(100.0 * sum(weight) filter (where completed) / nullif(sum(weight), 0), 1) as pct
from tasks
group by task_date, category;

-- One overall % per day, applying that month's category weights
create or replace view daily_overall_pct
with (security_invoker = on) as
select
  d.task_date,
  round(sum(d.pct * cw.weight) / nullif(sum(cw.weight), 0), 1) as pct
from daily_category_pct d
join category_weights cw
  on cw.category = d.category
  and cw.month = date_trunc('month', d.task_date)::date
group by d.task_date;

-- ---------- row level security (single private user) ----------
alter table tasks enable row level security;
alter table category_weights enable row level security;

drop policy if exists "tasks_authenticated_all" on tasks;
create policy "tasks_authenticated_all"
  on tasks for all to authenticated using (true) with check (true);

drop policy if exists "category_weights_authenticated_all" on category_weights;
create policy "category_weights_authenticated_all"
  on category_weights for all to authenticated using (true) with check (true);
