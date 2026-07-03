import type { Condition } from './condition'

export type RuleVisibility = 'show' | 'recolor' | 'hideText' | 'hideAll'

export interface Rule {
  id: string
  name: string
  enabled: boolean
  visibility: RuleVisibility
  color: string | null
  conditions: Condition[]
}
