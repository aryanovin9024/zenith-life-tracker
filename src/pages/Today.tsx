import { useMemo, useState } from 'react'
import { AddTaskForm } from '../components/AddTaskForm'
import { ResonanceChart, WeightDonut } from '../components/charts'
import { Sparkline } from '../components/Sparkline'
import { CATEGORY_LIST, CATEGORY_META, tint } from '../lib/categories'
import { formatLong, formatWeekday, monthStart, today } from '../lib/date'
import { useCategoryWeights, useOverallSeries, useCategorySeries, useTasks, useToggleTask } from '../lib/queries'
import { categoryValues, mergeSeries, overallValues } from '../lib/series'
import type { Category, Task } from '../lib/types'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function pctLabel(v: number | null | undefined): string {
  return v == null ? '—' : String(Math.round(v))
}

export function Today() {
  const date = today()
  const month = monthStart(date)
  const start = month

  const tasks = useTasks(date)
  const overall = useOverallSeries(start, date)
  const category = useCategorySeries(start, date)
  const weights = useCategoryWeights(month)
  const toggle = useToggleTask()
  const [adding, setAdding] = useState(false)

  const rows = useMemo(
    () => mergeSeries(overall.data ?? [], category.data ?? []),
    [overall.data, category.data],
  )
  const todayRow = rows.find((r) => r.date === date)

  const subtitle = useMemo(() => {
    if (!rows.length) return 'A fresh page. Set your intentions for the day.'
    const best = CATEGORY_LIST.map((c) => ({
      label: c.label,
      v: todayRow?.[c.key] ?? -1,
    })).sort((a, b) => b.v - a.v)[0]
    return best && best.v >= 0
      ? `Your instrument shows steady resonance in ${best.label}.`
      : 'No readings yet today — mark an intention complete to begin.'
  }, [rows, todayRow])

  return (
    <div>
      <header className="flex flex-wrap gap-4 justify-between items-end mb-section-gap">
        <div>
          <p className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-surface-variant/60 mb-2">
            {formatWeekday(date)} · {formatLong(date)}
          </p>
          <h2 className="font-serif text-headline-md italic mb-1">{greeting()}.</h2>
          <p className="text-on-surface-variant opacity-70">{subtitle}</p>
        </div>
      </header>

      {/* Stat row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        <div className="p-6 bg-surface-container-high rounded-2xl ink-border midnight-blur flex flex-col justify-between transition-sink relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/20 text-primary">
              <span className="material-symbols-outlined">star_half</span>
            </div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">
              Overall
            </span>
          </div>
          <div>
            <h3 className="font-serif text-signature-num text-primary leading-none">
              {pctLabel(todayRow?.overall)}
              <span className="text-2xl italic ml-1 opacity-60">%</span>
            </h3>
            <Sparkline
              data={overallValues(rows)}
              color="#f2ca50"
              className="w-full h-8 mt-4 opacity-50"
            />
          </div>
        </div>

        {CATEGORY_LIST.map((c) => (
          <div
            key={c.key}
            className="p-6 bg-surface-container rounded-2xl ink-border flex flex-col justify-between transition-sink"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: tint(c.color), color: c.color }}
              >
                <span className="material-symbols-outlined">{c.icon}</span>
              </div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                {c.label}
              </span>
            </div>
            <div>
              <h3 className="font-serif text-signature-num leading-none">
                {pctLabel(todayRow?.[c.key])}
                <span className="text-xl italic opacity-40 ml-1">%</span>
              </h3>
              <Sparkline
                data={categoryValues(rows, c.key)}
                color={c.color}
                className="w-full h-8 mt-4 opacity-40"
              />
            </div>
          </div>
        ))}
      </section>

      {/* Chart + balance */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 p-8 bg-surface-container rounded-2xl ink-border">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-serif text-headline-md italic">Monthly Resonance</h4>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant/60">
              Month to date
            </span>
          </div>
          {rows.length > 1 ? (
            <ResonanceChart rows={rows} />
          ) : (
            <p className="text-on-surface-variant/60 text-sm py-16 text-center">
              Not enough data yet this month to chart.
            </p>
          )}
        </div>

        <div className="p-8 bg-surface-container rounded-2xl ink-border flex flex-col items-center">
          <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-8 self-start">
            Monthly Balance
          </h4>
          {weights.data?.length ? (
            <>
              <WeightDonut weights={weights.data} />
              <div className="mt-8 w-full space-y-3">
                {weights.data.map((w) => (
                  <div key={w.category} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: CATEGORY_META[w.category as Category].color }}
                      />
                      <span className="text-on-surface-variant">
                        {CATEGORY_META[w.category as Category].label}
                      </span>
                    </div>
                    <span className="font-semibold">{w.weight}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-on-surface-variant/60 text-sm py-16 text-center">
              No weights set for this month.
            </p>
          )}
        </div>
      </section>

      {/* Tasks */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface rounded-2xl ink-border p-8">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-serif text-headline-md italic">Today's Intentions</h4>
            <button
              onClick={() => setAdding((v) => !v)}
              className="text-primary hover:opacity-80 transition-opacity"
              aria-label="Add intention"
            >
              <span className="material-symbols-outlined">
                {adding ? 'remove_circle' : 'add_circle'}
              </span>
            </button>
          </div>

          {adding && (
            <div className="mb-8 pb-8 border-b border-ink-border">
              <AddTaskForm date={date} variant="inline" onAdded={() => setAdding(false)} />
            </div>
          )}

          {tasks.isLoading ? (
            <p className="text-on-surface-variant/60 text-sm">Loading…</p>
          ) : tasks.data?.length ? (
            <div className="space-y-5 max-h-96 overflow-y-auto pr-3 custom-scroll">
              {tasks.data.map((t) => (
                <TaskRow key={t.id} task={t} onToggle={() => toggle.mutate(t)} />
              ))}
            </div>
          ) : (
            <p className="text-on-surface-variant/60 text-sm">
              Nothing scheduled for today. Add an intention, or plan ahead.
            </p>
          )}
        </div>

        <div className="bg-surface rounded-2xl ink-border p-8">
          <h4 className="font-serif text-headline-md italic mb-8">Recent Days</h4>
          <div className="space-y-0">
            {[...rows]
              .filter((r) => r.overall != null)
              .slice(-7)
              .reverse()
              .map((r) => (
                <div key={r.date} className="relative pl-8 pb-7 timeline-item">
                  <div className="timeline-line" />
                  <div
                    className="absolute left-0 top-1 w-4 h-4 rounded-full ring-4 ring-surface"
                    style={{ backgroundColor: '#f2ca50' }}
                  />
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-sm font-semibold text-on-surface">{formatWeekday(r.date)}</h5>
                      <p className="text-xs text-on-surface-variant opacity-60 mt-1">
                        {formatLong(r.date)}
                      </p>
                    </div>
                    <span className="font-serif text-headline-md text-primary">
                      {Math.round(r.overall as number)}%
                    </span>
                  </div>
                </div>
              ))}
            {!rows.some((r) => r.overall != null) && (
              <p className="text-on-surface-variant/60 text-sm">No history yet this month.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function TaskRow({ task, onToggle }: { task: Task; onToggle: () => void }) {
  const meta = CATEGORY_META[task.category]
  return (
    <div
      onClick={onToggle}
      className={`flex items-center gap-4 cursor-pointer group ${task.completed ? 'opacity-40' : ''}`}
    >
      <div
        className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
        style={{
          borderColor: meta.color,
          backgroundColor: task.completed ? meta.color : 'transparent',
        }}
      >
        {task.completed && (
          <span className="material-symbols-outlined text-background text-sm font-bold">check</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-body-md truncate ${task.completed ? 'line-through' : 'text-on-surface'}`}>
          {task.name}
        </p>
      </div>
      <span
        className="px-3 py-1 rounded-full text-[10px] font-label-sm uppercase shrink-0"
        style={{ backgroundColor: tint(meta.color), color: meta.color }}
      >
        {meta.label}
      </span>
    </div>
  )
}
