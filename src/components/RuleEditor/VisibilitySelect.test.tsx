import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { VisibilitySelect } from './VisibilitySelect'

describe('VisibilitySelect', () => {
  it('renders the four visibility options with the current value selected', () => {
    render(<VisibilitySelect visibility="hideText" onChange={vi.fn()} />)

    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('hideText')
    expect(screen.getByRole('option', { name: 'Show' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Recolor' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Hide text label' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Hide all' })).toBeInTheDocument()
  })

  it('calls onChange with the newly selected visibility', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<VisibilitySelect visibility="show" onChange={onChange} />)

    await user.selectOptions(screen.getByRole('combobox'), 'Recolor')

    expect(onChange).toHaveBeenCalledWith('recolor')
  })
})
