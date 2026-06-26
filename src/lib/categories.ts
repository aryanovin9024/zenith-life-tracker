import type { Category } from './types'

export interface CategoryMeta {
  key: Category
  label: string
  color: string // the §2 backbone color (also defined as a CSS var)
  icon: string // Material Symbols glyph name
  blurb: string
}

// Order matters: this is the canonical display order across every screen.
export const CATEGORY_META: Record<Category, CategoryMeta> = {
  fitness: {
    key: 'fitness',
    label: 'Fitness',
    color: '#8a9a5b', // sage green
    icon: 'fitness_center',
    blurb: 'Physical health & recovery',
  },
  work: {
    key: 'work',
    label: 'Work',
    color: '#708090', // slate blue
    icon: 'terminal',
    blurb: 'Career & strategic output',
  },
  learning: {
    key: 'learning',
    label: 'Learning',
    color: '#b87333', // ochre
    icon: 'auto_stories',
    blurb: 'New skills & deep reading',
  },
  relationships: {
    key: 'relationships',
    label: 'Relationships',
    color: '#c04000', // terracotta
    icon: 'favorite',
    blurb: 'Connection & community',
  },
}

export const CATEGORY_LIST: CategoryMeta[] = Object.values(CATEGORY_META)

// A translucent tint of a category color, for chip / icon backgrounds.
export function tint(color: string, alpha = 0.14): string {
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0')
  return `${color}${a}`
}
