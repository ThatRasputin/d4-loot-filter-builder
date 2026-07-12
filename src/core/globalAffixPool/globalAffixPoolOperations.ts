import type { GlobalAffixPoolState } from '@core/types/globalAffixPool'

export function updateGlobalAffixPool(
  pool: GlobalAffixPoolState,
  patch: { affixIds?: string[]; greaterAffixIds?: string[] },
): GlobalAffixPoolState {
  return { ...pool, ...patch }
}

export function setGlobalAffixPoolEnabled(pool: GlobalAffixPoolState, enabled: boolean): GlobalAffixPoolState {
  return { ...pool, enabled }
}
