import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Condition } from '@core/types/condition'
import { ConditionEditor } from './conditionEditorRegistry'

describe('ConditionEditor', () => {
  it('renders ItemPropertiesEditor for an itemProperties condition', () => {
    const condition: Condition = { id: 'c1', type: 'itemProperties', none: false, ancestral: false, mythic: false }
    render(<ConditionEditor condition={condition} onChange={vi.fn()} />)

    expect(screen.getByText('Item properties')).toBeInTheDocument()
  })

  it('renders ItemRarityMatchEditor for a rarityMatch condition', () => {
    const condition: Condition = {
      id: 'c2',
      type: 'rarityMatch',
      common: false,
      magic: false,
      rare: false,
      legendary: false,
      unique: false,
      mythicUnique: false,
      talismanSets: false,
    }
    render(<ConditionEditor condition={condition} onChange={vi.fn()} />)

    expect(screen.getByText('Item rarity match')).toBeInTheDocument()
  })

  it('renders CodexUpgradeCheckEditor for a codexUpgradeCheck condition', () => {
    const condition: Condition = { id: 'c3', type: 'codexUpgradeCheck', codexUpgrade: false }
    render(<ConditionEditor condition={condition} onChange={vi.fn()} />)

    expect(screen.getByText('Codex upgrade check')).toBeInTheDocument()
  })
})
