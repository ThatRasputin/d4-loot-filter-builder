import { ColorControl } from '@components/RuleEditor/ColorControl/ColorControl'
import { createDefaultCondition } from '@core/conditions/conditionTypeRegistry'
import { useAppState } from '@state/useAppState'
import { ConditionList } from './ConditionList/ConditionList'
import { OptionalAffixesSection } from './OptionalAffixes/OptionalAffixesSection'
import { VisibilitySelect } from './VisibilitySelect'

interface RuleEditorProps {
  ruleId: string | null
}

export function RuleEditor({ ruleId }: RuleEditorProps) {
  const { state, dispatch } = useAppState()
  const rule = state.rules.find((candidate) => candidate.id === ruleId)

  if (!rule) return <p>No rule selected</p>

  return (
    <div>
      <h2>{rule.name}</h2>
      <VisibilitySelect
        visibility={rule.visibility}
        onChange={(visibility) => dispatch({ type: 'SET_RULE_VISIBILITY', ruleId: rule.id, visibility })}
      />
      {rule.visibility === 'recolor' && (
        <ColorControl
          color={rule.color ?? '#000000'}
          recentColors={state.recentColors}
          onChangeColor={(color) => dispatch({ type: 'SET_RULE_COLOR', ruleId: rule.id, color })}
        />
      )}
      <ConditionList
        conditions={rule.conditions}
        onReorder={(fromIndex, toIndex) => dispatch({ type: 'REORDER_CONDITIONS', ruleId: rule.id, fromIndex, toIndex })}
        onAddCondition={(type) =>
          dispatch({ type: 'ADD_CONDITION', ruleId: rule.id, condition: createDefaultCondition(type) })
        }
        onRemoveCondition={(conditionId) => dispatch({ type: 'REMOVE_CONDITION', ruleId: rule.id, conditionId })}
        onUpdateCondition={(conditionId, patch) =>
          dispatch({ type: 'UPDATE_CONDITION', ruleId: rule.id, conditionId, patch })
        }
      />
      <OptionalAffixesSection ruleId={rule.id} />
    </div>
  )
}
