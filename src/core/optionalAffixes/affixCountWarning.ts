import type { GlobalAffixPoolState } from '@core/types/globalAffixPool'
import type { Rule } from '@core/types/rule'
import { resolveOptionalAffixesState } from './resolveOptionalAffixesState'

export type AffixCountWarningTier = 'notice' | 'danger' | null

interface RequiredAffixInput {
  affixIds: string[]
  greaterAffixIds: string[]
  minimumCount: number
}

interface OptionalAffixInput {
  affixIds: string[]
  greaterAffixIds: string[]
  requiredCount: number
}

// A rule's realistic budget is 4 base affix rolls; the hard ceiling is 4 base + up to 2 tempered
// = 6, confirmed via Lord of Hatred itemization guides (issue #22).
const NOTICE_THRESHOLD = 4
const DANGER_THRESHOLD = 6

export function computeMinNeededAffixCount(required: RequiredAffixInput, optional: OptionalAffixInput): number {
  const requiredIds = new Set([...required.affixIds, ...required.greaterAffixIds])
  const optionalIds = new Set([...optional.affixIds, ...optional.greaterAffixIds])
  const overlap = [...requiredIds].filter((id) => optionalIds.has(id)).length
  return required.minimumCount + optional.requiredCount - overlap
}

export function computeAffixCountWarningTier(minNeeded: number): AffixCountWarningTier {
  if (minNeeded > DANGER_THRESHOLD) return 'danger'
  if (minNeeded > NOTICE_THRESHOLD) return 'notice'
  return null
}

// Composes computeMinNeededAffixCount with resolveOptionalAffixesState so both UI call sites
// (row icon, editor banner) share one computation instead of duplicating "find the
// hasRequiredAffixes condition" and "is the optional-affix state actually active" logic.
export function resolveAffixCountWarning(
  rule: Rule,
  globalPool: GlobalAffixPoolState,
): { tier: AffixCountWarningTier; minNeeded: number } {
  const requiredCondition = rule.conditions.find((condition) => condition.type === 'hasRequiredAffixes')
  const required: RequiredAffixInput = requiredCondition
    ? {
        affixIds: requiredCondition.affixIds,
        greaterAffixIds: requiredCondition.greaterAffixIds,
        minimumCount: requiredCondition.minimumCount,
      }
    : { affixIds: [], greaterAffixIds: [], minimumCount: 0 }

  const resolved = resolveOptionalAffixesState(rule, globalPool)
  // A paused, removed, or never-touched optional-affix state doesn't compile into a live
  // condition, so it must contribute 0/empty here rather than its stale requiredCount/list data.
  const optional: OptionalAffixInput = resolved.isActive
    ? { affixIds: resolved.affixIds, greaterAffixIds: resolved.greaterAffixIds, requiredCount: resolved.requiredCount }
    : { affixIds: [], greaterAffixIds: [], requiredCount: 0 }

  const minNeeded = computeMinNeededAffixCount(required, optional)
  return { tier: computeAffixCountWarningTier(minNeeded), minNeeded }
}
