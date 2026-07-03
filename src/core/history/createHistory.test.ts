import { describe, it, expect } from 'vitest'
import { createHistory } from '@core/types/history'
import { push, undo, redo, canUndo, canRedo } from './createHistory'

describe('push', () => {
  it('moves the current present into past and sets the new present', () => {
    const history = createHistory(1)
    const next = push(history, 2)
    expect(next.past).toEqual([1])
    expect(next.present).toBe(2)
  })

  it('clears the future stack, discarding any redo history', () => {
    const history = createHistory(1)
    const afterPush = push(history, 2)
    const afterUndo = undo(afterPush)
    const afterNewPush = push(afterUndo, 3)
    expect(afterNewPush.future).toEqual([])
    expect(afterNewPush.present).toBe(3)
  })

  it('does not mutate the original history object', () => {
    const history = createHistory(1)
    push(history, 2)
    expect(history.present).toBe(1)
    expect(history.past).toEqual([])
  })
})

describe('undo', () => {
  it('moves the last past entry back to present and pushes the old present onto future', () => {
    const history = push(createHistory(1), 2)
    const result = undo(history)
    expect(result.present).toBe(1)
    expect(result.past).toEqual([])
    expect(result.future).toEqual([2])
  })

  it('is a no-op when there is nothing to undo', () => {
    const history = createHistory(1)
    const result = undo(history)
    expect(result).toEqual(history)
  })
})

describe('redo', () => {
  it('moves the last future entry back to present and pushes the old present onto past', () => {
    const history = undo(push(createHistory(1), 2))
    const result = redo(history)
    expect(result.present).toBe(2)
    expect(result.past).toEqual([1])
    expect(result.future).toEqual([])
  })

  it('is a no-op when there is nothing to redo', () => {
    const history = createHistory(1)
    const result = redo(history)
    expect(result).toEqual(history)
  })
})

describe('canUndo', () => {
  it('is false when past is empty', () => {
    expect(canUndo(createHistory(1))).toBe(false)
  })

  it('is true when past has entries', () => {
    expect(canUndo(push(createHistory(1), 2))).toBe(true)
  })
})

describe('canRedo', () => {
  it('is false when future is empty', () => {
    expect(canRedo(createHistory(1))).toBe(false)
  })

  it('is true when future has entries', () => {
    expect(canRedo(undo(push(createHistory(1), 2)))).toBe(true)
  })
})
