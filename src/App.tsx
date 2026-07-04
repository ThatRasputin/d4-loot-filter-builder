import { useState } from 'react'
import { AppToolbar } from '@components/AppToolbar/AppToolbar'
import { RuleList } from '@components/RuleList/RuleList'
import { RuleEditor } from '@components/RuleEditor/RuleEditor'
import { AppStateProvider } from '@state/AppStateContext'
import { createInitialAppState } from '@state/appState'
import { useAppState } from '@state/useAppState'
import { addRule } from '@core/rules/ruleOperations'
import { useUndoRedoShortcuts } from '@hooks/useUndoRedoShortcuts'

function seedInitialState() {
  return { ...createInitialAppState(), rules: addRule([]) }
}

function AppShell() {
  const { state, undo, redo, canUndo, canRedo } = useAppState()
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(state.rules[0]?.id ?? null)
  useUndoRedoShortcuts({ undo, redo })

  const resolvedRuleId = state.rules.some((rule) => rule.id === selectedRuleId)
    ? selectedRuleId
    : (state.rules[0]?.id ?? null)

  return (
    <div>
      <AppToolbar canUndo={canUndo} canRedo={canRedo} onUndo={undo} onRedo={redo} />
      <RuleList selectedRuleId={resolvedRuleId} onSelectRule={setSelectedRuleId} />
      <RuleEditor ruleId={resolvedRuleId} />
    </div>
  )
}

function App() {
  return (
    <AppStateProvider initialState={seedInitialState()}>
      <AppShell />
    </AppStateProvider>
  )
}

export default App
