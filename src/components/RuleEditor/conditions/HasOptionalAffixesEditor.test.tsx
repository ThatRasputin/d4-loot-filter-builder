import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { HasOptionalAffixesCondition } from '@core/types/condition'
import { HasOptionalAffixesEditor } from './HasOptionalAffixesEditor'

function makeCondition(overrides: Partial<HasOptionalAffixesCondition> = {}): HasOptionalAffixesCondition {
  return { id: 'c1', type: 'hasOptionalAffixes', affixIds: [], greaterAffixIds: [], minimumCount: 0, ...overrides }
}

describe('HasOptionalAffixesEditor', () => {
  it('renders the "Has optional affixes" legend', () => {
    render(<HasOptionalAffixesEditor condition={makeCondition()} onChange={vi.fn()} />)

    expect(screen.getByText('Has optional affixes')).toBeInTheDocument()
  })

  it('passes the condition fields through to the shared affix list editor', () => {
    render(<HasOptionalAffixesEditor condition={makeCondition({ minimumCount: 2 })} onChange={vi.fn()} />)

    expect(screen.getByLabelText('At least')).toHaveValue(2)
  })

  it('bubbles onChange patches unchanged', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<HasOptionalAffixesEditor condition={makeCondition()} onChange={onChange} />)

    await user.type(screen.getByRole('combobox', { name: 'Search Affixes' }), 'abyss damage')
    await user.click(screen.getByRole('option', { name: 'abyss damage' }))

    expect(onChange).toHaveBeenCalledWith({ affixIds: ['abyss_damage'] })
  })
})
