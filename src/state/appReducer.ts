import { pushRecentColor } from '@core/colors/recentColors'
import { addCondition, removeCondition, reorderConditions, updateCondition } from '@core/conditions/conditionOperations'
import { setGlobalAffixPoolEnabled, updateGlobalAffixPool } from '@core/globalAffixPool/globalAffixPoolOperations'
import {
  addRule,
  duplicateRule,
  removeRule,
  renameRule,
  reorderRules,
  setAllRulesEnabled,
  setRuleColor,
  setRuleVisibility,
  toggleRuleEnabled,
  updateRuleConditions,
} from '@core/rules/ruleOperations'
import type { AppAction } from './actions'
import type { AppState } from './appState'

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_RULE':
      return { ...state, rules: addRule(state.rules) }

    case 'SET_GLOBAL_AFFIX_POOL_ENABLED':
      return { ...state, globalAffixPool: setGlobalAffixPoolEnabled(state.globalAffixPool, action.enabled) }

    case 'UPDATE_GLOBAL_AFFIX_POOL':
      return { ...state, globalAffixPool: updateGlobalAffixPool(state.globalAffixPool, action.patch) }

    case 'REMOVE_RULE':
      return { ...state, rules: removeRule(state.rules, action.ruleId) }

    case 'DUPLICATE_RULE':
      return { ...state, rules: duplicateRule(state.rules, action.ruleId) }

    case 'REORDER_RULES':
      return { ...state, rules: reorderRules(state.rules, action.fromIndex, action.toIndex) }

    case 'RENAME_RULE':
      return { ...state, rules: renameRule(state.rules, action.ruleId, action.name) }

    case 'TOGGLE_RULE_ENABLED':
      return { ...state, rules: toggleRuleEnabled(state.rules, action.ruleId) }

    case 'SET_ALL_RULES_ENABLED':
      return { ...state, rules: setAllRulesEnabled(state.rules, action.enabled) }

    case 'SET_RULE_VISIBILITY':
      return { ...state, rules: setRuleVisibility(state.rules, action.ruleId, action.visibility) }

    case 'SET_RULE_COLOR':
      return {
        ...state,
        rules: setRuleColor(state.rules, action.ruleId, action.color),
        recentColors: pushRecentColor(state.recentColors, action.color),
      }

    case 'ADD_CONDITION':
      return {
        ...state,
        rules: updateRuleConditions(state.rules, action.ruleId, (conditions) =>
          addCondition(conditions, action.condition),
        ),
      }

    case 'REMOVE_CONDITION':
      return {
        ...state,
        rules: updateRuleConditions(state.rules, action.ruleId, (conditions) =>
          removeCondition(conditions, action.conditionId),
        ),
      }

    case 'REORDER_CONDITIONS':
      return {
        ...state,
        rules: updateRuleConditions(state.rules, action.ruleId, (conditions) =>
          reorderConditions(conditions, action.fromIndex, action.toIndex),
        ),
      }

    case 'UPDATE_CONDITION':
      return {
        ...state,
        rules: updateRuleConditions(state.rules, action.ruleId, (conditions) =>
          updateCondition(conditions, action.conditionId, action.patch),
        ),
      }

    default: {
      const exhaustiveCheck: never = action
      return exhaustiveCheck
    }
  }
}
