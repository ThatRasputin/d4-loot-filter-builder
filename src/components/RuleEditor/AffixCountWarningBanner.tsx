import { resolveAffixCountWarning } from '@core/optionalAffixes/affixCountWarning'
import { useAppState } from '@state/useAppState'

interface AffixCountWarningBannerProps {
  ruleId: string
}

const COPY = {
  notice: 'Notice: not likely to occur on item drops',
  danger: 'Danger: cannot occur on any item, even after full tempering — rule will never trigger',
} as const

// Mounted unconditionally (sibling to OptionalAffixesSection) rather than nested inside it: a
// rule can be over-budget from its required-affixes condition alone, with no optional-affix
// engagement at all, and OptionalAffixesSection renders null for that neverTouched case.
export function AffixCountWarningBanner({ ruleId }: AffixCountWarningBannerProps) {
  const { state } = useAppState()
  const rule = state.rules.find((candidate) => candidate.id === ruleId)
  if (!rule) return null

  const { tier } = resolveAffixCountWarning(rule, state.globalAffixPool)
  if (tier === null) return null

  return <p role={tier === 'danger' ? 'alert' : 'status'}>{COPY[tier]}</p>
}
