import { describe, expect, it } from 'vitest'
import { ITEM_TYPE_POOL } from './itemTypePool'

const VALID_CATEGORIES = new Set(['weapon', 'armor', 'jewelry', 'talisman'])

describe('ITEM_TYPE_POOL', () => {
  it('is non-empty', () => {
    expect(ITEM_TYPE_POOL.length).toBeGreaterThan(0)
  })

  it('has no duplicate ids', () => {
    const ids = ITEM_TYPE_POOL.map((entry) => entry.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every entry a non-empty id and displayName and a valid category', () => {
    for (const entry of ITEM_TYPE_POOL) {
      expect(entry.id.length).toBeGreaterThan(0)
      expect(entry.displayName.length).toBeGreaterThan(0)
      expect(VALID_CATEGORIES.has(entry.category)).toBe(true)
    }
  })
})
