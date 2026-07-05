import type { ConditionPatch } from '@core/conditions/conditionOperations'
import type { HasRequiredAffixesCondition } from '@core/types/condition'
import { AffixListEditor } from './AffixListEditor'

interface HasRequiredAffixesEditorProps {
  condition: HasRequiredAffixesCondition
  onChange: (patch: ConditionPatch) => void
}

export function HasRequiredAffixesEditor({ condition, onChange }: HasRequiredAffixesEditorProps) {
  return (
    <AffixListEditor
      legend="Has required affixes"
      affixIds={condition.affixIds}
      greaterAffixIds={condition.greaterAffixIds}
      minimumCount={condition.minimumCount}
      onChange={onChange}
    />
  )
}
