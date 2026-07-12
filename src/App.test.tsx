import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the seeded rule in both the list and the editor panel', () => {
    render(<App />)

    expect(screen.getByRole('option', { name: /new rule/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'New rule' })).toBeInTheDocument()
  })

  it('renaming a rule via the pencil icon updates both the list row and the editor panel', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /rename/i }))
    const input = screen.getByRole('textbox', { name: 'Rule name' })
    await user.clear(input)
    await user.type(input, 'Arm Slot{Enter}')

    expect(screen.getByRole('heading', { name: 'Arm Slot' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'New rule' })).not.toBeInTheDocument()
  })

  it('adding a rule via the toolbar appends it to the list', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /add rule/i }))

    expect(screen.getAllByRole('option', { name: /new rule/i })).toHaveLength(2)
  })

  it('selecting a different rule updates the editor panel', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /add rule/i }))
    const rows = screen.getAllByRole('option', { name: /new rule/i })
    await user.click(rows[1])

    expect(screen.getByRole('heading', { name: 'New rule' })).toBeInTheDocument()
  })

  it('shows "No rule selected" once the last rule is deleted', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /delete/i }))

    expect(screen.getByText('No rule selected')).toBeInTheDocument()
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
  })

  it('opens the global affix pool dialog from the toolbar', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.queryByRole('dialog', { name: 'Global affix pool' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /global affix pool/i }))

    const dialog = screen.getByRole('dialog', { name: 'Global affix pool' })
    expect(dialog).toBeInTheDocument()
    expect(screen.getByLabelText('Enable global affix pool')).toBeInTheDocument()
  })

  it('closes the global affix pool dialog via its close button', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /global affix pool/i }))
    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.queryByRole('dialog', { name: 'Global affix pool' })).not.toBeInTheDocument()
  })

  it('reopens the global affix pool dialog after it was closed once', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /global affix pool/i }))
    await user.click(screen.getByRole('button', { name: 'Close' }))
    await user.click(screen.getByRole('button', { name: /global affix pool/i }))

    expect(screen.getByRole('dialog', { name: 'Global affix pool' })).toBeInTheDocument()
  })
})
