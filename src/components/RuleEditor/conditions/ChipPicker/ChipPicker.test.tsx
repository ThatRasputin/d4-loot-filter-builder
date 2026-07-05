import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ChipPicker } from './ChipPicker'

interface TestEntry {
  id: string
  displayName: string
  category: string
}

const POOL: TestEntry[] = [
  { id: 'axe', displayName: 'Axe', category: 'weapon' },
  { id: 'bow', displayName: 'Bow', category: 'weapon' },
  { id: 'helm', displayName: 'Helm', category: 'armor' },
  { id: 'ring', displayName: 'Ring', category: 'jewelry' },
]

describe('ChipPicker', () => {
  it('renders every pool entry as a checkbox when search is empty', () => {
    render(<ChipPicker label="Item Type(s)" pool={POOL} selectedIds={[]} onChange={vi.fn()} />)

    expect(screen.getByRole('checkbox', { name: 'Axe' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Bow' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Helm' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Ring' })).toBeInTheDocument()
  })

  it('filters the visible checkboxes by search text', async () => {
    const user = userEvent.setup()
    render(<ChipPicker label="Item Type(s)" pool={POOL} selectedIds={[]} onChange={vi.fn()} />)

    await user.type(screen.getByLabelText('Search Item Type(s)'), 'ax')

    expect(screen.getByRole('checkbox', { name: 'Axe' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'Bow' })).not.toBeInTheDocument()
  })

  it('reports the updated selection when a checkbox is checked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ChipPicker label="Item Type(s)" pool={POOL} selectedIds={['axe']} onChange={onChange} />)

    await user.click(screen.getByRole('checkbox', { name: 'Bow' }))

    expect(onChange).toHaveBeenCalledWith(['axe', 'bow'])
  })

  it('reports the updated selection when a checkbox is unchecked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ChipPicker label="Item Type(s)" pool={POOL} selectedIds={['axe', 'bow']} onChange={onChange} />)

    await user.click(screen.getByRole('checkbox', { name: 'Axe' }))

    expect(onChange).toHaveBeenCalledWith(['bow'])
  })

  it('renders selected entries as removable chips reflecting the selectedIds prop', () => {
    render(<ChipPicker label="Item Type(s)" pool={POOL} selectedIds={['axe', 'ring']} onChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Remove Axe' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove Ring' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Remove Bow' })).not.toBeInTheDocument()
  })

  it('removes an id when its chip remove button is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ChipPicker label="Item Type(s)" pool={POOL} selectedIds={['axe', 'ring']} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Remove Axe' }))

    expect(onChange).toHaveBeenCalledWith(['ring'])
  })

  it('groups entries into labeled fieldsets when groupBy is provided', () => {
    render(
      <ChipPicker
        label="Item Type(s)"
        pool={POOL}
        selectedIds={[]}
        onChange={vi.fn()}
        groupBy={(entry) => entry.category}
        groupLabels={{ weapon: 'Weapons', armor: 'Armor', jewelry: 'Jewelry' }}
      />,
    )

    expect(screen.getByRole('group', { name: 'Weapons' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Armor' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Jewelry' })).toBeInTheDocument()
  })

  it('select-all in a group only adds that group\'s currently filtered ids', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ChipPicker
        label="Item Type(s)"
        pool={POOL}
        selectedIds={[]}
        onChange={onChange}
        groupBy={(entry) => entry.category}
        groupLabels={{ weapon: 'Weapons', armor: 'Armor', jewelry: 'Jewelry' }}
      />,
    )

    await user.type(screen.getByLabelText('Search Item Type(s)'), 'a')
    await user.click(screen.getByRole('checkbox', { name: 'Select all Weapons' }))

    expect(onChange).toHaveBeenCalledWith(['axe'])
  })

  it('unchecking a group\'s select-all removes exactly that group\'s ids', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ChipPicker
        label="Item Type(s)"
        pool={POOL}
        selectedIds={['axe', 'bow', 'helm']}
        onChange={onChange}
        groupBy={(entry) => entry.category}
        groupLabels={{ weapon: 'Weapons', armor: 'Armor', jewelry: 'Jewelry' }}
      />,
    )

    await user.click(screen.getByRole('checkbox', { name: 'Select all Weapons' }))

    expect(onChange).toHaveBeenCalledWith(['helm'])
  })

  it('hides the deselect-all control when nothing is selected', () => {
    render(<ChipPicker label="Item Type(s)" pool={POOL} selectedIds={[]} onChange={vi.fn()} />)

    expect(screen.queryByRole('button', { name: 'Deselect all Item Type(s)' })).not.toBeInTheDocument()
  })

  it('clears the whole selection when deselect-all is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ChipPicker label="Item Type(s)" pool={POOL} selectedIds={['axe', 'ring']} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Deselect all Item Type(s)' }))

    expect(onChange).toHaveBeenCalledWith([])
  })

  it('renders a group with zero matching entries as an empty fieldset instead of hiding it', () => {
    render(
      <ChipPicker
        label="Item Type(s)"
        pool={POOL}
        selectedIds={[]}
        onChange={vi.fn()}
        groupBy={(entry) => entry.category}
        groupLabels={{ weapon: 'Weapons', armor: 'Armor', jewelry: 'Jewelry', talisman: 'Talisman' }}
      />,
    )

    const talismanGroup = screen.getByRole('group', { name: 'Talisman' })
    expect(talismanGroup).toBeInTheDocument()
    expect(within(talismanGroup).queryAllByRole('checkbox')).toHaveLength(1) // only the (unchecked, inert) Select-all checkbox
  })

  it('caps the rendered checkbox list for a large pool and prompts to refine the search', () => {
    const largePool: TestEntry[] = Array.from({ length: 200 }, (_, i) => ({
      id: `entry-${i}`,
      displayName: `Entry ${i}`,
      category: 'flat',
    }))

    render(<ChipPicker label="Affixes" pool={largePool} selectedIds={[]} onChange={vi.fn()} />)

    expect(screen.getAllByRole('checkbox')).toHaveLength(50)
    expect(screen.getByText('Showing 50 of 200 — refine your search to see more')).toBeInTheDocument()
  })

  it('does not show the refine-search prompt once search narrows below the cap', async () => {
    const user = userEvent.setup()
    const largePool: TestEntry[] = Array.from({ length: 200 }, (_, i) => ({
      id: `entry-${i}`,
      displayName: `Entry ${i}`,
      category: 'flat',
    }))

    render(<ChipPicker label="Affixes" pool={largePool} selectedIds={[]} onChange={vi.fn()} />)
    await user.type(screen.getByLabelText('Search Affixes'), 'Entry 5')

    expect(screen.queryByText(/refine your search/)).not.toBeInTheDocument()
  })
})
