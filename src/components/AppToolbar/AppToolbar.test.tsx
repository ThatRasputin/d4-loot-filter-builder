import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AppToolbar } from './AppToolbar'

describe('AppToolbar', () => {
  it('disables the undo button when canUndo is false', () => {
    render(<AppToolbar canUndo={false} canRedo={true} onUndo={vi.fn()} onRedo={vi.fn()} />)

    expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled()
  })

  it('disables the redo button when canRedo is false', () => {
    render(<AppToolbar canUndo={true} canRedo={false} onUndo={vi.fn()} onRedo={vi.fn()} />)

    expect(screen.getByRole('button', { name: /redo/i })).toBeDisabled()
  })

  it('calls onUndo when the undo button is clicked', async () => {
    const user = userEvent.setup()
    const onUndo = vi.fn()
    render(<AppToolbar canUndo={true} canRedo={true} onUndo={onUndo} onRedo={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /undo/i }))

    expect(onUndo).toHaveBeenCalledOnce()
  })

  it('calls onRedo when the redo button is clicked', async () => {
    const user = userEvent.setup()
    const onRedo = vi.fn()
    render(<AppToolbar canUndo={true} canRedo={true} onUndo={vi.fn()} onRedo={onRedo} />)

    await user.click(screen.getByRole('button', { name: /redo/i }))

    expect(onRedo).toHaveBeenCalledOnce()
  })
})
