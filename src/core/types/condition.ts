export type ConditionType =
  | 'itemProperties'
  | 'rarityMatch'
  | 'codexUpgradeCheck'
  | 'itemTypeMatch'
  | 'hasRequiredAffixes'
  | 'hasOptionalAffixes'

export interface ItemPropertiesCondition {
  id: string
  type: 'itemProperties'
  none: boolean
  ancestral: boolean
  mythic: boolean
}

export interface ItemRarityMatchCondition {
  id: string
  type: 'rarityMatch'
  common: boolean
  magic: boolean
  rare: boolean
  legendary: boolean
  unique: boolean
  mythicUnique: boolean
  talismanSets: boolean
}

export interface CodexUpgradeCheckCondition {
  id: string
  type: 'codexUpgradeCheck'
  codexUpgrade: boolean
}

export interface ItemTypeMatchCondition {
  id: string
  type: 'itemTypeMatch'
  itemTypeIds: string[]
}

export interface HasRequiredAffixesCondition {
  id: string
  type: 'hasRequiredAffixes'
  affixIds: string[]
  greaterAffixIds: string[]
  minimumCount: number
}

export interface HasOptionalAffixesCondition {
  id: string
  type: 'hasOptionalAffixes'
  affixIds: string[]
  greaterAffixIds: string[]
  minimumCount: number
}

export type Condition =
  | ItemPropertiesCondition
  | ItemRarityMatchCondition
  | CodexUpgradeCheckCondition
  | ItemTypeMatchCondition
  | HasRequiredAffixesCondition
  | HasOptionalAffixesCondition
