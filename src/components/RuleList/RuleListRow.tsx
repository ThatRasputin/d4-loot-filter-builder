import { RuleTitle } from '@components/RuleEditor/RuleTitle'
import type { DragHandleProps } from '@components/dnd/SortableItem'
import type { Rule } from '@core/types/rule'

interface RuleListRowProps {
  rule: Rule
  isSelected: boolean
  onSelect: () => void
  onToggleEnabled: () => void
  onRename: (name: string) => void
  onDuplicate: () => void
  onDelete: () => void
  dragHandle: DragHandleProps
}

export function RuleListRow({
  rule,
  isSelected,
  onSelect,
  onToggleEnabled,
  onRename,
  onDuplicate,
  onDelete,
  dragHandle,
}: RuleListRowProps) {
  return (
    <div role="option" aria-selected={isSelected} onClick={onSelect}>
      <button
        type="button"
        aria-label="Drag to reorder"
        ref={dragHandle.setActivatorNodeRef}
        {...dragHandle.attributes}
        {...dragHandle.listeners}
      >
        ⠿
      </button>
      <input type="checkbox" checked={rule.enabled} onChange={onToggleEnabled} aria-label={`Enable ${rule.name}`} />
      <RuleTitle name={rule.name} onRename={onRename} />
      <button type="button" aria-label={`Duplicate ${rule.name}`} onClick={onDuplicate}>
        ⧉
      </button>
      <button type="button" aria-label={`Delete ${rule.name}`} onClick={onDelete}>
        🗑
      </button>
    </div>
  )
}
