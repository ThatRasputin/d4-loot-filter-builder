import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useAppHistory } from './useAppHistory'
import { createInitialAppState } from './appState'

describe('useAppHistory', () => {
  it('starts with the initial state and no undo/redo available', () => {
    const { result } = renderHook(() => useAppHistory(createInitialAppState()))
    expect(result.current.state.rules).toEqual([])
    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(false)
  })

  it('dispatch applies the reducer and pushes history', () => {
    const { result } = renderHook(() => useAppHistory(createInitialAppState()))
    act(() => result.current.dispatch({ type: 'ADD_RULE' }))
    expect(result.current.state.rules).toHaveLength(1)
    expect(result.current.canUndo).toBe(true)
    expect(result.current.canRedo).toBe(false)
  })

  it('undo reverts to the previous state and enables redo', () => {
    const { result } = renderHook(() => useAppHistory(createInitialAppState()))
    act(() => result.current.dispatch({ type: 'ADD_RULE' }))
    act(() => result.current.undo())
    expect(result.current.state.rules).toEqual([])
    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(true)
  })

  it('redo re-applies the undone state', () => {
    const { result } = renderHook(() => useAppHistory(createInitialAppState()))
    act(() => result.current.dispatch({ type: 'ADD_RULE' }))
    act(() => result.current.undo())
    act(() => result.current.redo())
    expect(result.current.state.rules).toHaveLength(1)
    expect(result.current.canRedo).toBe(false)
  })

  it('dispatching after an undo discards the redo future', () => {
    const { result } = renderHook(() => useAppHistory(createInitialAppState()))
    act(() => result.current.dispatch({ type: 'ADD_RULE' }))
    act(() => result.current.undo())
    expect(result.current.canRedo).toBe(true)

    act(() => result.current.dispatch({ type: 'ADD_RULE' }))
    expect(result.current.canRedo).toBe(false)
    expect(result.current.state.rules).toHaveLength(1)
  })

  it('undo is a no-op when there is nothing to undo', () => {
    const { result } = renderHook(() => useAppHistory(createInitialAppState()))
    act(() => result.current.undo())
    expect(result.current.state.rules).toEqual([])
    expect(result.current.canUndo).toBe(false)
  })

  it('redo is a no-op when there is nothing to redo', () => {
    const { result } = renderHook(() => useAppHistory(createInitialAppState()))
    act(() => result.current.redo())
    expect(result.current.state.rules).toEqual([])
    expect(result.current.canRedo).toBe(false)
  })
})
