import { AddTaskForm } from '../components/AddTaskForm'
import { CATEGORY_LIST } from '../lib/categories'
import { formatLong, tomorrow } from '../lib/date'
import { useDeleteTask, useTasks } from '../lib/queries'
import type { Task } from '../lib/types'

function intensity(weight: number): string {
  if (weight <= 3) return 'Low intensity'
  if (weight <= 6) return 'Medium intensity'
  return 'High intensity'
}

export function PlanTomorrow() {
  const date = tomorrow()
  const tasks = useTasks(date)
  const del = useDeleteTask()

  const grouped = CATEGORY_LIST.map((c) => ({
    meta: c,
    items: (tasks.data ?? []).filter((t) => t.category === c.key),
  })).filter((g) => g.items.length > 0)

  const total = tasks.data?.length ?? 0

  return (
    <div className="max-w-[1200px] mx-auto">
      <header className="mb-section-gap">
        <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-surface-variant/70">
          Intention
        </span>
        <h2 className="font-serif text-display-lg-mobile md:text-display-lg text-on-surface mt-2">
          Planning for {formatLong(date)}
        </h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        <section className="lg:col-span-5 bg-surface border border-outline-variant rounded-2xl p-8 midnight-blur">
          <h3 className="font-serif text-headline-md text-primary mb-8">Add to Tomorrow</h3>
          <AddTaskForm date={date} variant="full" />
        </section>

        <section className="lg:col-span-7 lg:pl-12 lg:border-l border-outline-variant/30 flex flex-col gap-10">
          <div className="flex justify-between items-end">
            <h3 className="font-serif text-headline-md text-on-surface">Planned Rhythm</h3>
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
              {total} total {total === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          {tasks.isLoading ? (
            <p className="text-on-surface-variant/60 text-sm">Loading…</p>
          ) : grouped.length === 0 ? (
            <p className="text-on-surface-variant/60 text-sm">
              Nothing planned for tomorrow yet. Commit your first intention on the left.
            </p>
          ) : (
            grouped.map((g) => (
              <div key={g.meta.key} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: g.meta.color }}
                  />
                  <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                    {g.meta.label}
                  </h4>
                  <span className="ml-auto text-on-surface-variant text-label-sm italic">
                    {g.items.length} {g.items.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {g.items.map((t) => (
                    <PlannedRow key={t.id} task={t} onDelete={() => del.mutate(t.id)} />
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  )
}

function PlannedRow({ task, onDelete }: { task: Task; onDelete: () => void }) {
  return (
    <div className="p-5 bg-surface-container-low border border-outline-variant/20 rounded-xl flex justify-between items-center group hover:bg-surface-container transition-all">
      <div className="min-w-0">
        <p className="font-body-lg text-on-surface truncate">{task.name}</p>
        <p className="text-label-sm text-on-surface-variant mt-1">
          {intensity(task.weight)} · weight {task.weight}
        </p>
      </div>
      <button
        onClick={onDelete}
        aria-label="Remove task"
        className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity hover:text-error"
      >
        delete
      </button>
    </div>
  )
}
