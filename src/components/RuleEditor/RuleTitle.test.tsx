import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { RuleTitle } from './RuleTitle'

describe('RuleTitle', () => {
  it('renders the rule name as text with no input visible', () => {
    render(<RuleTitle name="Arm Slot" onRename={vi.fn()} />)
    expect(screen.getByText('Arm Slot')).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('clicking the pencil icon opens an inline text input pre-filled with the current name', async () => {
    const user = userEvent.setup()
    render(<RuleTitle name="Arm Slot" onRename={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /rename/i }))
    expect(screen.getByRole('textbox')).toHaveValue('Arm Slot')
  })

  it('pressing Enter commits the new name and exits edit mode', async () => {
    const user = userEvent.setup()
    const onRename = vi.fn()
    render(<RuleTitle name="Arm Slot" onRename={onRename} />)
    await user.click(screen.getByRole('button', { name: /rename/i }))
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, 'Leg Slot{Enter}')
    expect(onRename).toHaveBeenCalledWith('Leg Slot')
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('blurring the input commits the new name', async () => {
    const user = userEvent.setup()
    const onRename = vi.fn()
    render(
      <div>
        <RuleTitle name="Arm Slot" onRename={onRename} />
        <button type="button">elsewhere</button>
      </div>,
    )
    await user.click(screen.getByRole('button', { name: /rename/i }))
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, 'Leg Slot')
    await user.click(screen.getByRole('button', { name: 'elsewhere' }))
    expect(onRename).toHaveBeenCalledWith('Leg Slot')
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('pressing Escape cancels the edit without committing', async () => {
    const user = userEvent.setup()
    const onRename = vi.fn()
    render(<RuleTitle name="Arm Slot" onRename={onRename} />)
    await user.click(screen.getByRole('button', { name: /rename/i }))
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, 'Leg Slot{Escape}')
    expect(onRename).not.toHaveBeenCalled()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByText('Arm Slot')).toBeInTheDocument()
  })

  it('does not commit an empty name on blur or Enter — reverts to the previous name instead', async () => {
    const user = userEvent.setup()
    const onRename = vi.fn()
    render(<RuleTitle name="Arm Slot" onRename={onRename} />)
    await user.click(screen.getByRole('button', { name: /rename/i }))
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.keyboard('{Enter}')
    expect(onRename).not.toHaveBeenCalled()
    expect(screen.getByText('Arm Slot')).toBeInTheDocument()
  })
})
