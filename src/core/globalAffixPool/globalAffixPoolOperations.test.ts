import { describe, it, expect } from 'vitest'
import { setGlobalAffixPoolEnabled, updateGlobalAffixPool } from './globalAffixPoolOperations'

describe('updateGlobalAffixPool', () => {
  it('replaces affixIds when the patch includes affixIds', () => {
    const pool = { enabled: true, affixIds: ['a'], greaterAffixIds: [] }
    const result = updateGlobalAffixPool(pool, { affixIds: ['a', 'b'] })
    expect(result.affixIds).toEqual(['a', 'b'])
  })

  it('replaces greaterAffixIds when the patch includes greaterAffixIds', () => {
    const pool = { enabled: true, affixIds: [], greaterAffixIds: ['g1'] }
    const result = updateGlobalAffixPool(pool, { greaterAffixIds: ['g1', 'g2'] })
    expect(result.greaterAffixIds).toEqual(['g1', 'g2'])
  })

  it('leaves omitted fields unchanged', () => {
    const pool = { enabled: true, affixIds: ['a'], greaterAffixIds: ['g1'] }
    const result = updateGlobalAffixPool(pool, { affixIds: ['a', 'b'] })
    expect(result.greaterAffixIds).toEqual(['g1'])
    expect(result.enabled).toBe(true)
  })

  it('does not mutate the original pool object', () => {
    const pool = { enabled: true, affixIds: ['a'], greaterAffixIds: [] }
    updateGlobalAffixPool(pool, { affixIds: ['a', 'b'] })
    expect(pool.affixIds).toEqual(['a'])
  })
})

describe('setGlobalAffixPoolEnabled', () => {
  it('sets enabled to true', () => {
    const pool = { enabled: false, affixIds: [], greaterAffixIds: [] }
    expect(setGlobalAffixPoolEnabled(pool, true).enabled).toBe(true)
  })

  it('sets enabled to false', () => {
    const pool = { enabled: true, affixIds: [], greaterAffixIds: [] }
    expect(setGlobalAffixPoolEnabled(pool, false).enabled).toBe(false)
  })

  it('leaves the lists untouched', () => {
    const pool = { enabled: false, affixIds: ['a'], greaterAffixIds: ['g1'] }
    const result = setGlobalAffixPoolEnabled(pool, true)
    expect(result.affixIds).toEqual(['a'])
    expect(result.greaterAffixIds).toEqual(['g1'])
  })
})
