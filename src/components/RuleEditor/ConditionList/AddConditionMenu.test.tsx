import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AddConditionMenu } from './AddConditionMenu'

describe('AddConditionMenu', () => {
  it('lists only the available condition types', () => {
    render(<AddConditionMenu availableTypes={['itemProperties']} onAdd={vi.fn()} />)

    expect(screen.getByRole('option', { name: 'Item properties' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Item rarity match' })).not.toBeInTheDocument()
  })

  it('calls onAdd with the selected type', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddConditionMenu availableTypes={['itemProperties', 'rarityMatch']} onAdd={onAdd} />)

    await user.selectOptions(screen.getByLabelText('Add condition'), 'rarityMatch')

    expect(onAdd).toHaveBeenCalledWith('rarityMatch')
  })

  it('renders nothing when no condition types are available', () => {
    const { container } = render(<AddConditionMenu availableTypes={[]} onAdd={vi.fn()} />)

    expect(container).toBeEmptyDOMElement()
  })
})
