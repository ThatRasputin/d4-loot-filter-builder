import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the seeded rule and allows renaming it via the pencil icon', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByText('New rule')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /rename/i }))
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, 'Arm Slot{Enter}')

    expect(screen.getByText('Arm Slot')).toBeInTheDocument()
    expect(screen.queryByText('New rule')).not.toBeInTheDocument()
  })
})
