import { RuleTitle } from '@components/RuleEditor/RuleTitle'
import type { DragHandleProps } from '@components/dnd/SortableItem'
import type { AffixCountWarningTier } from '@core/optionalAffixes/affixCountWarning'
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
  warningTier: AffixCountWarningTier
}

const WARNING_ICON: Record<'notice' | 'danger', { glyph: string; label: string }> = {
  notice: { glyph: '🟠', label: 'Notice: not likely to occur on item drops' },
  danger: { glyph: '🔺', label: 'Danger: cannot occur on any item, even after full tempering' },
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
  warningTier,
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
      {warningTier && (
        <span role="img" aria-label={WARNING_ICON[warningTier].label}>
          {WARNING_ICON[warningTier].glyph}
        </span>
      )}
      <button type="button" aria-label={`Duplicate ${rule.name}`} onClick={onDuplicate}>
        ⧉
      </button>
      <button type="button" aria-label={`Delete ${rule.name}`} onClick={onDelete}>
        🗑
      </button>
    </div>
  )
}
