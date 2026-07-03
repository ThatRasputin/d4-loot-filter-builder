import { createId } from '@core/ids'
import type { Condition } from '@core/types/condition'
import type { Rule, RuleVisibility } from '@core/types/rule'

function cloneConditionWithFreshId(condition: Condition): Condition {
  return { ...condition, id: createId() }
}

function updateRule(rules: Rule[], ruleId: string, updater: (rule: Rule) => Rule): Rule[] {
  return rules.map((rule) => (rule.id === ruleId ? updater(rule) : rule))
}

export function addRule(rules: Rule[]): Rule[] {
  const newRule: Rule = {
    id: createId(),
    name: 'New rule',
    enabled: true,
    visibility: 'recolor',
    color: '#8a8a86',
    conditions: [],
  }
  return [...rules, newRule]
}

export function removeRule(rules: Rule[], ruleId: string): Rule[] {
  return rules.filter((rule) => rule.id !== ruleId)
}

export function duplicateRule(rules: Rule[], ruleId: string): Rule[] {
  const index = rules.findIndex((rule) => rule.id === ruleId)
  if (index === -1) return rules

  const original = rules[index]
  const clone: Rule = {
    ...original,
    id: createId(),
    name: `${original.name} copy`,
    conditions: original.conditions.map(cloneConditionWithFreshId),
  }

  const next = [...rules]
  next.splice(index + 1, 0, clone)
  return next
}

export function reorderRules(rules: Rule[], fromIndex: number, toIndex: number): Rule[] {
  const next = [...rules]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

export function renameRule(rules: Rule[], ruleId: string, name: string): Rule[] {
  return updateRule(rules, ruleId, (rule) => ({ ...rule, name }))
}

export function toggleRuleEnabled(rules: Rule[], ruleId: string): Rule[] {
  return updateRule(rules, ruleId, (rule) => ({ ...rule, enabled: !rule.enabled }))
}

export function setAllRulesEnabled(rules: Rule[], enabled: boolean): Rule[] {
  return rules.map((rule) => ({ ...rule, enabled }))
}

export function setRuleVisibility(rules: Rule[], ruleId: string, visibility: RuleVisibility): Rule[] {
  return updateRule(rules, ruleId, (rule) => ({ ...rule, visibility }))
}

export function setRuleColor(rules: Rule[], ruleId: string, color: string): Rule[] {
  return updateRule(rules, ruleId, (rule) => ({ ...rule, color }))
}

export function updateRuleConditions(
  rules: Rule[],
  ruleId: string,
  updater: (conditions: Condition[]) => Condition[],
): Rule[] {
  return updateRule(rules, ruleId, (rule) => ({ ...rule, conditions: updater(rule.conditions) }))
}
