import { closestCenter, DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableItem } from '@components/dnd/SortableItem'
import { useDragReorder } from '@components/dnd/useDragReorder'
import { useAppState } from '@state/useAppState'
import { RuleListRow } from './RuleListRow'
import { RuleListToolbar } from './RuleListToolbar'

interface RuleListProps {
  selectedRuleId: string | null
  onSelectRule: (ruleId: string) => void
}

export function RuleList({ selectedRuleId, onSelectRule }: RuleListProps) {
  const { state, dispatch } = useAppState()
  const ruleIds = state.rules.map((rule) => rule.id)

  const { sensors, handleDragEnd } = useDragReorder({
    ids: ruleIds,
    onReorder: (fromIndex, toIndex) => dispatch({ type: 'REORDER_RULES', fromIndex, toIndex }),
  })

  return (
    <div>
      <RuleListToolbar
        onAddRule={() => dispatch({ type: 'ADD_RULE' })}
        onEnableAll={() => dispatch({ type: 'SET_ALL_RULES_ENABLED', enabled: true })}
        onDisableAll={() => dispatch({ type: 'SET_ALL_RULES_ENABLED', enabled: false })}
      />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ruleIds} strategy={verticalListSortingStrategy}>
          <ul role="listbox">
            {state.rules.map((rule) => (
              <SortableItem key={rule.id} id={rule.id}>
                {(dragHandle) => (
                  <RuleListRow
                    rule={rule}
                    isSelected={rule.id === selectedRuleId}
                    onSelect={() => onSelectRule(rule.id)}
                    onToggleEnabled={() => dispatch({ type: 'TOGGLE_RULE_ENABLED', ruleId: rule.id })}
                    onRename={(name) => dispatch({ type: 'RENAME_RULE', ruleId: rule.id, name })}
                    onDuplicate={() => dispatch({ type: 'DUPLICATE_RULE', ruleId: rule.id })}
                    onDelete={() => dispatch({ type: 'REMOVE_RULE', ruleId: rule.id })}
                    dragHandle={dragHandle}
                  />
                )}
              </SortableItem>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  )
}
