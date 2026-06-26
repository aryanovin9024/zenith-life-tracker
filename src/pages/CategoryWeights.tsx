import { useEffect, useState } from 'react'
import { WeightDonut } from '../components/charts'
import { CATEGORY_LIST } from '../lib/categories'
import { formatMonth, monthStart, today } from '../lib/date'
import { useCategoryWeights, useSetWeight } from '../lib/queries'
import { CATEGORIES, type Category, type CategoryWeight } from '../lib/types'

type Draft = Record<Category, number>

const DEFAULT_DRAFT: Draft = { fitness: 1, work: 1, learning: 1, relationships: 1 }

export function CategoryWeights() {
  const month = monthStart(today())
  const weights = useCategoryWeights(month)
  const setWeight = useSetWeight()
  const [draft, setDraft] = useState<Draft>(DEFAULT_DRAFT)

  useEffect(() => {
    if (!weights.data) return
    const next = { ...DEFAULT_DRAFT }
    for (const w of weights.data) next[w.category] = w.weight
    setDraft(next)
  }, [weights.data])

  const total = CATEGORIES.reduce((sum, c) => sum + draft[c], 0)

  function commit(category: Category, weight: number) {
    setWeight.mutate({ month, category, weight })
  }

  const donutData: CategoryWeight[] = CATEGORIES.map((c) => ({
    month,
    category: c,
    weight: draft[c],
  }))

  const leader = CATEGORY_LIST.reduce((a, b) => (draft[b.key] > draft[a.key] ? b : a))

  return (
    <div className="max-w-[1100px] mx-auto">
      <header className="mb-section-gap">
        <h2 className="font-serif text-headline-md italic mb-2">Monthly Category Weights</h2>
        <p className="text-on-surface-variant opacity-70">
          <span className="text-primary">{formatMonth(month)}</span> weights · previous months
          stay frozen.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <section className="lg:col-span-7 bg-surface-container rounded-2xl ink-border p-8">
          <div className="space-y-10">
            {CATEGORY_LIST.map((c) => (
              <div key={c.key} className="flex flex-col gap-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-serif text-headline-md" style={{ color: c.color }}>
                    {c.label}
                  </h3>
                  <span className="font-serif text-headline-md text-on-surface">
                    {draft[c.key]}
                    <span className="text-sm italic opacity-50 ml-1">
                      / {total} · {total ? Math.round((draft[c.key] / total) * 100) : 0}%
                    </span>
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={draft[c.key]}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, [c.key]: Number(e.target.value) }))
                  }
                  onMouseUp={(e) => commit(c.key, Number(e.currentTarget.value))}
                  onTouchEnd={(e) => commit(c.key, Number(e.currentTarget.value))}
                  onKeyUp={(e) => commit(c.key, Number(e.currentTarget.value))}
                  className="w-full cursor-pointer"
                  style={{ accentColor: c.color }}
                />
                <p className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant/60">
                  {c.blurb}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-ink-border flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary-container text-base">
              check_circle
            </span>
            <span className="text-sm text-on-surface-variant">
              Total weight: <span className="text-on-surface font-semibold">{total}</span>
            </span>
            {setWeight.isPending && (
              <span className="ml-auto text-xs text-on-surface-variant/50">Saving…</span>
            )}
          </div>
        </section>

        <section className="lg:col-span-5 flex flex-col items-center gap-8">
          <WeightDonut weights={donutData} size={208} />
          <div className="w-full">
            <h4 className="font-serif text-headline-md text-on-surface mb-3">Projection</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Your allocation leans most heavily toward{' '}
              <span style={{ color: leader.color }} className="font-semibold">
                {leader.label}
              </span>
              . Each day's overall score is the weighted average of the four categories using
              exactly these numbers — change them and {formatMonth(month)}'s history re-scores
              immediately, while past months stay as they were.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
