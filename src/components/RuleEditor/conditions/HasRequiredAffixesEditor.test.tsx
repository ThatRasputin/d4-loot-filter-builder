import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { HasRequiredAffixesCondition } from '@core/types/condition'
import { HasRequiredAffixesEditor } from './HasRequiredAffixesEditor'

function makeCondition(overrides: Partial<HasRequiredAffixesCondition> = {}): HasRequiredAffixesCondition {
  return { id: 'c1', type: 'hasRequiredAffixes', affixIds: [], greaterAffixIds: [], minimumCount: 0, ...overrides }
}

describe('HasRequiredAffixesEditor', () => {
  it('renders the "Has required affixes" legend', () => {
    render(<HasRequiredAffixesEditor condition={makeCondition()} onChange={vi.fn()} />)

    expect(screen.getByText('Has required affixes')).toBeInTheDocument()
  })

  it('passes the condition fields through to the shared affix list editor', () => {
    render(<HasRequiredAffixesEditor condition={makeCondition({ minimumCount: 2 })} onChange={vi.fn()} />)

    expect(screen.getByLabelText('At least')).toHaveValue(2)
  })

  it('bubbles onChange patches unchanged', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<HasRequiredAffixesEditor condition={makeCondition()} onChange={onChange} />)

    const affixesGroup = screen.getByRole('group', { name: 'Affixes' })
    await user.click(within(affixesGroup).getByRole('checkbox', { name: 'abyss damage' }))

    expect(onChange).toHaveBeenCalledWith({ affixIds: ['abyss_damage'] })
  })
})
