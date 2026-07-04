import type { ConditionPatch } from '@core/conditions/conditionOperations'
import type { Condition } from '@core/types/condition'
import { ItemPropertiesEditor } from './ItemPropertiesEditor'
import { ItemRarityMatchEditor } from './ItemRarityMatchEditor'

interface ConditionEditorProps {
  condition: Condition
  onChange: (patch: ConditionPatch) => void
}

export function ConditionEditor({ condition, onChange }: ConditionEditorProps) {
  switch (condition.type) {
    case 'itemProperties':
      return <ItemPropertiesEditor condition={condition} onChange={onChange} />
    case 'rarityMatch':
      return <ItemRarityMatchEditor condition={condition} onChange={onChange} />
  }
}
