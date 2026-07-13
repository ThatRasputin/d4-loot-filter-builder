import { describe, it, expect } from 'vitest'
import type { GlobalAffixPoolState, RuleOptionalAffixesState } from '@core/types/globalAffixPool'
import type { HasRequiredAffixesCondition } from '@core/types/condition'
import type { Rule } from '@core/types/rule'
import { computeMinNeededAffixCount, computeAffixCountWarningTier, resolveAffixCountWarning } from './affixCountWarning'

function makeRequiredCondition(overrides: Partial<HasRequiredAffixesCondition> = {}): HasRequiredAffixesCondition {
  return { id: 'cond-required', type: 'hasRequiredAffixes', affixIds: [], greaterAffixIds: [], minimumCount: 0, ...overrides }
}

function makeRule(overrides: Partial<Rule> = {}): Rule {
  return {
    id: 'rule-1',
    name: 'Test rule',
    enabled: true,
    visibility: 'show',
    color: null,
    conditions: [],
    optionalAffixes: null,
    ...overrides,
  }
}

function makePool(overrides: Partial<GlobalAffixPoolState> = {}): GlobalAffixPoolState {
  return { enabled: false, affixIds: [], greaterAffixIds: [], ...overrides }
}

describe('computeMinNeededAffixCount', () => {
  it('sums required and optional minimums when the lists share no affixes', () => {
    const required = { affixIds: ['a', 'b'], greaterAffixIds: [], minimumCount: 2 }
    const optional = { affixIds: ['c'], greaterAffixIds: [], requiredCount: 1 }
    expect(computeMinNeededAffixCount(required, optional)).toBe(3)
  })

  it('subtracts the overlap between required and optional affix ids', () => {
    const required = { affixIds: ['a', 'b'], greaterAffixIds: [], minimumCount: 2 }
    const optional = { affixIds: ['b', 'c'], greaterAffixIds: [], requiredCount: 2 }
    expect(computeMinNeededAffixCount(required, optional)).toBe(3)
  })

  it('counts an affix shared via the greater-affix lists as overlap too', () => {
    const required = { affixIds: [], greaterAffixIds: ['x'], minimumCount: 1 }
    const optional = { affixIds: ['x'], greaterAffixIds: [], requiredCount: 1 }
    expect(computeMinNeededAffixCount(required, optional)).toBe(1)
  })

  it('does not double-count the same affix id appearing in both of one side’s lists', () => {
    const required = { affixIds: ['a'], greaterAffixIds: ['a'], minimumCount: 1 }
    const optional = { affixIds: ['a'], greaterAffixIds: [], requiredCount: 1 }
    expect(computeMinNeededAffixCount(required, optional)).toBe(1)
  })
})

describe('computeAffixCountWarningTier', () => {
  it('returns null at and below the typical non-tempered affix count', () => {
    expect(computeAffixCountWarningTier(0)).toBe(null)
    expect(computeAffixCountWarningTier(4)).toBe(null)
  })

  it('returns notice above 4 and at 6', () => {
    expect(computeAffixCountWarningTier(5)).toBe('notice')
    expect(computeAffixCountWarningTier(6)).toBe('notice')
  })

  it('returns danger above the max possible even with full tempering', () => {
    expect(computeAffixCountWarningTier(7)).toBe('danger')
  })
})

describe('resolveAffixCountWarning', () => {
  it('returns a null tier and zero minNeeded for a rule with no required condition and no optional-affix engagement', () => {
    const rule = makeRule()
    const result = resolveAffixCountWarning(rule, makePool())
    expect(result.tier).toBe(null)
    expect(result.minNeeded).toBe(0)
  })

  it('computes minNeeded from the required-affixes condition alone when optional-affix state is neverTouched', () => {
    const rule = makeRule({ conditions: [makeRequiredCondition({ minimumCount: 5 })], optionalAffixes: null })
    const result = resolveAffixCountWarning(rule, makePool({ enabled: false }))
    expect(result.minNeeded).toBe(5)
    expect(result.tier).toBe('notice')
  })

  it('excludes a paused optional-affix record from minNeeded — only active state counts', () => {
    const pausedRecord: RuleOptionalAffixesState = {
      removed: false,
      listMode: 'inherited',
      customAffixIds: [],
      customGreaterAffixIds: [],
      requiredCount: 3,
    }
    const rule = makeRule({ conditions: [makeRequiredCondition({ minimumCount: 5 })], optionalAffixes: pausedRecord })
    const result = resolveAffixCountWarning(rule, makePool({ enabled: false }))
    expect(result.minNeeded).toBe(5)
    expect(result.tier).toBe('notice')
  })

  it('excludes a removed optional-affix record from minNeeded', () => {
    const removedRecord: RuleOptionalAffixesState = {
      removed: true,
      listMode: 'custom',
      customAffixIds: ['a'],
      customGreaterAffixIds: [],
      requiredCount: 3,
    }
    const rule = makeRule({ conditions: [makeRequiredCondition({ minimumCount: 5 })], optionalAffixes: removedRecord })
    const result = resolveAffixCountWarning(rule, makePool({ enabled: true }))
    expect(result.minNeeded).toBe(5)
    expect(result.tier).toBe('notice')
  })

  it('includes the optional-affix contribution when the resolved state is active', () => {
    const rule = makeRule({
      conditions: [makeRequiredCondition({ minimumCount: 5, affixIds: ['a'] })],
      optionalAffixes: null,
    })
    const pool = makePool({ enabled: true, affixIds: ['b'], greaterAffixIds: [] })
    const result = resolveAffixCountWarning(rule, pool)
    // inheritedOn with requiredCount 0 contributes nothing extra here beyond the required condition.
    expect(result.minNeeded).toBe(5)
    expect(result.tier).toBe('notice')
  })

  it('returns danger when the active optional-affix contribution pushes minNeeded past 6', () => {
    const customRecord: RuleOptionalAffixesState = {
      removed: false,
      listMode: 'custom',
      customAffixIds: ['b'],
      customGreaterAffixIds: [],
      requiredCount: 3,
    }
    const rule = makeRule({
      conditions: [makeRequiredCondition({ minimumCount: 5, affixIds: ['a'] })],
      optionalAffixes: customRecord,
    })
    const result = resolveAffixCountWarning(rule, makePool({ enabled: true }))
    expect(result.minNeeded).toBe(8)
    expect(result.tier).toBe('danger')
  })

  it('subtracts overlap between the required condition and an active optional-affix list', () => {
    const customRecord: RuleOptionalAffixesState = {
      removed: false,
      listMode: 'custom',
      customAffixIds: ['a'],
      customGreaterAffixIds: [],
      requiredCount: 3,
    }
    const rule = makeRule({
      conditions: [makeRequiredCondition({ minimumCount: 5, affixIds: ['a'] })],
      optionalAffixes: customRecord,
    })
    const result = resolveAffixCountWarning(rule, makePool({ enabled: true }))
    expect(result.minNeeded).toBe(7)
    expect(result.tier).toBe('danger')
  })
})
