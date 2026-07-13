import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AppStateProvider } from '@state/AppStateContext'
import type { AppState } from '@state/appState'
import { createInitialAppState } from '@state/appState'
import type { Rule } from '@core/types/rule'
import { OptionalAffixesSection } from './OptionalAffixesSection'

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

function renderSection(initialState: Partial<AppState>, ruleId = 'rule-1') {
  return render(
    <AppStateProvider initialState={{ ...createInitialAppState(), ...initialState }}>
      <OptionalAffixesSection ruleId={ruleId} />
    </AppStateProvider>,
  )
}

describe('OptionalAffixesSection', () => {
  it('renders nothing when the rule has never diverged and the global pool is off', () => {
    const { container } = renderSection({
      rules: [buildRule()],
      globalAffixPool: { enabled: false, affixIds: [], greaterAffixIds: [] },
    })

    expect(container).toBeEmptyDOMElement()
  })

  it('shows the inherited badge and the global list once the pool is enabled, with no rule-level edits yet', () => {
    renderSection({
      rules: [buildRule()],
      globalAffixPool: { enabled: true, affixIds: ['abyss_damage'], greaterAffixIds: [] },
    })

    expect(screen.getByText('Inherited from global pool')).toBeInTheDocument()
    expect(screen.getByText('abyss damage')).toBeInTheDocument()
  })

  it('renders the inherited list as read-only, with no remove controls', () => {
    renderSection({
      rules: [buildRule()],
      globalAffixPool: { enabled: true, affixIds: ['abyss_damage'], greaterAffixIds: [] },
    })

    expect(screen.queryByRole('button', { name: /remove abyss damage/i })).not.toBeInTheDocument()
  })

  it('switches to a custom, editable list when "Customize list for this rule" is clicked', async () => {
    const user = userEvent.setup()
    renderSection({
      rules: [buildRule()],
      globalAffixPool: { enabled: true, affixIds: ['abyss_damage'], greaterAffixIds: [] },
    })

    await user.click(screen.getByRole('button', { name: 'Customize list for this rule' }))

    expect(screen.getByText('Custom list')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Search Affixes' })).toBeInTheDocument()
    expect(screen.getByText('abyss damage')).toBeInTheDocument()
  })

  it('editing one side of the custom list (e.g. greater affixes) does not wipe the other side', async () => {
    const user = userEvent.setup()
    renderSection({
      rules: [buildRule()],
      globalAffixPool: { enabled: true, affixIds: ['abyss_damage'], greaterAffixIds: [] },
    })

    await user.click(screen.getByRole('button', { name: 'Customize list for this rule' }))
    await user.type(screen.getByRole('combobox', { name: 'Search Greater affixes' }), 'ancient damage')
    await user.click(screen.getByRole('option', { name: 'ancient damage' }))

    expect(screen.getByText('abyss damage')).toBeInTheDocument()
    expect(screen.getByText('ancient damage')).toBeInTheDocument()
  })

  it('reverts to the inherited list when "Reset list to global" is clicked', async () => {
    const user = userEvent.setup()
    renderSection({
      rules: [
        buildRule({
          optionalAffixes: {
            removed: false,
            listMode: 'custom',
            customAffixIds: ['abyss_damage'],
            customGreaterAffixIds: [],
            requiredCount: 0,
          },
        }),
      ],
      globalAffixPool: { enabled: true, affixIds: ['ancient_damage'], greaterAffixIds: [] },
    })

    expect(screen.getByText('Custom list')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reset list to global' }))

    expect(screen.getByText('Inherited from global pool')).toBeInTheDocument()
    expect(screen.getByText('ancient damage')).toBeInTheDocument()
  })

  it('shows a paused badge when the rule has a record but the global pool is off', () => {
    renderSection({
      rules: [
        buildRule({
          optionalAffixes: {
            removed: false,
            listMode: 'inherited',
            customAffixIds: [],
            customGreaterAffixIds: [],
            requiredCount: 2,
          },
        }),
      ],
      globalAffixPool: { enabled: false, affixIds: ['abyss_damage'], greaterAffixIds: [] },
    })

    expect(screen.getByText('Paused — global pool is off')).toBeInTheDocument()
  })

  it('removes optional affixes from the rule while keeping the section visible with a re-add button', async () => {
    const user = userEvent.setup()
    renderSection({
      rules: [buildRule()],
      globalAffixPool: { enabled: true, affixIds: ['abyss_damage'], greaterAffixIds: [] },
    })

    await user.click(screen.getByRole('button', { name: 'Remove from rule' }))

    expect(screen.getByText('Removed from this rule')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add to this rule' })).toBeInTheDocument()
    expect(screen.queryByText('abyss damage')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Required count')).not.toBeInTheDocument()
  })

  it('restores the exact prior custom configuration when re-added after removal', async () => {
    const user = userEvent.setup()
    renderSection({
      rules: [
        buildRule({
          optionalAffixes: {
            removed: true,
            listMode: 'custom',
            customAffixIds: ['abyss_damage'],
            customGreaterAffixIds: [],
            requiredCount: 3,
          },
        }),
      ],
      globalAffixPool: { enabled: true, affixIds: ['ancient_damage'], greaterAffixIds: [] },
    })

    await user.click(screen.getByRole('button', { name: 'Add to this rule' }))

    expect(screen.getByText('Custom list')).toBeInTheDocument()
    expect(screen.getByText('abyss damage')).toBeInTheDocument()
    expect(screen.getByLabelText('Required count')).toHaveValue(3)
  })

  it('shows the removed state even when the global pool is off — removal is rule-level, not pool-level', () => {
    renderSection({
      rules: [
        buildRule({
          optionalAffixes: {
            removed: true,
            listMode: 'inherited',
            customAffixIds: [],
            customGreaterAffixIds: [],
            requiredCount: 0,
          },
        }),
      ],
      globalAffixPool: { enabled: false, affixIds: [], greaterAffixIds: [] },
    })

    expect(screen.getByText('Removed from this rule')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add to this rule' })).toBeInTheDocument()
  })

  it('lets a paused rule opt into its own custom list without the global switch coming back on (#20)', async () => {
    const user = userEvent.setup()
    renderSection({
      rules: [
        buildRule({
          optionalAffixes: {
            removed: false,
            listMode: 'inherited',
            customAffixIds: [],
            customGreaterAffixIds: [],
            requiredCount: 2,
          },
        }),
      ],
      globalAffixPool: { enabled: false, affixIds: ['abyss_damage'], greaterAffixIds: [] },
    })

    expect(screen.getByText('Paused — global pool is off')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Customize list for this rule' }))

    expect(screen.getByText('Custom list')).toBeInTheDocument()
    expect(screen.getByText('abyss damage')).toBeInTheDocument()
    expect(screen.getByLabelText('Required count')).toHaveValue(2)
  })

  it('reflects the current required count and updates it on change', async () => {
    const user = userEvent.setup()
    renderSection({
      rules: [
        buildRule({
          optionalAffixes: {
            removed: false,
            listMode: 'inherited',
            customAffixIds: [],
            customGreaterAffixIds: [],
            requiredCount: 1,
          },
        }),
      ],
      globalAffixPool: { enabled: true, affixIds: [], greaterAffixIds: [] },
    })

    const input = screen.getByLabelText('Required count')
    expect(input).toHaveValue(1)

    await user.clear(input)
    await user.type(input, '3')

    expect(input).toHaveValue(3)
  })

  it('sets the count to the suggested value based on the required-affixes minimum', async () => {
    const user = userEvent.setup()
    renderSection({
      rules: [
        buildRule({
          conditions: [{ id: 'c1', type: 'hasRequiredAffixes', affixIds: [], greaterAffixIds: [], minimumCount: 1 }],
          optionalAffixes: {
            removed: false,
            listMode: 'inherited',
            customAffixIds: [],
            customGreaterAffixIds: [],
            requiredCount: 0,
          },
        }),
      ],
      globalAffixPool: { enabled: true, affixIds: [], greaterAffixIds: [] },
    })

    await user.click(screen.getByRole('button', { name: 'Use suggested (3)' }))

    expect(screen.getByLabelText('Required count')).toHaveValue(3)
  })
})
