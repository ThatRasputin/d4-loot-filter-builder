import { describe, it, expect } from 'vitest'
import type { Rule } from '@core/types/rule'
import {
  addRule,
  removeRule,
  duplicateRule,
  reorderRules,
  renameRule,
  toggleRuleEnabled,
  setAllRulesEnabled,
  setRuleVisibility,
  setRuleColor,
  updateRuleConditions,
} from './ruleOperations'

function makeRule(overrides: Partial<Rule> = {}): Rule {
  return {
    id: 'rule-1',
    name: 'Test rule',
    enabled: true,
    visibility: 'recolor',
    color: '#ffffff',
    conditions: [],
    ...overrides,
  }
}

describe('addRule', () => {
  it('appends a new rule with a fresh id and the validated default rule shape', () => {
    const rules = [makeRule()]
    const result = addRule(rules)
    expect(result).toHaveLength(2)
    expect(result[1].id).not.toBe('rule-1')
    // Defaults matched exactly to the validated mockup, not just "some" sensible values.
    expect(result[1]).toMatchObject({
      name: 'New rule',
      enabled: true,
      visibility: 'recolor',
      color: '#8a8a86',
      conditions: [],
    })
  })

  it('does not mutate the original array', () => {
    const rules = [makeRule()]
    addRule(rules)
    expect(rules).toHaveLength(1)
  })
})

describe('removeRule', () => {
  it('filters out the rule with the matching id', () => {
    const rules = [makeRule({ id: 'a' }), makeRule({ id: 'b' })]
    const result = removeRule(rules, 'a')
    expect(result.map((r) => r.id)).toEqual(['b'])
  })

  it('is a no-op when the id is not found', () => {
    const rules = [makeRule({ id: 'a' })]
    const result = removeRule(rules, 'missing')
    expect(result).toEqual(rules)
  })
})

describe('duplicateRule', () => {
  it('clones the rule with a fresh id, inserted immediately after the original', () => {
    const rules = [makeRule({ id: 'a' }), makeRule({ id: 'b' })]
    const result = duplicateRule(rules, 'a')
    expect(result).toHaveLength(3)
    expect(result[0].id).toBe('a')
    expect(result[1].id).not.toBe('a')
    expect(result[2].id).toBe('b')
  })

  it('appends " copy" to the cloned rule\'s name, matching the validated mockup behavior', () => {
    const rules = [makeRule({ id: 'a', name: 'Arm Slot' })]
    const result = duplicateRule(rules, 'a')
    expect(result[1].name).toBe('Arm Slot copy')
    expect(result[0].name).toBe('Arm Slot')
  })

  it('assigns fresh ids to every cloned condition, not just the rule', () => {
    const original = makeRule({
      id: 'a',
      conditions: [{ id: 'cond-1', type: 'itemProperties', none: false, ancestral: true, mythic: false }],
    })
    const result = duplicateRule([original], 'a')
    const clone = result[1]
    expect(clone.conditions[0].id).not.toBe('cond-1')
    expect(clone.conditions[0]).toMatchObject({ none: false, ancestral: true, mythic: false })
  })

  it('is a no-op when the id is not found', () => {
    const rules = [makeRule({ id: 'a' })]
    const result = duplicateRule(rules, 'missing')
    expect(result).toEqual(rules)
  })
})

describe('reorderRules', () => {
  it('moves a rule from one index to another', () => {
    const rules = [makeRule({ id: 'a' }), makeRule({ id: 'b' }), makeRule({ id: 'c' })]
    const result = reorderRules(rules, 0, 2)
    expect(result.map((r) => r.id)).toEqual(['b', 'c', 'a'])
  })

  it('handles moving an item earlier in the array', () => {
    const rules = [makeRule({ id: 'a' }), makeRule({ id: 'b' }), makeRule({ id: 'c' })]
    const result = reorderRules(rules, 2, 0)
    expect(result.map((r) => r.id)).toEqual(['c', 'a', 'b'])
  })
})

describe('renameRule', () => {
  it('updates only the matching rule name', () => {
    const rules = [makeRule({ id: 'a', name: 'Old' }), makeRule({ id: 'b', name: 'Other' })]
    const result = renameRule(rules, 'a', 'New')
    expect(result[0].name).toBe('New')
    expect(result[1].name).toBe('Other')
  })
})

describe('toggleRuleEnabled', () => {
  it('flips the enabled boolean on the matching rule', () => {
    const rules = [makeRule({ id: 'a', enabled: true })]
    const result = toggleRuleEnabled(rules, 'a')
    expect(result[0].enabled).toBe(false)
    const result2 = toggleRuleEnabled(result, 'a')
    expect(result2[0].enabled).toBe(true)
  })
})

describe('setAllRulesEnabled', () => {
  it('sets every rule to the given enabled value', () => {
    const rules = [makeRule({ id: 'a', enabled: true }), makeRule({ id: 'b', enabled: false })]
    const result = setAllRulesEnabled(rules, false)
    expect(result.every((r) => r.enabled === false)).toBe(true)
  })
})

describe('setRuleVisibility', () => {
  it('updates only the matching rule visibility', () => {
    const rules = [makeRule({ id: 'a', visibility: 'show' })]
    const result = setRuleVisibility(rules, 'a', 'hideAll')
    expect(result[0].visibility).toBe('hideAll')
  })
})

describe('setRuleColor', () => {
  it('updates only the matching rule color', () => {
    const rules = [makeRule({ id: 'a', color: '#000000' })]
    const result = setRuleColor(rules, 'a', '#ff0000')
    expect(result[0].color).toBe('#ff0000')
  })
})

describe('updateRuleConditions', () => {
  it('applies the updater function to the matching rule\'s conditions and leaves other rules untouched', () => {
    const rules = [makeRule({ id: 'a', conditions: [] }), makeRule({ id: 'b', conditions: [] })]
    const newCondition = { id: 'c1', type: 'itemProperties' as const, none: false, ancestral: false, mythic: false }
    const result = updateRuleConditions(rules, 'a', (conditions) => [...conditions, newCondition])
    expect(result[0].conditions).toEqual([newCondition])
    expect(result[1].conditions).toEqual([])
  })
})
