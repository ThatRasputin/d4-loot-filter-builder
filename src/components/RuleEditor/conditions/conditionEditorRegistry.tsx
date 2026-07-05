import type { ConditionPatch } from '@core/conditions/conditionOperations'
import type { Condition } from '@core/types/condition'
import { CodexUpgradeCheckEditor } from './CodexUpgradeCheckEditor'
import { ItemPropertiesEditor } from './ItemPropertiesEditor'
import { ItemRarityMatchEditor } from './ItemRarityMatchEditor'
import { ItemTypeMatchEditor } from './ItemTypeMatchEditor'

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
    case 'codexUpgradeCheck':
      return <CodexUpgradeCheckEditor condition={condition} onChange={onChange} />
    case 'itemTypeMatch':
      return <ItemTypeMatchEditor condition={condition} onChange={onChange} />
  }
}
