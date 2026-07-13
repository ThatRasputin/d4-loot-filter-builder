import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AppStateProvider } from '@state/AppStateContext'
import type { AppState } from '@state/appState'
import { createInitialAppState } from '@state/appState'
import type { Rule } from '@core/types/rule'
import { RuleEditor } from './RuleEditor'

function buildRule(overrides: Partial<Rule> = {}): Rule {
  return {
    id: 'rule-1',
    name: 'Chest armor',
    enabled: true,
    visibility: 'show',
    color: '#8a8a86',
    conditions: [],
    optionalAffixes: null,
    ...overrides,
  }
}

function renderRuleEditor(initialState: Partial<AppState>, ruleId: string | null) {
  return render(
    <AppStateProvider initialState={{ ...createInitialAppState(), ...initialState }}>
      <RuleEditor ruleId={ruleId} />
    </AppStateProvider>,
  )
}

describe('RuleEditor', () => {
  it('shows "No rule selected" when ruleId does not match any rule', () => {
    renderRuleEditor({ rules: [], recentColors: [] }, null)

    expect(screen.getByText('No rule selected')).toBeInTheDocument()
  })

  it('renders the rule name as a heading', () => {
    renderRuleEditor({ rules: [buildRule()], recentColors: [] }, 'rule-1')

    expect(screen.getByRole('heading', { name: 'Chest armor' })).toBeInTheDocument()
  })

  it('does not render the color control when visibility is not Recolor', () => {
    renderRuleEditor({ rules: [buildRule({ visibility: 'show' })], recentColors: [] }, 'rule-1')

    expect(screen.queryByLabelText('Color wheel')).not.toBeInTheDocument()
  })

  it('renders the color control when visibility is Recolor', () => {
    renderRuleEditor({ rules: [buildRule({ visibility: 'recolor' })], recentColors: [] }, 'rule-1')

    expect(screen.getByLabelText('Color wheel')).toBeInTheDocument()
  })

  it('shows the color control once visibility is switched to Recolor', async () => {
    const user = userEvent.setup()
    renderRuleEditor({ rules: [buildRule({ visibility: 'show' })], recentColors: [] }, 'rule-1')

    expect(screen.queryByLabelText('Color wheel')).not.toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Visibility'), 'Recolor')

    expect(screen.getByLabelText('Color wheel')).toBeInTheDocument()
  })

  it('applies a recent swatch to the rule color', async () => {
    const user = userEvent.setup()
    renderRuleEditor(
      { rules: [buildRule({ visibility: 'recolor', color: '#8a8a86' })], recentColors: ['#00ff00'] },
      'rule-1',
    )

    await user.click(screen.getByRole('button', { name: /#00ff00/i }))

    expect(screen.getByLabelText('Color wheel')).toHaveValue('#00ff00')
  })

  it('adds a condition end-to-end via the condition list', async () => {
    const user = userEvent.setup()
    renderRuleEditor({ rules: [buildRule()], recentColors: [] }, 'rule-1')

    await user.selectOptions(screen.getByLabelText('Add condition'), 'itemProperties')

    expect(screen.getByText('Item properties')).toBeInTheDocument()
    expect(screen.getByLabelText('None')).toBeInTheDocument()
  })

  it('does not render the optional affixes section when the rule has never diverged and the global pool is off', () => {
    renderRuleEditor(
      { rules: [buildRule()], recentColors: [], globalAffixPool: { enabled: false, affixIds: [], greaterAffixIds: [] } },
      'rule-1',
    )

    expect(screen.queryByRole('region', { name: 'Optional affixes' })).not.toBeInTheDocument()
  })

  it('renders the optional affixes section once the global pool is enabled', () => {
    renderRuleEditor(
      {
        rules: [buildRule()],
        recentColors: [],
        globalAffixPool: { enabled: true, affixIds: [], greaterAffixIds: [] },
      },
      'rule-1',
    )

    expect(screen.getByRole('region', { name: 'Optional affixes' })).toBeInTheDocument()
  })

  it('shows the affix-count warning banner for a rule over budget from required-affixes alone, even though the optional-affixes section never diverged and is not rendered', () => {
    renderRuleEditor(
      {
        rules: [
          buildRule({
            conditions: [{ id: 'c', type: 'hasRequiredAffixes', affixIds: [], greaterAffixIds: [], minimumCount: 5 }],
          }),
        ],
        recentColors: [],
        globalAffixPool: { enabled: false, affixIds: [], greaterAffixIds: [] },
      },
      'rule-1',
    )

    expect(screen.queryByRole('region', { name: 'Optional affixes' })).not.toBeInTheDocument()
    expect(screen.getByText(/not likely to occur on item drops/)).toBeInTheDocument()
  })

  it('clears the affix-count warning banner when "Use suggested" is clicked', async () => {
    const user = userEvent.setup()
    renderRuleEditor(
      {
        rules: [
          buildRule({
            conditions: [{ id: 'c', type: 'hasRequiredAffixes', affixIds: [], greaterAffixIds: [], minimumCount: 3 }],
            optionalAffixes: {
              removed: false,
              listMode: 'inherited',
              customAffixIds: [],
              customGreaterAffixIds: [],
              requiredCount: 4,
            },
          }),
        ],
        recentColors: [],
        globalAffixPool: { enabled: true, affixIds: [], greaterAffixIds: [] },
      },
      'rule-1',
    )

    expect(screen.getByText(/cannot occur on any item/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /use suggested/i }))

    expect(screen.queryByText(/cannot occur on any item/)).not.toBeInTheDocument()
    expect(screen.queryByText(/not likely to occur on item drops/)).not.toBeInTheDocument()
  })
})
