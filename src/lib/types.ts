// Domain types — mirror the schema in supabase/migration.sql.

export const CATEGORIES = ['fitness', 'work', 'learning', 'relationships'] as const
export type Category = (typeof CATEGORIES)[number]

export interface Task {
  id: number
  category: Category
  name: string
  weight: number
  task_date: string // YYYY-MM-DD
  completed: boolean
}

// Payload for inserting a task (id is generated, completed defaults to false).
export interface NewTask {
  category: Category
  name: string
  weight: number
  task_date: string
}

export interface CategoryWeight {
  month: string // YYYY-MM-DD, first day of the month
  category: Category
  weight: number
}

// Rows from the scoring views (see migration.sql).
export interface DailyCategoryPct {
  task_date: string
  category: Category
  pct: number | null
}

export interface DailyOverallPct {
  task_date: string
  pct: number | null
}
