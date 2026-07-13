import { describe, it, expect } from 'vitest'
import type { AppState } from './appState'
import { appReducer } from './appReducer'
import { resolveOptionalAffixesState } from '@core/optionalAffixes/resolveOptionalAffixesState'
import type { Rule } from '@core/types/rule'

function makeRule(overrides: Partial<Rule> = {}): Rule {
  return {
    id: 'rule-1',
    name: 'Test rule',
    enabled: true,
    visibility: 'recolor',
    color: '#ffffff',
    conditions: [],
    optionalAffixes: null,
    ...overrides,
  }
}

function makeState(overrides: Partial<AppState> = {}): AppState {
  return { rules: [], recentColors: [], globalAffixPool: { enabled: false, affixIds: [], greaterAffixIds: [] }, ...overrides }
}

describe('appReducer', () => {
  it('ADD_RULE appends a new rule', () => {
    const state = makeState()
    const result = appReducer(state, { type: 'ADD_RULE' })
    expect(result.rules).toHaveLength(1)
    expect(result.rules[0].name).toBe('New rule')
  })

  it('REMOVE_RULE removes the matching rule', () => {
    const state = makeState({ rules: [makeRule({ id: 'a' }), makeRule({ id: 'b' })] })
    const result = appReducer(state, { type: 'REMOVE_RULE', ruleId: 'a' })
    expect(result.rules.map((r) => r.id)).toEqual(['b'])
  })

  it('DUPLICATE_RULE clones the rule with " copy" appended to the name', () => {
    const state = makeState({ rules: [makeRule({ id: 'a', name: 'Arm Slot' })] })
    const result = appReducer(state, { type: 'DUPLICATE_RULE', ruleId: 'a' })
    expect(result.rules).toHaveLength(2)
    expect(result.rules[1].name).toBe('Arm Slot copy')
  })

  it('REORDER_RULES moves a rule to the target index', () => {
    const state = makeState({ rules: [makeRule({ id: 'a' }), makeRule({ id: 'b' }), makeRule({ id: 'c' })] })
    const result = appReducer(state, { type: 'REORDER_RULES', fromIndex: 0, toIndex: 2 })
    expect(result.rules.map((r) => r.id)).toEqual(['b', 'c', 'a'])
  })

  it('RENAME_RULE updates the matching rule name', () => {
    const state = makeState({ rules: [makeRule({ id: 'a', name: 'Old' })] })
    const result = appReducer(state, { type: 'RENAME_RULE', ruleId: 'a', name: 'New' })
    expect(result.rules[0].name).toBe('New')
  })

  it('TOGGLE_RULE_ENABLED flips the enabled flag', () => {
    const state = makeState({ rules: [makeRule({ id: 'a', enabled: true })] })
    const result = appReducer(state, { type: 'TOGGLE_RULE_ENABLED', ruleId: 'a' })
    expect(result.rules[0].enabled).toBe(false)
  })

  it('SET_ALL_RULES_ENABLED sets every rule to the given value', () => {
    const state = makeState({ rules: [makeRule({ id: 'a', enabled: true }), makeRule({ id: 'b', enabled: false })] })
    const result = appReducer(state, { type: 'SET_ALL_RULES_ENABLED', enabled: false })
    expect(result.rules.every((r) => r.enabled === false)).toBe(true)
  })

  it('SET_RULE_VISIBILITY updates the matching rule visibility', () => {
    const state = makeState({ rules: [makeRule({ id: 'a', visibility: 'show' })] })
    const result = appReducer(state, { type: 'SET_RULE_VISIBILITY', ruleId: 'a', visibility: 'hideAll' })
    expect(result.rules[0].visibility).toBe('hideAll')
  })

  describe('SET_RULE_COLOR', () => {
    it('updates the matching rule color', () => {
      const state = makeState({ rules: [makeRule({ id: 'a', color: '#000000' })] })
      const result = appReducer(state, { type: 'SET_RULE_COLOR', ruleId: 'a', color: '#ff0000' })
      expect(result.rules[0].color).toBe('#ff0000')
    })

    it('pushes the applied color onto recentColors, most-recent-first', () => {
      const state = makeState({ rules: [makeRule({ id: 'a' })], recentColors: ['#aaaaaa'] })
      const result = appReducer(state, { type: 'SET_RULE_COLOR', ruleId: 'a', color: '#bbbbbb' })
      expect(result.recentColors).toEqual(['#bbbbbb', '#aaaaaa'])
    })
  })

  describe('condition actions', () => {
    it('ADD_CONDITION appends a condition to the matching rule', () => {
      const state = makeState({ rules: [makeRule({ id: 'a', conditions: [] })] })
      const condition = { id: 'c1', type: 'itemProperties' as const, none: false, ancestral: true, mythic: false }
      const result = appReducer(state, { type: 'ADD_CONDITION', ruleId: 'a', condition })
      expect(result.rules[0].conditions).toEqual([condition])
    })

    it('REMOVE_CONDITION removes the matching condition from the matching rule', () => {
      const condition = { id: 'c1', type: 'itemProperties' as const, none: false, ancestral: true, mythic: false }
      const state = makeState({ rules: [makeRule({ id: 'a', conditions: [condition] })] })
      const result = appReducer(state, { type: 'REMOVE_CONDITION', ruleId: 'a', conditionId: 'c1' })
      expect(result.rules[0].conditions).toEqual([])
    })

    it('REORDER_CONDITIONS reorders conditions within the matching rule', () => {
      const c1 = { id: 'c1', type: 'itemProperties' as const, none: false, ancestral: true, mythic: false }
      const c2 = {
        id: 'c2',
        type: 'rarityMatch' as const,
        common: false,
        magic: false,
        rare: false,
        legendary: false,
        unique: false,
        mythicUnique: false,
        talismanSets: false,
      }
      const state = makeState({ rules: [makeRule({ id: 'a', conditions: [c1, c2] })] })
      const result = appReducer(state, { type: 'REORDER_CONDITIONS', ruleId: 'a', fromIndex: 0, toIndex: 1 })
      expect(result.rules[0].conditions.map((c) => c.id)).toEqual(['c2', 'c1'])
    })

    it('UPDATE_CONDITION patches the matching condition', () => {
      const condition = { id: 'c1', type: 'itemProperties' as const, none: false, ancestral: false, mythic: false }
      const state = makeState({ rules: [makeRule({ id: 'a', conditions: [condition] })] })
      const result = appReducer(state, {
        type: 'UPDATE_CONDITION',
        ruleId: 'a',
        conditionId: 'c1',
        patch: { ancestral: true },
      })
      expect(result.rules[0].conditions[0]).toMatchObject({ ancestral: true })
    })

    it('does not affect conditions on other rules', () => {
      const condition = { id: 'c1', type: 'itemProperties' as const, none: false, ancestral: false, mythic: false }
      const state = makeState({
        rules: [makeRule({ id: 'a', conditions: [condition] }), makeRule({ id: 'b', conditions: [] })],
      })
      const result = appReducer(state, { type: 'ADD_CONDITION', ruleId: 'a', condition })
      expect(result.rules[1].conditions).toEqual([])
    })
  })

  describe('global affix pool actions', () => {
    it('SET_GLOBAL_AFFIX_POOL_ENABLED toggles the enabled flag', () => {
      const state = makeState({ globalAffixPool: { enabled: false, affixIds: [], greaterAffixIds: [] } })
      const result = appReducer(state, { type: 'SET_GLOBAL_AFFIX_POOL_ENABLED', enabled: true })
      expect(result.globalAffixPool.enabled).toBe(true)
    })

    it('UPDATE_GLOBAL_AFFIX_POOL patches the affix lists', () => {
      const state = makeState({ globalAffixPool: { enabled: true, affixIds: [], greaterAffixIds: [] } })
      const result = appReducer(state, { type: 'UPDATE_GLOBAL_AFFIX_POOL', patch: { affixIds: ['a1'] } })
      expect(result.globalAffixPool.affixIds).toEqual(['a1'])
    })

    it('leaves rules unchanged when global affix pool actions are dispatched', () => {
      const state = makeState({ rules: [makeRule({ id: 'a' })] })
      const result = appReducer(state, { type: 'SET_GLOBAL_AFFIX_POOL_ENABLED', enabled: true })
      expect(result.rules).toEqual(state.rules)
    })
  })

  describe('per-rule optional affixes actions', () => {
    it('SET_RULE_OPTIONAL_AFFIXES_LIST_MODE materializes the rule and forks the global list when set to custom', () => {
      const state = makeState({
        rules: [makeRule({ id: 'a', optionalAffixes: null })],
        globalAffixPool: { enabled: true, affixIds: ['g1'], greaterAffixIds: ['gg1'] },
      })
      const result = appReducer(state, { type: 'SET_RULE_OPTIONAL_AFFIXES_LIST_MODE', ruleId: 'a', listMode: 'custom' })
      expect(result.rules[0].optionalAffixes).toMatchObject({
        listMode: 'custom',
        customAffixIds: ['g1'],
        customGreaterAffixIds: ['gg1'],
      })
    })

    it('UPDATE_RULE_OPTIONAL_AFFIXES_CUSTOM_LIST patches the custom list on the matching rule', () => {
      const state = makeState({
        rules: [
          makeRule({
            id: 'a',
            optionalAffixes: {
              removed: false,
              listMode: 'custom',
              customAffixIds: [],
              customGreaterAffixIds: [],
              requiredCount: 0,
            },
          }),
        ],
      })
      const result = appReducer(state, {
        type: 'UPDATE_RULE_OPTIONAL_AFFIXES_CUSTOM_LIST',
        ruleId: 'a',
        patch: { customAffixIds: ['x'] },
      })
      expect(result.rules[0].optionalAffixes).toMatchObject({ customAffixIds: ['x'] })
    })

    it('SET_RULE_OPTIONAL_AFFIXES_REMOVED marks the rule removed without discarding its record', () => {
      const state = makeState({
        rules: [
          makeRule({
            id: 'a',
            optionalAffixes: {
              removed: false,
              listMode: 'custom',
              customAffixIds: ['x'],
              customGreaterAffixIds: [],
              requiredCount: 2,
            },
          }),
        ],
      })
      const result = appReducer(state, { type: 'SET_RULE_OPTIONAL_AFFIXES_REMOVED', ruleId: 'a', removed: true })
      expect(result.rules[0].optionalAffixes).toMatchObject({ removed: true, customAffixIds: ['x'], requiredCount: 2 })
    })

    it('SET_RULE_OPTIONAL_AFFIXES_COUNT materializes the rule and sets the count', () => {
      const state = makeState({ rules: [makeRule({ id: 'a', optionalAffixes: null })] })
      const result = appReducer(state, { type: 'SET_RULE_OPTIONAL_AFFIXES_COUNT', ruleId: 'a', requiredCount: 2 })
      expect(result.rules[0].optionalAffixes).toMatchObject({ requiredCount: 2 })
    })
  })

  // Epic #32's master-switch acceptance criterion (#20): turning the global pool off and back
  // on must restore every rule to exactly its prior effective state, whatever that state was.
  // Lazy materialization makes this true by construction (the toggle never touches rule data),
  // but this test pins it as a contract across all four reachable rule states.
  describe('global pool off/on round-trip (#20)', () => {
    it('restores the exact prior effective state for every rule shape', () => {
      const initial = makeState({
        globalAffixPool: { enabled: true, affixIds: ['g1'], greaterAffixIds: ['gg1'] },
        rules: [
          makeRule({ id: 'untouched', optionalAffixes: null }),
          makeRule({
            id: 'custom-count',
            optionalAffixes: {
              removed: false,
              listMode: 'inherited',
              customAffixIds: [],
              customGreaterAffixIds: [],
              requiredCount: 3,
            },
          }),
          makeRule({
            id: 'custom-list',
            optionalAffixes: {
              removed: false,
              listMode: 'custom',
              customAffixIds: ['mine'],
              customGreaterAffixIds: [],
              requiredCount: 1,
            },
          }),
          makeRule({
            id: 'removed',
            optionalAffixes: {
              removed: true,
              listMode: 'inherited',
              customAffixIds: [],
              customGreaterAffixIds: [],
              requiredCount: 2,
            },
          }),
        ],
      })

      const resolveAll = (state: AppState) =>
        state.rules.map((rule) => resolveOptionalAffixesState(rule, state.globalAffixPool))
      const before = resolveAll(initial)

      const pausedState = appReducer(initial, { type: 'SET_GLOBAL_AFFIX_POOL_ENABLED', enabled: false })
      const paused = resolveAll(pausedState)
      // While off: nothing stays active except explicit custom lists.
      expect(paused.map((r) => r.status)).toEqual(['neverTouched', 'paused', 'customOn', 'removed'])
      // The pause never rewrites rule data — same object references, not just equal values.
      expect(pausedState.rules).toEqual(initial.rules)

      const resumedState = appReducer(pausedState, { type: 'SET_GLOBAL_AFFIX_POOL_ENABLED', enabled: true })
      expect(resolveAll(resumedState)).toEqual(before)
      expect(before.map((r) => r.status)).toEqual(['inheritedOn', 'inheritedOn', 'customOn', 'removed'])
    })
  })

  it('never mutates the input state object', () => {
    const state = makeState({ rules: [makeRule({ id: 'a' })] })
    const snapshot = JSON.parse(JSON.stringify(state))
    appReducer(state, { type: 'RENAME_RULE', ruleId: 'a', name: 'Changed' })
    expect(state).toEqual(snapshot)
  })
})
