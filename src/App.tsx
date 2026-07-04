import { RuleTitle } from '@components/RuleEditor/RuleTitle'
import { AppStateProvider } from '@state/AppStateContext'
import { createInitialAppState } from '@state/appState'
import { useAppState } from '@state/useAppState'
import { addRule } from '@core/rules/ruleOperations'

function seedInitialState() {
  return { ...createInitialAppState(), rules: addRule([]) }
}

function RuleEditorPanel() {
  const { state, dispatch } = useAppState()
  const rule = state.rules[0]

  if (!rule) return null

  return <RuleTitle name={rule.name} onRename={(name) => dispatch({ type: 'RENAME_RULE', ruleId: rule.id, name })} />
}

function App() {
  return (
    <AppStateProvider initialState={seedInitialState()}>
      <RuleEditorPanel />
    </AppStateProvider>
  )
}

export default App
