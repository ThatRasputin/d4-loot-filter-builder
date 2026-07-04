import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AppStateProvider } from '@state/AppStateContext'
import type { AppState } from '@state/appState'
import type { Rule } from '@core/types/rule'
import { RuleList } from './RuleList'

function buildRule(overrides: Partial<Rule>): Rule {
  return {
    id: overrides.id ?? 'rule-1',
    name: 'New rule',
    enabled: true,
    visibility: 'recolor',
    color: '#8a8a86',
    conditions: [],
    ...overrides,
  }
}

function renderRuleList(initialState: AppState, selectedRuleId: string | null = null, onSelectRule = vi.fn()) {
  return render(
    <AppStateProvider initialState={initialState}>
      <RuleList selectedRuleId={selectedRuleId} onSelectRule={onSelectRule} />
    </AppStateProvider>,
  )
}

describe('RuleList', () => {
  it('renders one row per rule', () => {
    const state: AppState = {
      rules: [buildRule({ id: 'a', name: 'First' }), buildRule({ id: 'b', name: 'Second' })],
      recentColors: [],
    }
    renderRuleList(state)

    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
  })

  it('adds a new rule when the add-rule button is clicked', async () => {
    const user = userEvent.setup()
    const state: AppState = { rules: [], recentColors: [] }
    renderRuleList(state)

    await user.click(screen.getByRole('button', { name: /add rule/i }))

    expect(screen.getByText('New rule')).toBeInTheDocument()
  })

  it('enables and disables every rule via the bulk toggle buttons', async () => {
    const user = userEvent.setup()
    const state: AppState = {
      rules: [buildRule({ id: 'a', enabled: false }), buildRule({ id: 'b', enabled: false })],
      recentColors: [],
    }
    renderRuleList(state)

    await user.click(screen.getByRole('button', { name: /enable all/i }))
    expect(screen.getAllByRole('checkbox').every((checkbox) => (checkbox as HTMLInputElement).checked)).toBe(true)

    await user.click(screen.getByRole('button', { name: /disable all/i }))
    expect(screen.getAllByRole('checkbox').every((checkbox) => !(checkbox as HTMLInputElement).checked)).toBe(true)
  })

  it('duplicates a rule with a " copy" suffix when the duplicate button is clicked', async () => {
    const user = userEvent.setup()
    const state: AppState = { rules: [buildRule({ id: 'a', name: 'Chest armor' })], recentColors: [] }
    renderRuleList(state)

    await user.click(screen.getByRole('button', { name: /duplicate/i }))

    expect(screen.getByText('Chest armor copy')).toBeInTheDocument()
  })

  it('removes a rule when the delete button is clicked', async () => {
    const user = userEvent.setup()
    const state: AppState = { rules: [buildRule({ id: 'a', name: 'Chest armor' })], recentColors: [] }
    renderRuleList(state)

    await user.click(screen.getByRole('button', { name: /delete/i }))

    expect(screen.queryByText('Chest armor')).not.toBeInTheDocument()
  })

  it('calls onSelectRule with the clicked rule id', async () => {
    const user = userEvent.setup()
    const onSelectRule = vi.fn()
    const state: AppState = { rules: [buildRule({ id: 'a', name: 'Chest armor' })], recentColors: [] }
    renderRuleList(state, null, onSelectRule)

    await user.click(screen.getByText('Chest armor'))

    expect(onSelectRule).toHaveBeenCalledWith('a')
  })

  it('marks the selected rule as aria-selected', () => {
    const state: AppState = {
      rules: [buildRule({ id: 'a', name: 'First' }), buildRule({ id: 'b', name: 'Second' })],
      recentColors: [],
    }
    renderRuleList(state, 'b')

    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveAttribute('aria-selected', 'false')
    expect(options[1]).toHaveAttribute('aria-selected', 'true')
  })
})
