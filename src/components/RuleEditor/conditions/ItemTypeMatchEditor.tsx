import { ITEM_TYPE_POOL } from '@core/data/itemTypePool'
import type { ConditionPatch } from '@core/conditions/conditionOperations'
import type { ItemTypeMatchCondition } from '@core/types/condition'
import { ChipPicker } from './ChipPicker/ChipPicker'

interface ItemTypeMatchEditorProps {
  condition: ItemTypeMatchCondition
  onChange: (patch: ConditionPatch) => void
}

const CATEGORY_LABELS: Record<string, string> = {
  weapon: 'Weapons',
  armor: 'Armor',
  jewelry: 'Jewelry',
  talisman: 'Talisman',
}

// No "Show All Classes" toggle here (unlike the real in-game picker): that toggle only makes
// sense with a "currently building for class X" context this app doesn't have, and
// ITEM_TYPE_POOL carries no per-class field to filter by anyway (issue #9). A class-scoped
// filter is tracked separately as a follow-up, pending real per-class item-type data.
export function ItemTypeMatchEditor({ condition, onChange }: ItemTypeMatchEditorProps) {
  return (
    <ChipPicker
      label="Item Type(s)"
      pool={ITEM_TYPE_POOL}
      selectedIds={condition.itemTypeIds}
      onChange={(itemTypeIds) => onChange({ itemTypeIds })}
      groupBy={(entry) => entry.category}
      groupLabels={CATEGORY_LABELS}
    />
  )
}
