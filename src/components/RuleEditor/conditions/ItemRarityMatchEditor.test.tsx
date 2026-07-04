import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { ItemRarityMatchCondition } from '@core/types/condition'
import { ItemRarityMatchEditor } from './ItemRarityMatchEditor'

function makeCondition(overrides: Partial<ItemRarityMatchCondition> = {}): ItemRarityMatchCondition {
  return {
    id: 'c1',
    type: 'rarityMatch',
    common: false,
    magic: false,
    rare: false,
    legendary: false,
    unique: false,
    mythicUnique: false,
    talismanSets: false,
    ...overrides,
  }
}

describe('ItemRarityMatchEditor', () => {
  it('reflects the condition state in each rarity checkbox', () => {
    render(<ItemRarityMatchEditor condition={makeCondition({ legendary: true, unique: true })} onChange={vi.fn()} />)

    expect(screen.getByLabelText('Common')).not.toBeChecked()
    expect(screen.getByLabelText('Legendary')).toBeChecked()
    expect(screen.getByLabelText('Unique')).toBeChecked()
  })

  it('reports a patch for the toggled rarity only', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ItemRarityMatchEditor condition={makeCondition()} onChange={onChange} />)

    await user.click(screen.getByLabelText('Mythic unique'))

    expect(onChange).toHaveBeenCalledWith({ mythicUnique: true })
  })

  it('supports the talisman sets flat checkbox', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ItemRarityMatchEditor condition={makeCondition()} onChange={onChange} />)

    await user.click(screen.getByLabelText('Talisman set(s)'))

    expect(onChange).toHaveBeenCalledWith({ talismanSets: true })
  })
})
