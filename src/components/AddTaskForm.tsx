import { useState, type FormEvent } from 'react'
import { CATEGORY_LIST, tint } from '../lib/categories'
import { useAddTask } from '../lib/queries'
import type { Category } from '../lib/types'

export function AddTaskForm({
  date,
  variant = 'full',
  onAdded,
}: {
  date: string
  variant?: 'full' | 'inline'
  onAdded?: () => void
}) {
  const add = useAddTask()
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>('fitness')
  const [weight, setWeight] = useState(5)

  async function submit(e: FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    await add.mutateAsync({ category, name: trimmed, weight, task_date: date })
    setName('')
    setWeight(5)
    onAdded?.()
  }

  const pills = (
    <div className="flex flex-wrap gap-2">
      {CATEGORY_LIST.map((c) => {
        const active = category === c.key
        return (
          <button
            key={c.key}
            type="button"
            onClick={() => setCategory(c.key)}
            className="px-4 py-1.5 rounded-full text-label-sm font-label-sm border transition-sink"
            style={{
              color: active ? c.color : undefined,
              borderColor: active ? c.color : '#4d4635',
              backgroundColor: active ? tint(c.color) : 'transparent',
            }}
          >
            {c.label}
          </button>
        )
      })}
    </div>
  )

  if (variant === 'inline') {
    return (
      <form onSubmit={submit} className="flex flex-col gap-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="underline-input font-body-lg"
          placeholder="Add an intention for today…"
        />
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {pills}
          <button
            type="submit"
            disabled={add.isPending || !name.trim()}
            className="px-5 py-2 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest hover:brightness-110 transition-sink disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">
          Task name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="underline-input font-serif text-headline-md"
          placeholder="What needs your attention?"
        />
      </div>

      <div className="flex flex-col gap-4">
        <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">
          Category
        </label>
        {pills}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <label className="font-label-sm text-label-sm uppercase text-on-surface-variant">
            Intensity / weight
          </label>
          <span className="font-serif text-headline-md text-primary">{weight}</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />
      </div>

      <button
        type="submit"
        disabled={add.isPending || !name.trim()}
        className="mt-2 py-4 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest hover:brightness-110 transition-sink disabled:opacity-40 flex justify-center items-center gap-2"
      >
        <span className="material-symbols-outlined text-base">add</span>
        {add.isPending ? 'Committing…' : 'Commit to schedule'}
      </button>
    </form>
  )
}
