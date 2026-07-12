// A rule can only have 4 affixes total. If the required-affixes condition already claims some
// of that budget, the suggested optional-affix count fills whatever's left, never going negative.
export function computeSuggestedOptionalAffixCount(requiredAffixMinimumCount: number): number {
  return Math.max(0, 4 - requiredAffixMinimumCount)
}
