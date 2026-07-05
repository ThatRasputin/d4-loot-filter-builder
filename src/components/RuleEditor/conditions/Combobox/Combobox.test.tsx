import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Combobox } from './Combobox'

interface TestEntry {
  id: string
  displayName: string
}

const POOL: TestEntry[] = [
  { id: 'abyss_damage', displayName: 'abyss damage' },
  { id: 'armor', displayName: 'armor' },
  { id: 'attack_speed', displayName: 'attack speed' },
  { id: 'barrier_generation', displayName: 'barrier generation' },
  { id: 'basic_damage', displayName: 'basic damage' },
]

describe('Combobox', () => {
  it('renders selected entries as chips and excludes them from the dropdown', async () => {
    const user = userEvent.setup()
    render(<Combobox label="Affixes" pool={POOL} selectedIds={['armor']} onChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Remove armor' })).toBeInTheDocument()

    await user.click(screen.getByRole('combobox', { name: 'Search Affixes' }))

    expect(screen.queryByRole('option', { name: 'armor' })).not.toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'abyss damage' })).toBeInTheDocument()
  })

  it('filters options by fuzzy-matching the typed query', async () => {
    const user = userEvent.setup()
    render(<Combobox label="Affixes" pool={POOL} selectedIds={[]} onChange={vi.fn()} />)

    await user.type(screen.getByRole('combobox', { name: 'Search Affixes' }), 'armor')

    const listbox = screen.getByRole('listbox', { name: 'Affixes' })
    expect(within(listbox).getByRole('option', { name: 'armor' })).toBeInTheDocument()
    expect(within(listbox).queryByRole('option', { name: 'abyss damage' })).not.toBeInTheDocument()
  })

  it('shows a "no matches" message when nothing matches the query', async () => {
    const user = userEvent.setup()
    render(<Combobox label="Affixes" pool={POOL} selectedIds={[]} onChange={vi.fn()} />)

    await user.type(screen.getByRole('combobox', { name: 'Search Affixes' }), 'zzzzzzznomatch')

    expect(screen.getByText('No matches found')).toBeInTheDocument()
  })

  it('selects the highlighted option on Enter after arrowing down', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Combobox label="Affixes" pool={POOL} selectedIds={[]} onChange={onChange} />)

    const input = screen.getByRole('combobox', { name: 'Search Affixes' })
    await user.click(input)
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')

    expect(onChange).toHaveBeenCalledWith(['attack_speed'])
  })

  it('moves the highlighted option back up with ArrowUp', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Combobox label="Affixes" pool={POOL} selectedIds={[]} onChange={onChange} />)

    const input = screen.getByRole('combobox', { name: 'Search Affixes' })
    await user.click(input)
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowUp}{Enter}')

    expect(onChange).toHaveBeenCalledWith(['armor'])
  })

  it('closes the dropdown on Escape without selecting anything', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Combobox label="Affixes" pool={POOL} selectedIds={[]} onChange={onChange} />)

    const input = screen.getByRole('combobox', { name: 'Search Affixes' })
    await user.click(input)
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('closes the dropdown when the input loses focus', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <Combobox label="Affixes" pool={POOL} selectedIds={[]} onChange={vi.fn()} />
        <button type="button">elsewhere</button>
      </div>,
    )

    await user.click(screen.getByRole('combobox', { name: 'Search Affixes' }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'elsewhere' }))

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('selects an option on click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Combobox label="Affixes" pool={POOL} selectedIds={[]} onChange={onChange} />)

    await user.click(screen.getByRole('combobox', { name: 'Search Affixes' }))
    await user.click(screen.getByRole('option', { name: 'barrier generation' }))

    expect(onChange).toHaveBeenCalledWith(['barrier_generation'])
  })

  it('clears the query and closes the dropdown after selecting an option', async () => {
    const user = userEvent.setup()
    render(<Combobox label="Affixes" pool={POOL} selectedIds={[]} onChange={vi.fn()} />)

    const input = screen.getByRole('combobox', { name: 'Search Affixes' })
    await user.click(input)
    await user.click(screen.getByRole('option', { name: 'armor' }))

    expect(input).toHaveValue('')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('removes an entry from the selection when its chip is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Combobox label="Affixes" pool={POOL} selectedIds={['armor', 'abyss_damage']} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Remove armor' }))

    expect(onChange).toHaveBeenCalledWith(['abyss_damage'])
  })

  it('hides the deselect-all control when nothing is selected', () => {
    render(<Combobox label="Affixes" pool={POOL} selectedIds={[]} onChange={vi.fn()} />)

    expect(screen.queryByRole('button', { name: 'Deselect all Affixes' })).not.toBeInTheDocument()
  })

  it('clears the whole selection when deselect-all is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Combobox label="Affixes" pool={POOL} selectedIds={['armor', 'abyss_damage']} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Deselect all Affixes' }))

    expect(onChange).toHaveBeenCalledWith([])
  })

  it('renders a large pool through the virtualizer without crashing', async () => {
    const user = userEvent.setup()
    const largePool: TestEntry[] = Array.from({ length: 900 }, (_, i) => ({
      id: `entry-${i}`,
      displayName: `Entry ${i}`,
    }))

    render(<Combobox label="Affixes" pool={largePool} selectedIds={[]} onChange={vi.fn()} />)
    await user.click(screen.getByRole('combobox', { name: 'Search Affixes' }))

    expect(screen.getByRole('listbox', { name: 'Affixes' })).toBeInTheDocument()
    expect(screen.getAllByRole('option').length).toBeGreaterThan(0)
    expect(screen.getAllByRole('option').length).toBeLessThan(largePool.length)
  })
})
