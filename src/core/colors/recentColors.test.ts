import { describe, it, expect } from 'vitest'
import { pushRecentColor } from './recentColors'

describe('pushRecentColor', () => {
  it('adds a color to an empty list', () => {
    expect(pushRecentColor([], '#ff0000')).toEqual(['#ff0000'])
  })

  it('prepends a new color as most-recent', () => {
    expect(pushRecentColor(['#aaaaaa'], '#bbbbbb')).toEqual(['#bbbbbb', '#aaaaaa'])
  })

  it('moves an already-present color to the front instead of duplicating it', () => {
    expect(pushRecentColor(['#aaaaaa', '#bbbbbb'], '#bbbbbb')).toEqual(['#bbbbbb', '#aaaaaa'])
  })

  it('caps the list at 6 entries, dropping the oldest', () => {
    const full = ['#1', '#2', '#3', '#4', '#5', '#6']
    expect(pushRecentColor(full, '#7')).toEqual(['#7', '#1', '#2', '#3', '#4', '#5'])
  })
})
