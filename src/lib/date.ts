// Local-time date helpers. task_date / month are plain DATEs (no timezone),
// so we always format from local calendar fields to avoid UTC drift.

export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function parse(iso: string): Date {
  return new Date(`${iso}T00:00:00`)
}

export function today(): string {
  return toISODate(new Date())
}

export function addDays(iso: string, n: number): string {
  const d = parse(iso)
  d.setDate(d.getDate() + n)
  return toISODate(d)
}

export function tomorrow(): string {
  return addDays(today(), 1)
}

export function monthStart(iso: string): string {
  return `${iso.slice(0, 8)}01`
}

export function monthEnd(iso: string): string {
  const d = parse(iso)
  return toISODate(new Date(d.getFullYear(), d.getMonth() + 1, 0))
}

export function addMonths(monthISO: string, n: number): string {
  const d = parse(monthISO)
  return toISODate(new Date(d.getFullYear(), d.getMonth() + n, 1))
}

const LONG = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})
const MONTH = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' })
const MONTH_SHORT = new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' })
const DAY = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })
const WEEKDAY = new Intl.DateTimeFormat(undefined, { weekday: 'long' })

export const formatLong = (iso: string) => LONG.format(parse(iso))
export const formatMonth = (monthISO: string) => MONTH.format(parse(monthISO))
export const formatMonthShort = (monthISO: string) => MONTH_SHORT.format(parse(monthISO))
export const formatDay = (iso: string) => DAY.format(parse(iso))
export const formatWeekday = (iso: string) => WEEKDAY.format(parse(iso))
