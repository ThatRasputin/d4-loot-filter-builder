import { describe, it, expect } from 'vitest'
import type { GlobalAffixPoolState, RuleOptionalAffixesState } from '@core/types/globalAffixPool'
import type { Rule } from '@core/types/rule'
import {
  setRuleOptionalAffixesListMode,
  setRuleOptionalAffixesCount,
  setRuleOptionalAffixesRemoved,
  updateRuleOptionalAffixesCustomList,
} from './ruleOptionalAffixesOperations'

function makeRule(optionalAffixes: RuleOptionalAffixesState | null, id = 'rule-1'): Rule {
  return {
    id,
    name: 'Test rule',
    enabled: true,
    visibility: 'show',
    color: null,
    conditions: [],
    optionalAffixes,
  }
}

function makePool(overrides: Partial<GlobalAffixPoolState> = {}): GlobalAffixPoolState {
  return { enabled: true, affixIds: ['global-a'], greaterAffixIds: ['global-g'], ...overrides }
}

describe('setRuleOptionalAffixesListMode', () => {
  it('materializes a never-touched rule when switching to custom, snapshotting the current global list', () => {
    const rules = [makeRule(null)]
    const pool = makePool()
    const result = setRuleOptionalAffixesListMode(rules, 'rule-1', 'custom', pool)
    expect(result[0].optionalAffixes).toEqual({
      removed: false,
      listMode: 'custom',
      customAffixIds: ['global-a'],
      customGreaterAffixIds: ['global-g'],
      requiredCount: 0,
    })
  })

  it('takes a fresh snapshot every time custom is chosen, discarding an earlier custom list', () => {
    const rules = [
      makeRule({
        removed: false,
        listMode: 'custom',
        customAffixIds: ['stale'],
        customGreaterAffixIds: ['stale-g'],
        requiredCount: 2,
      }),
    ]
    const pool = makePool({ affixIds: ['fresh-a'], greaterAffixIds: ['fresh-g'] })
    const result = setRuleOptionalAffixesListMode(rules, 'rule-1', 'custom', pool)
    expect(result[0].optionalAffixes).toMatchObject({
      listMode: 'custom',
      customAffixIds: ['fresh-a'],
      customGreaterAffixIds: ['fresh-g'],
      requiredCount: 2,
    })
  })

  it('switches back to inherited without touching requiredCount', () => {
    const rules = [
      makeRule({
        removed: false,
        listMode: 'custom',
        customAffixIds: ['a'],
        customGreaterAffixIds: [],
        requiredCount: 3,
      }),
    ]
    const result = setRuleOptionalAffixesListMode(rules, 'rule-1', 'inherited', makePool())
    expect(result[0].optionalAffixes).toMatchObject({ listMode: 'inherited', requiredCount: 3 })
  })

  it('leaves other rules untouched', () => {
    const other = makeRule(null, 'rule-2')
    const rules = [makeRule(null), other]
    const result = setRuleOptionalAffixesListMode(rules, 'rule-1', 'custom', makePool())
    expect(result[1]).toBe(other)
  })
})

describe('updateRuleOptionalAffixesCustomList', () => {
  it('materializes a never-touched rule and applies the patch', () => {
    const rules = [makeRule(null)]
    const result = updateRuleOptionalAffixesCustomList(rules, 'rule-1', { customAffixIds: ['x'] })
    expect(result[0].optionalAffixes).toMatchObject({ customAffixIds: ['x'], customGreaterAffixIds: [] })
  })

  it('leaves omitted fields unchanged on an already-materialized rule', () => {
    const rules = [
      makeRule({
        removed: false,
        listMode: 'custom',
        customAffixIds: ['a'],
        customGreaterAffixIds: ['g'],
        requiredCount: 1,
      }),
    ]
    const result = updateRuleOptionalAffixesCustomList(rules, 'rule-1', { customAffixIds: ['a', 'b'] })
    expect(result[0].optionalAffixes).toMatchObject({ customAffixIds: ['a', 'b'], customGreaterAffixIds: ['g'] })
  })
})

describe('setRuleOptionalAffixesRemoved', () => {
  it('materializes a never-touched rule when removing, defaulting everything else', () => {
    const rules = [makeRule(null)]
    const result = setRuleOptionalAffixesRemoved(rules, 'rule-1', true)
    expect(result[0].optionalAffixes).toEqual({
      removed: true,
      listMode: 'inherited',
      customAffixIds: [],
      customGreaterAffixIds: [],
      requiredCount: 0,
    })
  })

  it('preserves the custom list and count while removed, so re-adding restores them exactly', () => {
    const record: RuleOptionalAffixesState = {
      removed: false,
      listMode: 'custom',
      customAffixIds: ['a'],
      customGreaterAffixIds: ['g'],
      requiredCount: 3,
    }
    const removed = setRuleOptionalAffixesRemoved([makeRule(record)], 'rule-1', true)
    expect(removed[0].optionalAffixes).toEqual({ ...record, removed: true })

    const restored = setRuleOptionalAffixesRemoved(removed, 'rule-1', false)
    expect(restored[0].optionalAffixes).toEqual(record)
  })

  it('leaves other rules untouched', () => {
    const other = makeRule(null, 'rule-2')
    const result = setRuleOptionalAffixesRemoved([makeRule(null), other], 'rule-1', true)
    expect(result[1]).toBe(other)
  })
})

describe('setRuleOptionalAffixesCount', () => {
  it('materializes a never-touched rule with the given count, defaulting listMode to inherited', () => {
    const rules = [makeRule(null)]
    const result = setRuleOptionalAffixesCount(rules, 'rule-1', 2)
    expect(result[0].optionalAffixes).toMatchObject({ listMode: 'inherited', requiredCount: 2 })
  })

  it('updates only the count on an already-materialized custom rule, leaving the list untouched', () => {
    const rules = [
      makeRule({
        removed: false,
        listMode: 'custom',
        customAffixIds: ['a'],
        customGreaterAffixIds: [],
        requiredCount: 1,
      }),
    ]
    const result = setRuleOptionalAffixesCount(rules, 'rule-1', 4)
    expect(result[0].optionalAffixes).toMatchObject({ listMode: 'custom', customAffixIds: ['a'], requiredCount: 4 })
  })
})
