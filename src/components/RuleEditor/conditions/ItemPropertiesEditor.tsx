import type { ConditionPatch } from '@core/conditions/conditionOperations'
import type { ItemPropertiesCondition } from '@core/types/condition'

interface ItemPropertiesEditorProps {
  condition: ItemPropertiesCondition
  onChange: (patch: ConditionPatch) => void
}

export function ItemPropertiesEditor({ condition, onChange }: ItemPropertiesEditorProps) {
  return (
    <fieldset>
      <legend>Item properties</legend>
      <label>
        <input
          type="checkbox"
          checked={condition.none}
          onChange={(event) => onChange({ none: event.target.checked })}
        />
        None
      </label>
      <label>
        <input
          type="checkbox"
          checked={condition.ancestral}
          onChange={(event) => onChange({ ancestral: event.target.checked })}
        />
        Ancestral
      </label>
      <label>
        <input
          type="checkbox"
          checked={condition.mythic}
          onChange={(event) => onChange({ mythic: event.target.checked })}
        />
        Mythic
      </label>
    </fieldset>
  )
}
