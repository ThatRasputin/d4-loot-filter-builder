import { AFFIX_POOL } from '@core/data/affixPool'
import { computeSuggestedOptionalAffixCount } from '@core/optionalAffixes/suggestedCount'
import { resolveOptionalAffixesState } from '@core/optionalAffixes/resolveOptionalAffixesState'
import { useAppState } from '@state/useAppState'
import { AffixListPicker } from '@components/RuleEditor/conditions/AffixListPicker'

interface OptionalAffixesSectionProps {
  ruleId: string
}

const STATUS_LABEL = {
  inheritedOn: 'Inherited from global pool',
  customOn: 'Custom list',
  paused: 'Paused — global pool is off',
} as const

function affixDisplayName(id: string): string {
  return AFFIX_POOL.find((entry) => entry.id === id)?.displayName ?? id
}

function ReadOnlyAffixList({ label, ids }: { label: string; ids: string[] }) {
  if (ids.length === 0) return null
  return (
    <ul aria-label={label}>
      {ids.map((id) => (
        <li key={id}>{affixDisplayName(id)}</li>
      ))}
    </ul>
  )
}

// Per-rule counterpart to GlobalAffixPoolEditor (#17/#18/#21), pulled out of the generic
// conditions[] list entirely because inherited/custom/paused can't be expressed by the flat
// { affixIds, greaterAffixIds, minimumCount } shape the generic condition editors use — see the
// epic's "lazy materialization" note. Renders null until the rule actually has something to show
// (#21): global off and the rule untouched means there's nothing to configure yet.
export function OptionalAffixesSection({ ruleId }: OptionalAffixesSectionProps) {
  const { state, dispatch } = useAppState()
  const rule = state.rules.find((candidate) => candidate.id === ruleId)
  if (!rule) return null

  const resolved = resolveOptionalAffixesState(rule, state.globalAffixPool)
  if (resolved.status === 'neverTouched') return null

  // Removal is non-destructive: the record (custom list, count) survives underneath, so the
  // section stays visible as a stub offering to restore exactly what was there before (#19).
  if (resolved.status === 'removed') {
    return (
      <section aria-label="Optional affixes">
        <h3>Optional affixes</h3>
        <p>Removed from this rule</p>
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_RULE_OPTIONAL_AFFIXES_REMOVED', ruleId, removed: false })}
        >
          Add to this rule
        </button>
      </section>
    )
  }

  const requiredAffixCondition = rule.conditions.find((condition) => condition.type === 'hasRequiredAffixes')
  const suggestedCount = computeSuggestedOptionalAffixCount(requiredAffixCondition?.minimumCount ?? 0)

  return (
    <section aria-label="Optional affixes">
      <h3>Optional affixes</h3>
      <p>{STATUS_LABEL[resolved.status]}</p>
      <button
        type="button"
        onClick={() => dispatch({ type: 'SET_RULE_OPTIONAL_AFFIXES_REMOVED', ruleId, removed: true })}
      >
        Remove from rule
      </button>

      {resolved.status === 'customOn' ? (
        <>
          <AffixListPicker
            affixIds={resolved.affixIds}
            greaterAffixIds={resolved.greaterAffixIds}
            onChange={(patch) =>
              dispatch({
                type: 'UPDATE_RULE_OPTIONAL_AFFIXES_CUSTOM_LIST',
                ruleId,
                patch: {
                  ...(patch.affixIds && { customAffixIds: patch.affixIds }),
                  ...(patch.greaterAffixIds && { customGreaterAffixIds: patch.greaterAffixIds }),
                },
              })
            }
          />
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_RULE_OPTIONAL_AFFIXES_LIST_MODE', ruleId, listMode: 'inherited' })}
          >
            Reset list to global
          </button>
        </>
      ) : (
        <>
          <ReadOnlyAffixList label="Affixes" ids={resolved.affixIds} />
          <ReadOnlyAffixList label="Greater affixes" ids={resolved.greaterAffixIds} />
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_RULE_OPTIONAL_AFFIXES_LIST_MODE', ruleId, listMode: 'custom' })}
          >
            Customize list for this rule
          </button>
        </>
      )}

      <label>
        Required count
        <input
          type="number"
          min={0}
          value={resolved.requiredCount}
          onChange={(event) =>
            dispatch({
              type: 'SET_RULE_OPTIONAL_AFFIXES_COUNT',
              ruleId,
              requiredCount: Math.max(0, Number(event.target.value) || 0),
            })
          }
        />
      </label>
      <button
        type="button"
        onClick={() => dispatch({ type: 'SET_RULE_OPTIONAL_AFFIXES_COUNT', ruleId, requiredCount: suggestedCount })}
      >
        Use suggested ({suggestedCount})
      </button>
    </section>
  )
}
