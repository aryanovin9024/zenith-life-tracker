import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query'
import { supabase } from './supabase'
import type {
  Category,
  CategoryWeight,
  DailyCategoryPct,
  DailyOverallPct,
  NewTask,
  Task,
} from './types'

// ---------- reads ----------

export function useTasks(date: string) {
  return useQuery({
    queryKey: ['tasks', date],
    queryFn: async (): Promise<Task[]> => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('task_date', date)
        .order('category')
        .order('id')
      if (error) throw error
      return (data ?? []) as Task[]
    },
  })
}

export function useOverallSeries(start: string, end: string) {
  return useQuery({
    queryKey: ['overall-series', start, end],
    queryFn: async (): Promise<DailyOverallPct[]> => {
      const { data, error } = await supabase
        .from('daily_overall_pct')
        .select('*')
        .gte('task_date', start)
        .lte('task_date', end)
        .order('task_date')
      if (error) throw error
      return (data ?? []) as DailyOverallPct[]
    },
  })
}

export function useCategorySeries(start: string, end: string) {
  return useQuery({
    queryKey: ['category-series', start, end],
    queryFn: async (): Promise<DailyCategoryPct[]> => {
      const { data, error } = await supabase
        .from('daily_category_pct')
        .select('*')
        .gte('task_date', start)
        .lte('task_date', end)
        .order('task_date')
      if (error) throw error
      return (data ?? []) as DailyCategoryPct[]
    },
  })
}

export function useCategoryWeights(month: string) {
  return useQuery({
    queryKey: ['weights', month],
    queryFn: async (): Promise<CategoryWeight[]> => {
      const { data, error } = await supabase
        .from('category_weights')
        .select('*')
        .eq('month', month)
        .order('category')
      if (error) throw error
      return (data ?? []) as CategoryWeight[]
    },
  })
}

// ---------- writes ----------

// Anything that touches tasks changes both scoring views; weight changes only
// affect the overall view. Invalidate broadly — the dataset is tiny.
function invalidateTaskDerived(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: ['tasks'] })
  qc.invalidateQueries({ queryKey: ['overall-series'] })
  qc.invalidateQueries({ queryKey: ['category-series'] })
}

export function useToggleTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (task: Pick<Task, 'id' | 'completed'>) => {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', task.id)
      if (error) throw error
    },
    onSuccess: () => invalidateTaskDerived(qc),
  })
}

export function useAddTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (task: NewTask) => {
      const { error } = await supabase.from('tasks').insert(task)
      if (error) throw error
    },
    onSuccess: () => invalidateTaskDerived(qc),
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => invalidateTaskDerived(qc),
  })
}

export function useSetWeight() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (w: { month: string; category: Category; weight: number }) => {
      const { error } = await supabase
        .from('category_weights')
        .upsert(w, { onConflict: 'month,category' })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['weights'] })
      qc.invalidateQueries({ queryKey: ['overall-series'] }) // overall is weight-weighted
    },
  })
}
