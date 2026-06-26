import type { Category, DailyCategoryPct, DailyOverallPct } from './types'

export interface ChartRow {
  date: string
  overall: number | null
  fitness: number | null
  work: number | null
  learning: number | null
  relationships: number | null
}

// Pivot the two scoring views into one row per date for charting.
export function mergeSeries(
  overall: DailyOverallPct[],
  category: DailyCategoryPct[],
): ChartRow[] {
  const map = new Map<string, ChartRow>()
  const row = (date: string): ChartRow => {
    let r = map.get(date)
    if (!r) {
      r = { date, overall: null, fitness: null, work: null, learning: null, relationships: null }
      map.set(date, r)
    }
    return r
  }
  for (const o of overall) row(o.task_date).overall = o.pct
  for (const c of category) row(c.task_date)[c.category] = c.pct
  return [...map.values()].sort((a, b) => a.date.localeCompare(b.date))
}

// The pct series for a single category, oldest → newest (nulls dropped).
export function categoryValues(rows: ChartRow[], cat: Category): number[] {
  return rows.map((r) => r[cat]).filter((v): v is number => v != null)
}

export function overallValues(rows: ChartRow[]): number[] {
  return rows.map((r) => r.overall).filter((v): v is number => v != null)
}

export function average(values: number[]): number | null {
  if (!values.length) return null
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
}

export function bestDay(rows: ChartRow[]): ChartRow | null {
  let best: ChartRow | null = null
  for (const r of rows) {
    if (r.overall == null) continue
    if (!best || best.overall == null || r.overall > best.overall) best = r
  }
  return best
}

// Longest run of consecutive present days at/above a threshold.
export function longestStreak(rows: ChartRow[], threshold = 70): number {
  let best = 0
  let run = 0
  for (const r of rows) {
    if (r.overall != null && r.overall >= threshold) {
      run += 1
      best = Math.max(best, run)
    } else {
      run = 0
    }
  }
  return best
}
