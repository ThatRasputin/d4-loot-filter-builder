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

  it('renders ItemTypeMatchEditor for an itemTypeMatch condition', () => {
    const condition: Condition = { id: 'c4', type: 'itemTypeMatch', itemTypeIds: [] }
    render(<ConditionEditor condition={condition} onChange={vi.fn()} />)

    expect(screen.getByText('Item Type(s)')).toBeInTheDocument()
  })

  it('renders HasRequiredAffixesEditor for a hasRequiredAffixes condition', () => {
    const condition: Condition = {
      id: 'c5',
      type: 'hasRequiredAffixes',
      affixIds: [],
      greaterAffixIds: [],
      minimumCount: 0,
    }
    render(<ConditionEditor condition={condition} onChange={vi.fn()} />)

    expect(screen.getByText('Has required affixes')).toBeInTheDocument()
  })

  it('renders HasOptionalAffixesEditor for a hasOptionalAffixes condition', () => {
    const condition: Condition = {
      id: 'c6',
      type: 'hasOptionalAffixes',
      affixIds: [],
      greaterAffixIds: [],
      minimumCount: 0,
    }
    render(<ConditionEditor condition={condition} onChange={vi.fn()} />)

    expect(screen.getByText('Has optional affixes')).toBeInTheDocument()
  })
})
