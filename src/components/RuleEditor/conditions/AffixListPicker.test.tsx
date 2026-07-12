import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AffixListPicker } from './AffixListPicker'

describe('AffixListPicker', () => {
  it('renders a combobox for regular affixes and one for greater affixes', () => {
    render(<AffixListPicker affixIds={[]} greaterAffixIds={[]} onChange={vi.fn()} />)

    expect(screen.getByRole('group', { name: 'Affixes' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Greater affixes' })).toBeInTheDocument()
  })

  it('renders no minimum count input', () => {
    render(<AffixListPicker affixIds={[]} greaterAffixIds={[]} onChange={vi.fn()} />)

    expect(screen.queryByLabelText('At least')).not.toBeInTheDocument()
  })

  it('patches only affixIds when a regular affix is selected, leaving greaterAffixIds untouched', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<AffixListPicker affixIds={[]} greaterAffixIds={[]} onChange={onChange} />)

    await user.type(screen.getByRole('combobox', { name: 'Search Affixes' }), 'abyss damage')
    await user.click(screen.getByRole('option', { name: 'abyss damage' }))

    expect(onChange).toHaveBeenCalledWith({ affixIds: ['abyss_damage'] })
  })

  it('patches only greaterAffixIds when a greater affix is selected, leaving affixIds untouched', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<AffixListPicker affixIds={[]} greaterAffixIds={[]} onChange={onChange} />)

    await user.type(screen.getByRole('combobox', { name: 'Search Greater affixes' }), 'abyss damage')
    await user.click(screen.getByRole('option', { name: 'abyss damage' }))

    expect(onChange).toHaveBeenCalledWith({ greaterAffixIds: ['abyss_damage'] })
  })

  it('deselecting all in one list does not affect the other', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <AffixListPicker
        affixIds={['abyss_damage']}
        greaterAffixIds={['advance_resource_generation']}
        onChange={onChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Deselect all Affixes' }))

    expect(onChange).toHaveBeenCalledWith({ affixIds: [] })
    expect(onChange).not.toHaveBeenCalledWith({ greaterAffixIds: [] })
  })
})
