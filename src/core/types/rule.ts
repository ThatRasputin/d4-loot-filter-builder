import type { Condition } from './condition'
import type { RuleOptionalAffixesState } from './globalAffixPool'

export type RuleVisibility = 'show' | 'recolor' | 'hideText' | 'hideAll'

export interface Rule {
  id: string
  name: string
  enabled: boolean
  visibility: RuleVisibility
  color: string | null
  conditions: Condition[]
  optionalAffixes: RuleOptionalAffixesState | null
}
