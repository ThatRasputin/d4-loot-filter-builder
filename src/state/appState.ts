import type { GlobalAffixPoolState } from '@core/types/globalAffixPool'
import type { Rule } from '@core/types/rule'

export interface AppState {
  rules: Rule[]
  recentColors: string[]
  globalAffixPool: GlobalAffixPoolState
}

export function createInitialAppState(): AppState {
  return { rules: [], recentColors: [], globalAffixPool: { enabled: false, affixIds: [], greaterAffixIds: [] } }
}
