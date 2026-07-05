import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AffixListEditor } from './AffixListEditor'

describe('AffixListEditor', () => {
  it('renders the legend, both affix pickers, and the threshold input', () => {
    render(
      <AffixListEditor legend="Has required affixes" affixIds={[]} greaterAffixIds={[]} minimumCount={0} onChange={vi.fn()} />,
    )

    expect(screen.getByText('Has required affixes')).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Affixes' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Greater affixes' })).toBeInTheDocument()
    expect(screen.getByLabelText('At least')).toHaveValue(0)
  })

  it('patches only affixIds when a regular affix is selected, leaving greaterAffixIds untouched', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <AffixListEditor legend="Has required affixes" affixIds={[]} greaterAffixIds={[]} minimumCount={0} onChange={onChange} />,
    )

    await user.type(screen.getByRole('combobox', { name: 'Search Affixes' }), 'abyss damage')
    await user.click(screen.getByRole('option', { name: 'abyss damage' }))

    expect(onChange).toHaveBeenCalledWith({ affixIds: ['abyss_damage'] })
  })

  it('patches only greaterAffixIds when a greater affix is selected, leaving affixIds untouched', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <AffixListEditor legend="Has required affixes" affixIds={[]} greaterAffixIds={[]} minimumCount={0} onChange={onChange} />,
    )

    await user.type(screen.getByRole('combobox', { name: 'Search Greater affixes' }), 'abyss damage')
    await user.click(screen.getByRole('option', { name: 'abyss damage' }))

    expect(onChange).toHaveBeenCalledWith({ greaterAffixIds: ['abyss_damage'] })
  })

  it('deselecting all in one list does not affect the other', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <AffixListEditor
        legend="Has required affixes"
        affixIds={['abyss_damage']}
        greaterAffixIds={['advance_resource_generation']}
        minimumCount={0}
        onChange={onChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Deselect all Affixes' }))

    expect(onChange).toHaveBeenCalledWith({ affixIds: [] })
    expect(onChange).not.toHaveBeenCalledWith({ greaterAffixIds: [] })
  })

  it('patches minimumCount when the threshold input changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <AffixListEditor legend="Has required affixes" affixIds={[]} greaterAffixIds={[]} minimumCount={0} onChange={onChange} />,
    )

    await user.clear(screen.getByLabelText('At least'))
    await user.type(screen.getByLabelText('At least'), '3')

    expect(onChange).toHaveBeenLastCalledWith({ minimumCount: 3 })
  })

  it('clamps a negative or non-numeric threshold to 0', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <AffixListEditor legend="Has required affixes" affixIds={[]} greaterAffixIds={[]} minimumCount={5} onChange={onChange} />,
    )

    await user.clear(screen.getByLabelText('At least'))

    expect(onChange).toHaveBeenLastCalledWith({ minimumCount: 0 })
  })
})
