import { AffixListPicker } from '@components/RuleEditor/conditions/AffixListPicker'
import { useAppState } from '@state/useAppState'

export function GlobalAffixPoolEditor() {
  const { state, dispatch } = useAppState()
  const { enabled, affixIds, greaterAffixIds } = state.globalAffixPool
  const hasAnySelection = affixIds.length > 0 || greaterAffixIds.length > 0

  return (
    <div>
      <label>
        Enable global affix pool
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => dispatch({ type: 'SET_GLOBAL_AFFIX_POOL_ENABLED', enabled: event.target.checked })}
        />
      </label>

      <AffixListPicker
        affixIds={affixIds}
        greaterAffixIds={greaterAffixIds}
        onChange={(patch) => dispatch({ type: 'UPDATE_GLOBAL_AFFIX_POOL', patch })}
      />

      {hasAnySelection && (
        <button
          type="button"
          onClick={() => dispatch({ type: 'UPDATE_GLOBAL_AFFIX_POOL', patch: { affixIds: [], greaterAffixIds: [] } })}
        >
          Clear affix pool
        </button>
      )}
    </div>
  )
}
