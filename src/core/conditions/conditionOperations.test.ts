import { describe, it, expect } from 'vitest'
import type { Condition } from '@core/types/condition'
import { addCondition, removeCondition, reorderConditions, updateCondition } from './conditionOperations'

function itemProperties(id: string): Condition {
  return { id, type: 'itemProperties', none: false, ancestral: false, mythic: false }
}

describe('addCondition', () => {
  it('appends the condition to the end of the list', () => {
    const conditions = [itemProperties('a')]
    const result = addCondition(conditions, itemProperties('b'))
    expect(result.map((c) => c.id)).toEqual(['a', 'b'])
  })

  it('does not mutate the original array', () => {
    const conditions = [itemProperties('a')]
    addCondition(conditions, itemProperties('b'))
    expect(conditions).toHaveLength(1)
  })
})

describe('removeCondition', () => {
  it('filters out the condition with the matching id', () => {
    const conditions = [itemProperties('a'), itemProperties('b')]
    const result = removeCondition(conditions, 'a')
    expect(result.map((c) => c.id)).toEqual(['b'])
  })
})

describe('reorderConditions', () => {
  it('moves a condition from one index to another', () => {
    const conditions = [itemProperties('a'), itemProperties('b'), itemProperties('c')]
    const result = reorderConditions(conditions, 0, 2)
    expect(result.map((c) => c.id)).toEqual(['b', 'c', 'a'])
  })
})

describe('updateCondition', () => {
  it('patches only the matching condition, leaving others untouched', () => {
    const conditions: Condition[] = [itemProperties('a'), itemProperties('b')]
    const result = updateCondition(conditions, 'a', { ancestral: true })
    expect(result[0]).toMatchObject({ id: 'a', ancestral: true })
    expect(result[1]).toMatchObject({ id: 'b', ancestral: false })
  })

  it('does not affect unrelated fields on the patched condition', () => {
    const conditions: Condition[] = [itemProperties('a')]
    const result = updateCondition(conditions, 'a', { mythic: true })
    expect(result[0]).toMatchObject({ id: 'a', none: false, ancestral: false, mythic: true })
  })
})
