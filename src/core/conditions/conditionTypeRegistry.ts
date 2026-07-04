import { createId } from '@core/ids'
import type { Condition, ConditionType } from '@core/types/condition'

export const CONDITION_TYPES: ConditionType[] = ['itemProperties', 'rarityMatch', 'codexUpgradeCheck']

export const CONDITION_TYPE_LABELS: Record<ConditionType, string> = {
  itemProperties: 'Item properties',
  rarityMatch: 'Item rarity match',
  codexUpgradeCheck: 'Codex upgrade check',
}

export function createDefaultCondition(type: ConditionType): Condition {
  if (type === 'itemProperties') {
    return { id: createId(), type: 'itemProperties', none: false, ancestral: false, mythic: false }
  }
  if (type === 'rarityMatch') {
    return {
      id: createId(),
      type: 'rarityMatch',
      common: false,
      magic: false,
      rare: false,
      legendary: false,
      unique: false,
      mythicUnique: false,
      talismanSets: false,
    }
  }
  return { id: createId(), type: 'codexUpgradeCheck', codexUpgrade: false }
}

export function getAvailableConditionTypes(conditions: Condition[]): ConditionType[] {
  const usedTypes = new Set(conditions.map((condition) => condition.type))
  return CONDITION_TYPES.filter((type) => !usedTypes.has(type))
}
