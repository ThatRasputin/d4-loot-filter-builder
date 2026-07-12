import type { GlobalAffixPoolState, OptionalAffixesListMode, RuleOptionalAffixesState } from '@core/types/globalAffixPool'
import type { Rule } from '@core/types/rule'
import { updateRuleOptionalAffixes } from './ruleOperations'

function ensureMaterialized(current: RuleOptionalAffixesState | null): RuleOptionalAffixesState {
  return current ?? { removed: false, listMode: 'inherited', customAffixIds: [], customGreaterAffixIds: [], requiredCount: 0 }
}

// Switching to 'custom' always takes a fresh snapshot of the *current* global list — the
// literal reading of #18's "forks the current global list" — discarding any earlier custom
// edits from a prior customize -> reset -> customize cycle rather than trying to restore them.
export function setRuleOptionalAffixesListMode(
  rules: Rule[],
  ruleId: string,
  listMode: OptionalAffixesListMode,
  globalPool: GlobalAffixPoolState,
): Rule[] {
  return updateRuleOptionalAffixes(rules, ruleId, (current) => {
    const materialized = ensureMaterialized(current)
    if (listMode === 'inherited') {
      return { ...materialized, listMode: 'inherited' }
    }
    return {
      ...materialized,
      listMode: 'custom',
      customAffixIds: [...globalPool.affixIds],
      customGreaterAffixIds: [...globalPool.greaterAffixIds],
    }
  })
}

export function updateRuleOptionalAffixesCustomList(
  rules: Rule[],
  ruleId: string,
  patch: { customAffixIds?: string[]; customGreaterAffixIds?: string[] },
): Rule[] {
  return updateRuleOptionalAffixes(rules, ruleId, (current) => ({ ...ensureMaterialized(current), ...patch }))
}

// Always independent of listMode/removed/global state (#17) — the count is editable regardless
// of what else is going on with the rule's optional-affix configuration.
export function setRuleOptionalAffixesCount(rules: Rule[], ruleId: string, requiredCount: number): Rule[] {
  return updateRuleOptionalAffixes(rules, ruleId, (current) => ({ ...ensureMaterialized(current), requiredCount }))
}
