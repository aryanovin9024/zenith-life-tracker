import { useMemo, useState } from 'react'
import { ResonanceChart } from '../components/charts'
import { CATEGORY_LIST } from '../lib/categories'
import { addMonths, formatLong, formatMonthShort, monthEnd, monthStart, today } from '../lib/date'
import { useCategorySeries, useOverallSeries } from '../lib/queries'
import { average, bestDay, longestStreak, mergeSeries, overallValues } from '../lib/series'

export function Charts() {
  const thisMonth = monthStart(today())
  const [month, setMonth] = useState(thisMonth)
  const months = [addMonths(thisMonth, -1), thisMonth]

  const start = monthStart(month)
  const end = monthEnd(month)
  const overall = useOverallSeries(start, end)
  const category = useCategorySeries(start, end)

  const rows = useMemo(
    () => mergeSeries(overall.data ?? [], category.data ?? []),
    [overall.data, category.data],
  )

  const avg = average(overallValues(rows))
  const best = bestDay(rows)
  const streak = longestStreak(rows, 70)

  return (
    <div className="max-w-[1200px] mx-auto">
      <header className="flex flex-wrap gap-4 justify-between items-start mb-section-gap">
        <div>
          <h2 className="font-serif text-headline-md italic mb-2">Monthly Trajectory</h2>
          <p className="text-on-surface-variant opacity-70 max-w-md">
            A longitudinal view of your equilibrium. The golden line is your weighted
            aggregate across all four dimensions.
          </p>
        </div>
        <div className="flex gap-1 bg-surface-container rounded-full p-1 ink-border">
          {months.map((m) => (
            <button
              key={m}
              onClick={() => setMonth(m)}
              className={`px-4 py-1.5 rounded-full text-label-sm font-label-sm transition-sink ${
                month === m
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {formatMonthShort(m)}
            </button>
          ))}
        </div>
      </header>

      <section className="p-8 bg-surface-container rounded-2xl ink-border mb-8">
        {rows.length > 1 ? (
          <ResonanceChart rows={rows} height={320} />
        ) : (
          <p className="text-on-surface-variant/60 text-sm py-24 text-center">
            No data recorded for {formatMonthShort(month)}.
          </p>
        )}
        <div className="flex flex-wrap gap-5 mt-6 pt-6 border-t border-ink-border">
          <Legend color="#f2ca50" label="Overall" bold />
          {CATEGORY_LIST.map((c) => (
            <Legend key={c.key} color={c.color} label={c.label} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          label="Average resonance"
          value={avg == null ? '—' : `${avg}`}
          unit="%"
          note="Mean weighted score across every recorded day this month."
        />
        <StatCard
          label="Peak alignment"
          value={best?.overall == null ? '—' : `${Math.round(best.overall)}`}
          unit="%"
          note={best ? `Your highest reading, on ${formatLong(best.date)}.` : 'No readings yet.'}
        />
        <StatCard
          label="Consistency"
          value={`${streak}`}
          unit={streak === 1 ? 'day' : 'days'}
          note="Longest run of consecutive days at or above 70%."
        />
      </section>
    </div>
  )
}

function Legend({ color, label, bold }: { color: string; label: string; bold?: boolean }) {
  return (
    <span className="flex items-center gap-2 text-xs text-on-surface-variant">
      <span className="w-3 h-[2px] rounded-full" style={{ backgroundColor: color }} />
      <span className={bold ? 'text-on-surface font-semibold' : ''}>{label}</span>
    </span>
  )
}

function StatCard({
  label,
  value,
  unit,
  note,
}: {
  label: string
  value: string
  unit: string
  note: string
}) {
  return (
    <div className="p-6 bg-surface-container rounded-2xl ink-border">
      <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant/60 mb-4">
        {label}
      </p>
      <p className="font-serif text-signature-num text-on-surface leading-none">
        {value}
        <span className="text-2xl italic opacity-50 ml-1">{unit}</span>
      </p>
      <p className="text-xs text-on-surface-variant opacity-60 mt-4">{note}</p>
    </div>
  )
}
