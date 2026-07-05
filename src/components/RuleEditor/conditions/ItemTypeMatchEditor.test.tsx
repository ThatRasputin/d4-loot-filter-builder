import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { ItemTypeMatchCondition } from '@core/types/condition'
import { ItemTypeMatchEditor } from './ItemTypeMatchEditor'

function makeCondition(overrides: Partial<ItemTypeMatchCondition> = {}): ItemTypeMatchCondition {
  return { id: 'c1', type: 'itemTypeMatch', itemTypeIds: [], ...overrides }
}

describe('ItemTypeMatchEditor', () => {
  it('renders a category fieldset for each of Weapons, Armor, Jewelry, and Talisman', () => {
    render(<ItemTypeMatchEditor condition={makeCondition()} onChange={vi.fn()} />)

    expect(screen.getByRole('group', { name: 'Weapons' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Armor' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Jewelry' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Talisman' })).toBeInTheDocument()
  })

  it('renders the Talisman fieldset with no selectable item types without crashing', () => {
    render(<ItemTypeMatchEditor condition={makeCondition()} onChange={vi.fn()} />)

    const talismanGroup = screen.getByRole('group', { name: 'Talisman' })
    // Only the (inert) "Select all Talisman" checkbox — ITEM_TYPE_POOL has zero talisman
    // entries today, a known upstream data gap noted in itemTypePool.ts.
    expect(within(talismanGroup).queryAllByRole('checkbox')).toHaveLength(1)
  })

  it('reports an itemTypeIds patch when an item type is selected', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ItemTypeMatchEditor condition={makeCondition({ itemTypeIds: ['Sword'] })} onChange={onChange} />)

    await user.click(screen.getByRole('checkbox', { name: 'axe' }))

    expect(onChange).toHaveBeenCalledWith({ itemTypeIds: ['Sword', 'Axe'] })
  })

  it('reports an itemTypeIds patch with the id removed when its chip is removed', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ItemTypeMatchEditor condition={makeCondition({ itemTypeIds: ['Axe', 'Sword'] })} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Remove axe' }))

    expect(onChange).toHaveBeenCalledWith({ itemTypeIds: ['Sword'] })
  })
})
