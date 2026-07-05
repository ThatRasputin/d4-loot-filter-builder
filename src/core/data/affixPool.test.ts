import { describe, expect, it } from 'vitest'
import { AFFIX_POOL } from './affixPool'

describe('AFFIX_POOL', () => {
  it('is non-empty', () => {
    expect(AFFIX_POOL.length).toBeGreaterThan(0)
  })

  it('has no duplicate ids', () => {
    const ids = AFFIX_POOL.map((entry) => entry.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every entry a non-empty id and displayName', () => {
    for (const entry of AFFIX_POOL) {
      expect(entry.id.length).toBeGreaterThan(0)
      expect(entry.displayName.length).toBeGreaterThan(0)
    }
  })
})
