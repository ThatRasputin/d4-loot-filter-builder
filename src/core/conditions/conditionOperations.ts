import type { Condition, ItemPropertiesCondition, ItemRarityMatchCondition } from '@core/types/condition'

export function addCondition(conditions: Condition[], condition: Condition): Condition[] {
  return [...conditions, condition]
}

export function removeCondition(conditions: Condition[], conditionId: string): Condition[] {
  return conditions.filter((condition) => condition.id !== conditionId)
}

export function reorderConditions(conditions: Condition[], fromIndex: number, toIndex: number): Condition[] {
  const next = [...conditions]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

// Condition is a discriminated union, so a spread of two union members can't be
// checked exactly against Condition by the type checker. The patch type covers
// every field across all variants (all optional), and callers are responsible
// for only patching fields that belong to the condition's actual variant.
export type ConditionPatch = Partial<ItemPropertiesCondition> & Partial<ItemRarityMatchCondition>

export function updateCondition(conditions: Condition[], conditionId: string, patch: ConditionPatch): Condition[] {
  return conditions.map((condition) =>
    condition.id === conditionId ? ({ ...condition, ...patch } as Condition) : condition,
  )
}
