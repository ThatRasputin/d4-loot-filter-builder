import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { DragEndEvent } from '@dnd-kit/core'
import { useDragReorder } from './useDragReorder'

function dragEndEvent(activeId: string, overId: string | null): DragEndEvent {
  return {
    active: { id: activeId },
    over: overId === null ? null : { id: overId },
  } as DragEndEvent
}

describe('useDragReorder', () => {
  it('calls onReorder with the from/to indices of the dragged and target ids', () => {
    const onReorder = vi.fn()
    const { result } = renderHook(() => useDragReorder({ ids: ['a', 'b', 'c'], onReorder }))

    result.current.handleDragEnd(dragEndEvent('c', 'a'))

    expect(onReorder).toHaveBeenCalledWith(2, 0)
  })

  it('does not call onReorder when dropped with no drop target', () => {
    const onReorder = vi.fn()
    const { result } = renderHook(() => useDragReorder({ ids: ['a', 'b', 'c'], onReorder }))

    result.current.handleDragEnd(dragEndEvent('a', null))

    expect(onReorder).not.toHaveBeenCalled()
  })

  it('does not call onReorder when dropped on itself', () => {
    const onReorder = vi.fn()
    const { result } = renderHook(() => useDragReorder({ ids: ['a', 'b', 'c'], onReorder }))

    result.current.handleDragEnd(dragEndEvent('b', 'b'))

    expect(onReorder).not.toHaveBeenCalled()
  })
})
