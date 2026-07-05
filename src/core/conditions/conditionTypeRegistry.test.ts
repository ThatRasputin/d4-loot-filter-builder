import { describe, it, expect } from 'vitest'
import type { Condition } from '@core/types/condition'
import { CONDITION_TYPES, createDefaultCondition, getAvailableConditionTypes } from './conditionTypeRegistry'

describe('createDefaultCondition', () => {
  it('creates an itemProperties condition with all booleans false and a fresh id', () => {
    const condition = createDefaultCondition('itemProperties')
    expect(condition.type).toBe('itemProperties')
    expect(condition).toMatchObject({ none: false, ancestral: false, mythic: false })
    expect(condition.id).toBeTruthy()
  })

  it('creates a rarityMatch condition with all booleans false and a fresh id', () => {
    const condition = createDefaultCondition('rarityMatch')
    expect(condition.type).toBe('rarityMatch')
    expect(condition).toMatchObject({
      common: false,
      magic: false,
      rare: false,
      legendary: false,
      unique: false,
      mythicUnique: false,
      talismanSets: false,
    })
    expect(condition.id).toBeTruthy()
  })

  it('creates a codexUpgradeCheck condition with codexUpgrade false and a fresh id', () => {
    const condition = createDefaultCondition('codexUpgradeCheck')
    expect(condition.type).toBe('codexUpgradeCheck')
    expect(condition).toMatchObject({ codexUpgrade: false })
    expect(condition.id).toBeTruthy()
  })

  it('creates an itemTypeMatch condition with an empty itemTypeIds list and a fresh id', () => {
    const condition = createDefaultCondition('itemTypeMatch')
    expect(condition.type).toBe('itemTypeMatch')
    expect(condition).toMatchObject({ itemTypeIds: [] })
    expect(condition.id).toBeTruthy()
  })

  it('generates a unique id on every call', () => {
    const a = createDefaultCondition('itemProperties')
    const b = createDefaultCondition('itemProperties')
    expect(a.id).not.toBe(b.id)
  })
})

describe('getAvailableConditionTypes', () => {
  it('returns every known type when no conditions are present', () => {
    expect(getAvailableConditionTypes([])).toEqual(CONDITION_TYPES)
  })

  it('excludes types already present on the rule', () => {
    const conditions: Condition[] = [createDefaultCondition('itemProperties')]
    const result = getAvailableConditionTypes(conditions)
    expect(result).not.toContain('itemProperties')
    expect(result).toContain('rarityMatch')
  })

  it('returns an empty array once every type is present', () => {
    const conditions: Condition[] = [
      createDefaultCondition('itemProperties'),
      createDefaultCondition('rarityMatch'),
      createDefaultCondition('codexUpgradeCheck'),
      createDefaultCondition('itemTypeMatch'),
    ]
    expect(getAvailableConditionTypes(conditions)).toEqual([])
  })
})
