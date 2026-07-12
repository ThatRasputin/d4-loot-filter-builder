import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AppStateProvider } from '@state/AppStateContext'
import { GlobalAffixPoolDialog } from './GlobalAffixPoolDialog'

function renderDialog(isOpen: boolean, onClose = vi.fn()) {
  return render(
    <AppStateProvider>
      <GlobalAffixPoolDialog isOpen={isOpen} onClose={onClose} />
    </AppStateProvider>,
  )
}

describe('GlobalAffixPoolDialog', () => {
  it('opens the dialog as a modal when isOpen is true', () => {
    renderDialog(true)

    expect(screen.getByRole('dialog', { name: 'Global affix pool' })).toBeInTheDocument()
  })

  it('does not show the dialog as open when isOpen is false', () => {
    renderDialog(false)

    expect(screen.queryByRole('dialog', { name: 'Global affix pool' })).not.toBeInTheDocument()
  })

  it('renders the global affix pool editor inside the dialog', () => {
    renderDialog(true)

    expect(screen.getByLabelText('Enable global affix pool')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderDialog(true, onClose)

    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(onClose).toHaveBeenCalledOnce()
  })
})
