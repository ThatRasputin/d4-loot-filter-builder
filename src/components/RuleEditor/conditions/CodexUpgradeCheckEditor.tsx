import type { ConditionPatch } from '@core/conditions/conditionOperations'
import type { CodexUpgradeCheckCondition } from '@core/types/condition'

interface CodexUpgradeCheckEditorProps {
  condition: CodexUpgradeCheckCondition
  onChange: (patch: ConditionPatch) => void
}

export function CodexUpgradeCheckEditor({ condition, onChange }: CodexUpgradeCheckEditorProps) {
  return (
    <fieldset>
      <legend>Codex upgrade check</legend>
      <label>
        <input
          type="checkbox"
          checked={condition.codexUpgrade}
          onChange={(event) => onChange({ codexUpgrade: event.target.checked })}
        />
        Codex Upgrade Check
      </label>
    </fieldset>
  )
}
