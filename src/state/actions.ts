import type { ConditionPatch } from '@core/conditions/conditionOperations'
import type { Condition } from '@core/types/condition'
import type { OptionalAffixesListMode } from '@core/types/globalAffixPool'
import type { RuleVisibility } from '@core/types/rule'

export type AppAction =
  | { type: 'ADD_RULE' }
  | { type: 'SET_GLOBAL_AFFIX_POOL_ENABLED'; enabled: boolean }
  | { type: 'UPDATE_GLOBAL_AFFIX_POOL'; patch: { affixIds?: string[]; greaterAffixIds?: string[] } }
  | { type: 'SET_RULE_OPTIONAL_AFFIXES_LIST_MODE'; ruleId: string; listMode: OptionalAffixesListMode }
  | {
      type: 'UPDATE_RULE_OPTIONAL_AFFIXES_CUSTOM_LIST'
      ruleId: string
      patch: { customAffixIds?: string[]; customGreaterAffixIds?: string[] }
    }
  | { type: 'SET_RULE_OPTIONAL_AFFIXES_COUNT'; ruleId: string; requiredCount: number }
  | { type: 'SET_RULE_OPTIONAL_AFFIXES_REMOVED'; ruleId: string; removed: boolean }
  | { type: 'REMOVE_RULE'; ruleId: string }
  | { type: 'DUPLICATE_RULE'; ruleId: string }
  | { type: 'REORDER_RULES'; fromIndex: number; toIndex: number }
  | { type: 'RENAME_RULE'; ruleId: string; name: string }
  | { type: 'TOGGLE_RULE_ENABLED'; ruleId: string }
  | { type: 'SET_ALL_RULES_ENABLED'; enabled: boolean }
  | { type: 'SET_RULE_VISIBILITY'; ruleId: string; visibility: RuleVisibility }
  | { type: 'SET_RULE_COLOR'; ruleId: string; color: string }
  | { type: 'ADD_CONDITION'; ruleId: string; condition: Condition }
  | { type: 'REMOVE_CONDITION'; ruleId: string; conditionId: string }
  | { type: 'REORDER_CONDITIONS'; ruleId: string; fromIndex: number; toIndex: number }
  | { type: 'UPDATE_CONDITION'; ruleId: string; conditionId: string; patch: ConditionPatch }
