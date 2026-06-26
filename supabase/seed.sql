-- ============================================================================
-- Zenith Life Tracker — seed data.
-- Run AFTER migration.sql, in the Supabase SQL editor (service role bypasses RLS).
-- Inserts ~5 weeks of tasks (spanning the previous + current month, so you can
-- see that past months stay frozen) plus category weights for both months.
-- Re-runnable: it truncates first.
-- ============================================================================

truncate tasks restart identity;
delete from category_weights;

-- ---------- tasks: 2 per category per day for the last 35 days ----------
-- `completed` follows a per-day/per-category pattern so the lines look organic.
insert into tasks (category, name, weight, task_date, completed)
select
  c.category,
  c.name,
  c.weight,
  (current_date - g.n)::date as task_date,
  (((g.n * 7 + c.seed) % 10) < c.hit) as completed
from generate_series(0, 34) as g(n)
cross join (values
  ('fitness',       'Morning workout',     3, 0, 7),
  ('fitness',       'Walk / 8k steps',     1, 1, 8),
  ('work',          'Deep work block',     4, 2, 8),
  ('work',          'Inbox & comms',       1, 3, 6),
  ('learning',      'Read 30 minutes',     2, 4, 6),
  ('learning',      'Course / practice',   3, 5, 5),
  ('relationships', 'Call a friend',       2, 6, 5),
  ('relationships', 'Quality time',        3, 7, 6)
) as c(category, name, weight, seed, hit);

-- ---------- category weights: current month + previous month ----------
-- Different values per month demonstrate that history is frozen.
insert into category_weights (month, category, weight) values
  (date_trunc('month', current_date)::date,                        'fitness',       3),
  (date_trunc('month', current_date)::date,                        'work',          5),
  (date_trunc('month', current_date)::date,                        'learning',      2),
  (date_trunc('month', current_date)::date,                        'relationships', 2),
  ((date_trunc('month', current_date) - interval '1 month')::date, 'fitness',       2),
  ((date_trunc('month', current_date) - interval '1 month')::date, 'work',          4),
  ((date_trunc('month', current_date) - interval '1 month')::date, 'learning',      3),
  ((date_trunc('month', current_date) - interval '1 month')::date, 'relationships', 3)
on conflict (month, category) do update set weight = excluded.weight;
