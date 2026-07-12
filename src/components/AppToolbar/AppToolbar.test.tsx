import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AppToolbar } from './AppToolbar'

function renderToolbar(overrides: Partial<Parameters<typeof AppToolbar>[0]> = {}) {
  return render(
    <AppToolbar
      canUndo={true}
      canRedo={true}
      onUndo={vi.fn()}
      onRedo={vi.fn()}
      onOpenGlobalAffixPool={vi.fn()}
      {...overrides}
    />,
  )
}

describe('AppToolbar', () => {
  it('disables the undo button when canUndo is false', () => {
    renderToolbar({ canUndo: false })

    expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled()
  })

  it('disables the redo button when canRedo is false', () => {
    renderToolbar({ canRedo: false })

    expect(screen.getByRole('button', { name: /redo/i })).toBeDisabled()
  })

  it('calls onUndo when the undo button is clicked', async () => {
    const user = userEvent.setup()
    const onUndo = vi.fn()
    renderToolbar({ onUndo })

    await user.click(screen.getByRole('button', { name: /undo/i }))

    expect(onUndo).toHaveBeenCalledOnce()
  })

  it('calls onRedo when the redo button is clicked', async () => {
    const user = userEvent.setup()
    const onRedo = vi.fn()
    renderToolbar({ onRedo })

    await user.click(screen.getByRole('button', { name: /redo/i }))

    expect(onRedo).toHaveBeenCalledOnce()
  })

  it('calls onOpenGlobalAffixPool when the global affix pool button is clicked', async () => {
    const user = userEvent.setup()
    const onOpenGlobalAffixPool = vi.fn()
    renderToolbar({ onOpenGlobalAffixPool })

    await user.click(screen.getByRole('button', { name: /global affix pool/i }))

    expect(onOpenGlobalAffixPool).toHaveBeenCalledOnce()
  })
})
