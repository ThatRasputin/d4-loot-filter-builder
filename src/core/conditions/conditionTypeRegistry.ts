import { createId } from '@core/ids'
import type { Condition, ConditionType } from '@core/types/condition'

export const CONDITION_TYPES: ConditionType[] = [
  'itemProperties',
  'rarityMatch',
  'codexUpgradeCheck',
  'itemTypeMatch',
  'hasRequiredAffixes',
  'hasOptionalAffixes',
]

export const CONDITION_TYPE_LABELS: Record<ConditionType, string> = {
  itemProperties: 'Item properties',
  rarityMatch: 'Item rarity match',
  codexUpgradeCheck: 'Codex upgrade check',
  itemTypeMatch: 'Item type match',
  hasRequiredAffixes: 'Has required affixes',
  hasOptionalAffixes: 'Has optional affixes',
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
  if (type === 'itemTypeMatch') {
    return { id: createId(), type: 'itemTypeMatch', itemTypeIds: [] }
  }
  if (type === 'hasRequiredAffixes') {
    return { id: createId(), type: 'hasRequiredAffixes', affixIds: [], greaterAffixIds: [], minimumCount: 0 }
  }
  if (type === 'hasOptionalAffixes') {
    return { id: createId(), type: 'hasOptionalAffixes', affixIds: [], greaterAffixIds: [], minimumCount: 0 }
  }
  return { id: createId(), type: 'codexUpgradeCheck', codexUpgrade: false }
}

export function getAvailableConditionTypes(conditions: Condition[]): ConditionType[] {
  const usedTypes = new Set(conditions.map((condition) => condition.type))
  return CONDITION_TYPES.filter((type) => !usedTypes.has(type))
}
