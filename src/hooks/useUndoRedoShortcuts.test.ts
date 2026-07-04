import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useUndoRedoShortcuts } from './useUndoRedoShortcuts'

function dispatchKeyDown(init: KeyboardEventInit) {
  window.dispatchEvent(new KeyboardEvent('keydown', init))
}

describe('useUndoRedoShortcuts', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls undo on Ctrl+Z', () => {
    const undo = vi.fn()
    const redo = vi.fn()
    renderHook(() => useUndoRedoShortcuts({ undo, redo }))

    dispatchKeyDown({ key: 'z', ctrlKey: true })

    expect(undo).toHaveBeenCalledOnce()
    expect(redo).not.toHaveBeenCalled()
  })

  it('calls redo on Ctrl+Y', () => {
    const undo = vi.fn()
    const redo = vi.fn()
    renderHook(() => useUndoRedoShortcuts({ undo, redo }))

    dispatchKeyDown({ key: 'y', ctrlKey: true })

    expect(redo).toHaveBeenCalledOnce()
    expect(undo).not.toHaveBeenCalled()
  })

  it('calls redo on Ctrl+Shift+Z', () => {
    const undo = vi.fn()
    const redo = vi.fn()
    renderHook(() => useUndoRedoShortcuts({ undo, redo }))

    dispatchKeyDown({ key: 'z', ctrlKey: true, shiftKey: true })

    expect(redo).toHaveBeenCalledOnce()
    expect(undo).not.toHaveBeenCalled()
  })

  it('ignores Z without a modifier key', () => {
    const undo = vi.fn()
    const redo = vi.fn()
    renderHook(() => useUndoRedoShortcuts({ undo, redo }))

    dispatchKeyDown({ key: 'z' })

    expect(undo).not.toHaveBeenCalled()
    expect(redo).not.toHaveBeenCalled()
  })

  it('stops listening after unmount', () => {
    const undo = vi.fn()
    const redo = vi.fn()
    const { unmount } = renderHook(() => useUndoRedoShortcuts({ undo, redo }))

    unmount()
    dispatchKeyDown({ key: 'z', ctrlKey: true })

    expect(undo).not.toHaveBeenCalled()
  })
})
