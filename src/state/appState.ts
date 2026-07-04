import type { Rule } from '@core/types/rule'

export interface AppState {
  rules: Rule[]
  recentColors: string[]
}

export function createInitialAppState(): AppState {
  return { rules: [], recentColors: [] }
}
