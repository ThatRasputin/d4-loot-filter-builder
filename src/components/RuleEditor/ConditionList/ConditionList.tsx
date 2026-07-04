import { closestCenter, DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { getAvailableConditionTypes } from '@core/conditions/conditionTypeRegistry'
import type { ConditionPatch } from '@core/conditions/conditionOperations'
import type { Condition, ConditionType } from '@core/types/condition'
import { SortableItem } from '@components/dnd/SortableItem'
import { useDragReorder } from '@components/dnd/useDragReorder'
import { AddConditionMenu } from './AddConditionMenu'
import { ConditionRow } from './ConditionRow'

interface ConditionListProps {
  conditions: Condition[]
  onReorder: (fromIndex: number, toIndex: number) => void
  onAddCondition: (type: ConditionType) => void
  onRemoveCondition: (conditionId: string) => void
  onUpdateCondition: (conditionId: string, patch: ConditionPatch) => void
}

export function ConditionList({
  conditions,
  onReorder,
  onAddCondition,
  onRemoveCondition,
  onUpdateCondition,
}: ConditionListProps) {
  const conditionIds = conditions.map((condition) => condition.id)
  const availableTypes = getAvailableConditionTypes(conditions)

  const { sensors, handleDragEnd } = useDragReorder({ ids: conditionIds, onReorder })

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={conditionIds} strategy={verticalListSortingStrategy}>
          <ul>
            {conditions.map((condition) => (
              <SortableItem key={condition.id} id={condition.id}>
                {(dragHandle) => (
                  <ConditionRow
                    condition={condition}
                    dragHandle={dragHandle}
                    onRemove={() => onRemoveCondition(condition.id)}
                    onUpdate={(patch) => onUpdateCondition(condition.id, patch)}
                  />
                )}
              </SortableItem>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <AddConditionMenu availableTypes={availableTypes} onAdd={onAddCondition} />
    </div>
  )
}
