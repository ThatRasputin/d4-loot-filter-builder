import { describe, it, expect } from 'vitest'
import type { GlobalAffixPoolState, RuleOptionalAffixesState } from '@core/types/globalAffixPool'
import type { Rule } from '@core/types/rule'
import { resolveOptionalAffixesState } from './resolveOptionalAffixesState'

function makeRule(optionalAffixes: RuleOptionalAffixesState | null): Rule {
  return {
    id: 'rule-1',
    name: 'Test rule',
    enabled: true,
    visibility: 'show',
    color: null,
    conditions: [],
    optionalAffixes,
  }
}

function makePool(overrides: Partial<GlobalAffixPoolState> = {}): GlobalAffixPoolState {
  return { enabled: false, affixIds: ['global-a'], greaterAffixIds: ['global-g'], ...overrides }
}

describe('resolveOptionalAffixesState', () => {
  it('resolves to neverTouched when the rule has no record and the global pool is off', () => {
    const result = resolveOptionalAffixesState(makeRule(null), makePool({ enabled: false }))
    expect(result.status).toBe('neverTouched')
    expect(result.isActive).toBe(false)
    expect(result.affixIds).toEqual([])
    expect(result.greaterAffixIds).toEqual([])
    expect(result.requiredCount).toBe(0)
  })

  it('resolves to inheritedOn when the rule has no record and the global pool is on', () => {
    const pool = makePool({ enabled: true })
    const result = resolveOptionalAffixesState(makeRule(null), pool)
    expect(result.status).toBe('inheritedOn')
    expect(result.isActive).toBe(true)
    expect(result.affixIds).toEqual(pool.affixIds)
    expect(result.greaterAffixIds).toEqual(pool.greaterAffixIds)
    expect(result.requiredCount).toBe(0)
  })

  it('resolves to inheritedOn when the record is materialized, inherited, and the global pool is on', () => {
    const pool = makePool({ enabled: true })
    const rule = makeRule({
      removed: false,
      listMode: 'inherited',
      customAffixIds: [],
      customGreaterAffixIds: [],
      requiredCount: 2,
    })
    const result = resolveOptionalAffixesState(rule, pool)
    expect(result.status).toBe('inheritedOn')
    expect(result.isActive).toBe(true)
    expect(result.affixIds).toEqual(pool.affixIds)
    expect(result.greaterAffixIds).toEqual(pool.greaterAffixIds)
    expect(result.requiredCount).toBe(2)
  })

  it('resolves to paused when the record is materialized, inherited, and the global pool is off', () => {
    const pool = makePool({ enabled: false })
    const rule = makeRule({
      removed: false,
      listMode: 'inherited',
      customAffixIds: [],
      customGreaterAffixIds: [],
      requiredCount: 2,
    })
    const result = resolveOptionalAffixesState(rule, pool)
    expect(result.status).toBe('paused')
    expect(result.isActive).toBe(false)
    expect(result.affixIds).toEqual(pool.affixIds)
    expect(result.greaterAffixIds).toEqual(pool.greaterAffixIds)
    expect(result.requiredCount).toBe(2)
  })

  it('resolves to customOn regardless of the global pool state', () => {
    const rule = makeRule({
      removed: false,
      listMode: 'custom',
      customAffixIds: ['custom-a'],
      customGreaterAffixIds: ['custom-g'],
      requiredCount: 3,
    })
    const enabledResult = resolveOptionalAffixesState(rule, makePool({ enabled: true }))
    const disabledResult = resolveOptionalAffixesState(rule, makePool({ enabled: false }))

    for (const result of [enabledResult, disabledResult]) {
      expect(result.status).toBe('customOn')
      expect(result.isActive).toBe(true)
      expect(result.affixIds).toEqual(['custom-a'])
      expect(result.greaterAffixIds).toEqual(['custom-g'])
      expect(result.requiredCount).toBe(3)
    }
  })

  it('resolves to removed regardless of listMode or global pool state', () => {
    const rule = makeRule({
      removed: true,
      listMode: 'custom',
      customAffixIds: ['custom-a'],
      customGreaterAffixIds: [],
      requiredCount: 5,
    })
    const result = resolveOptionalAffixesState(rule, makePool({ enabled: true }))
    expect(result.status).toBe('removed')
    expect(result.isActive).toBe(false)
    expect(result.requiredCount).toBe(5)
  })
})
