import type { ConditionPatch } from '@core/conditions/conditionOperations'
import type { ItemRarityMatchCondition } from '@core/types/condition'

interface ItemRarityMatchEditorProps {
  condition: ItemRarityMatchCondition
  onChange: (patch: ConditionPatch) => void
}

interface RarityCheckbox {
  field: keyof Omit<ItemRarityMatchCondition, 'id' | 'type'>
  label: string
}

const RARITY_CHECKBOXES: RarityCheckbox[] = [
  { field: 'common', label: 'Common' },
  { field: 'magic', label: 'Magic' },
  { field: 'rare', label: 'Rare' },
  { field: 'legendary', label: 'Legendary' },
  { field: 'unique', label: 'Unique' },
  { field: 'mythicUnique', label: 'Mythic unique' },
  { field: 'talismanSets', label: 'Talisman set(s)' },
]

export function ItemRarityMatchEditor({ condition, onChange }: ItemRarityMatchEditorProps) {
  return (
    <fieldset>
      <legend>Item rarity match</legend>
      {RARITY_CHECKBOXES.map(({ field, label }) => (
        <label key={field}>
          <input
            type="checkbox"
            checked={condition[field]}
            onChange={(event) => onChange({ [field]: event.target.checked })}
          />
          {label}
        </label>
      ))}
    </fieldset>
  )
}
