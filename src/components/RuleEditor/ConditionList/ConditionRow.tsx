import { CONDITION_TYPE_LABELS } from '@core/conditions/conditionTypeRegistry'
import type { ConditionPatch } from '@core/conditions/conditionOperations'
import type { Condition } from '@core/types/condition'
import type { DragHandleProps } from '@components/dnd/SortableItem'
import { ConditionEditor } from '../conditions/conditionEditorRegistry'

interface ConditionRowProps {
  condition: Condition
  dragHandle: DragHandleProps
  onRemove: () => void
  onUpdate: (patch: ConditionPatch) => void
}

export function ConditionRow({ condition, dragHandle, onRemove, onUpdate }: ConditionRowProps) {
  const label = CONDITION_TYPE_LABELS[condition.type]

  return (
    <div>
      <button
        type="button"
        aria-label="Drag to reorder"
        ref={dragHandle.setActivatorNodeRef}
        {...dragHandle.attributes}
        {...dragHandle.listeners}
      >
        ⠿
      </button>
      <ConditionEditor condition={condition} onChange={onUpdate} />
      <button type="button" aria-label={`Remove ${label}`} onClick={onRemove}>
        🗑
      </button>
    </div>
  )
}
