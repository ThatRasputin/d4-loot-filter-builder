import type { GlobalAffixPoolState } from '@core/types/globalAffixPool'
import type { Rule } from '@core/types/rule'

export type OptionalAffixesEffectiveStatus = 'neverTouched' | 'inheritedOn' | 'customOn' | 'removed' | 'paused'

export interface ResolvedOptionalAffixes {
  status: OptionalAffixesEffectiveStatus
  isActive: boolean
  affixIds: string[]
  greaterAffixIds: string[]
  requiredCount: number
}

// The single source of truth for what a rule's optional-affix condition actually resolves to.
// Both the per-rule UI and (eventually) Epic #33's compiler read through this — a rule's stored
// data never encodes the effective outcome directly, since flipping the global switch must not
// require rewriting every rule (see the "lazy materialization" note in the epic plan).
export function resolveOptionalAffixesState(rule: Rule, globalPool: GlobalAffixPoolState): ResolvedOptionalAffixes {
  const record = rule.optionalAffixes

  if (record === null) {
    if (!globalPool.enabled) {
      return { status: 'neverTouched', isActive: false, affixIds: [], greaterAffixIds: [], requiredCount: 0 }
    }
    return {
      status: 'inheritedOn',
      isActive: true,
      affixIds: globalPool.affixIds,
      greaterAffixIds: globalPool.greaterAffixIds,
      requiredCount: 0,
    }
  }

  if (record.removed) {
    return { status: 'removed', isActive: false, affixIds: [], greaterAffixIds: [], requiredCount: record.requiredCount }
  }

  if (record.listMode === 'custom') {
    return {
      status: 'customOn',
      isActive: true,
      affixIds: record.customAffixIds,
      greaterAffixIds: record.customGreaterAffixIds,
      requiredCount: record.requiredCount,
    }
  }

  return {
    status: globalPool.enabled ? 'inheritedOn' : 'paused',
    isActive: globalPool.enabled,
    affixIds: globalPool.affixIds,
    greaterAffixIds: globalPool.greaterAffixIds,
    requiredCount: record.requiredCount,
  }
}
