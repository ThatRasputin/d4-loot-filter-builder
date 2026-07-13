import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppStateProvider } from '@state/AppStateContext'
import type { AppState } from '@state/appState'
import { createInitialAppState } from '@state/appState'
import type { RuleOptionalAffixesState } from '@core/types/globalAffixPool'
import type { Rule } from '@core/types/rule'
import { AffixCountWarningBanner } from './AffixCountWarningBanner'

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

function renderBanner(initialState: Partial<AppState>, ruleId = 'rule-1') {
  return render(
    <AppStateProvider initialState={{ ...createInitialAppState(), ...initialState }}>
      <AffixCountWarningBanner ruleId={ruleId} />
    </AppStateProvider>,
  )
}

describe('AffixCountWarningBanner', () => {
  it('renders nothing when the combined affix count is within the realistic budget', () => {
    const { container } = renderBanner({
      rules: [
        buildRule({
          conditions: [{ id: 'c', type: 'hasRequiredAffixes', affixIds: [], greaterAffixIds: [], minimumCount: 2 }],
        }),
      ],
    })

    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing for a rule with no matching entry in state', () => {
    const { container } = renderBanner({ rules: [] })

    expect(container).toBeEmptyDOMElement()
  })

  it('shows the exact Notice copy with role="status" once minNeeded passes the realistic budget', () => {
    renderBanner({
      rules: [
        buildRule({
          conditions: [{ id: 'c', type: 'hasRequiredAffixes', affixIds: [], greaterAffixIds: [], minimumCount: 5 }],
        }),
      ],
    })

    expect(screen.getByRole('status')).toHaveTextContent('not likely to occur on item drops')
  })

  it('shows the exact Danger copy with role="alert" once minNeeded exceeds the max possible even after tempering', () => {
    renderBanner({
      rules: [
        buildRule({
          conditions: [{ id: 'c', type: 'hasRequiredAffixes', affixIds: [], greaterAffixIds: [], minimumCount: 7 }],
        }),
      ],
    })

    expect(screen.getByRole('alert')).toHaveTextContent(
      'cannot occur on any item, even after full tempering — rule will never trigger',
    )
  })

  it('does not fire from a stale paused optional-affix record — only the active state counts', () => {
    const pausedRecord: RuleOptionalAffixesState = {
      removed: false,
      listMode: 'inherited',
      customAffixIds: [],
      customGreaterAffixIds: [],
      requiredCount: 4,
    }
    const { container } = renderBanner({
      rules: [
        buildRule({
          conditions: [{ id: 'c', type: 'hasRequiredAffixes', affixIds: [], greaterAffixIds: [], minimumCount: 2 }],
          optionalAffixes: pausedRecord,
        }),
      ],
      globalAffixPool: { enabled: false, affixIds: [], greaterAffixIds: [] },
    })

    expect(container).toBeEmptyDOMElement()
  })

  it('does not fire from a stale removed optional-affix record', () => {
    const removedRecord: RuleOptionalAffixesState = {
      removed: true,
      listMode: 'custom',
      customAffixIds: ['a'],
      customGreaterAffixIds: [],
      requiredCount: 5,
    }
    const { container } = renderBanner({
      rules: [
        buildRule({
          conditions: [{ id: 'c', type: 'hasRequiredAffixes', affixIds: [], greaterAffixIds: [], minimumCount: 2 }],
          optionalAffixes: removedRecord,
        }),
      ],
    })

    expect(container).toBeEmptyDOMElement()
  })
})
