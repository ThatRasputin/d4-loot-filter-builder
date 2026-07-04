import { describe, expect, it } from 'vitest'
import { isEditableElement } from './isEditableElement'

function makeInput(type: string): HTMLInputElement {
  const input = document.createElement('input')
  input.type = type
  return input
}

describe('isEditableElement', () => {
  it.each(['text', 'search', 'email', 'url', 'tel', 'password', 'number'])(
    'returns true for input type=%s',
    (type) => {
      expect(isEditableElement(makeInput(type))).toBe(true)
    },
  )

  it.each(['checkbox', 'radio', 'color', 'range', 'submit', 'button'])(
    'returns false for input type=%s',
    (type) => {
      expect(isEditableElement(makeInput(type))).toBe(false)
    },
  )

  it('returns true for a textarea', () => {
    expect(isEditableElement(document.createElement('textarea'))).toBe(true)
  })

  it('returns false for a select element', () => {
    expect(isEditableElement(document.createElement('select'))).toBe(false)
  })

  it('returns false for a button element', () => {
    expect(isEditableElement(document.createElement('button'))).toBe(false)
  })

  it('returns false for null', () => {
    expect(isEditableElement(null)).toBe(false)
  })

  it('returns false for a non-Element EventTarget', () => {
    expect(isEditableElement(window)).toBe(false)
  })
})
