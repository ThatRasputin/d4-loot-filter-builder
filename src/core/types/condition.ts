export type ConditionType = 'itemProperties' | 'rarityMatch'

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

export type Condition = ItemPropertiesCondition | ItemRarityMatchCondition
