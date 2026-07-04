import { describe, it, expect } from 'vitest'
import type { AppState } from './appState'
import { appReducer } from './appReducer'
import type { Rule } from '@core/types/rule'

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

function makeState(overrides: Partial<AppState> = {}): AppState {
  return { rules: [], recentColors: [], ...overrides }
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

  it('never mutates the input state object', () => {
    const state = makeState({ rules: [makeRule({ id: 'a' })] })
    const snapshot = JSON.parse(JSON.stringify(state))
    appReducer(state, { type: 'RENAME_RULE', ruleId: 'a', name: 'Changed' })
    expect(state).toEqual(snapshot)
  })
})
