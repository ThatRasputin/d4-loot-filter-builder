import type { ConditionPatch } from '@core/conditions/conditionOperations'
import type { HasOptionalAffixesCondition } from '@core/types/condition'
import { AffixListEditor } from './AffixListEditor'

interface HasOptionalAffixesEditorProps {
  condition: HasOptionalAffixesCondition
  onChange: (patch: ConditionPatch) => void
}

export function HasOptionalAffixesEditor({ condition, onChange }: HasOptionalAffixesEditorProps) {
  return (
    <AffixListEditor
      legend="Has optional affixes"
      affixIds={condition.affixIds}
      greaterAffixIds={condition.greaterAffixIds}
      minimumCount={condition.minimumCount}
      onChange={onChange}
    />
  )
}
