import { useState } from 'react'
import { CONDITION_TYPE_LABELS } from '@core/conditions/conditionTypeRegistry'
import type { ConditionType } from '@core/types/condition'

interface AddConditionMenuProps {
  availableTypes: ConditionType[]
  onAdd: (type: ConditionType) => void
}

export function AddConditionMenu({ availableTypes, onAdd }: AddConditionMenuProps) {
  const [selected, setSelected] = useState('')

  if (availableTypes.length === 0) return null

  function handleChange(value: string) {
    setSelected(value)
    if (value) {
      onAdd(value as ConditionType)
      setSelected('')
    }
  }

  return (
    <select aria-label="Add condition" value={selected} onChange={(event) => handleChange(event.target.value)}>
      <option value="" disabled>
        Add condition…
      </option>
      {availableTypes.map((type) => (
        <option key={type} value={type}>
          {CONDITION_TYPE_LABELS[type]}
        </option>
      ))}
    </select>
  )
}
