export interface GlobalAffixPoolState {
  enabled: boolean
  affixIds: string[]
  greaterAffixIds: string[]
}

export type OptionalAffixesListMode = 'inherited' | 'custom'

export interface RuleOptionalAffixesState {
  removed: boolean
  listMode: OptionalAffixesListMode
  customAffixIds: string[]
  customGreaterAffixIds: string[]
  requiredCount: number
}
