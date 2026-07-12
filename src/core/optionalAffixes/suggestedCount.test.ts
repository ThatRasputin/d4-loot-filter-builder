import { describe, it, expect } from 'vitest'
import { computeSuggestedOptionalAffixCount } from './suggestedCount'

describe('computeSuggestedOptionalAffixCount', () => {
  it('suggests 4 minus the required-affix minimum when it fits within the 4 affix slots', () => {
    expect(computeSuggestedOptionalAffixCount(0)).toBe(4)
    expect(computeSuggestedOptionalAffixCount(1)).toBe(3)
    expect(computeSuggestedOptionalAffixCount(4)).toBe(0)
  })

  it('never suggests below zero once the required-affix minimum exceeds 4', () => {
    expect(computeSuggestedOptionalAffixCount(5)).toBe(0)
    expect(computeSuggestedOptionalAffixCount(10)).toBe(0)
  })
})
