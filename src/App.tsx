import { useState } from 'react'
import { RuleList } from '@components/RuleList/RuleList'
import { AppStateProvider } from '@state/AppStateContext'
import { createInitialAppState } from '@state/appState'
import { useAppState } from '@state/useAppState'
import { addRule } from '@core/rules/ruleOperations'

function seedInitialState() {
  return { ...createInitialAppState(), rules: addRule([]) }
}

function RuleEditorPanel({ ruleId }: { ruleId: string | null }) {
  const { state } = useAppState()
  const rule = state.rules.find((candidate) => candidate.id === ruleId)

  if (!rule) return <p>No rule selected</p>

  return <h2>{rule.name}</h2>
}

function AppShell() {
  const { state } = useAppState()
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(state.rules[0]?.id ?? null)

  const resolvedRuleId = state.rules.some((rule) => rule.id === selectedRuleId)
    ? selectedRuleId
    : (state.rules[0]?.id ?? null)

  return (
    <div>
      <RuleList selectedRuleId={resolvedRuleId} onSelectRule={setSelectedRuleId} />
      <RuleEditorPanel ruleId={resolvedRuleId} />
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
