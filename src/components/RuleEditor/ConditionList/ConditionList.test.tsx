import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Condition } from '@core/types/condition'
import { ConditionList } from './ConditionList'

const itemPropertiesCondition: Condition = {
  id: 'c1',
  type: 'itemProperties',
  none: false,
  ancestral: false,
  mythic: false,
}

const rarityMatchCondition: Condition = {
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

const codexUpgradeCheckCondition: Condition = {
  id: 'c3',
  type: 'codexUpgradeCheck',
  codexUpgrade: false,
}

const itemTypeMatchCondition: Condition = {
  id: 'c4',
  type: 'itemTypeMatch',
  itemTypeIds: [],
}

const hasRequiredAffixesCondition: Condition = {
  id: 'c5',
  type: 'hasRequiredAffixes',
  affixIds: [],
  greaterAffixIds: [],
  minimumCount: 0,
}

const hasOptionalAffixesCondition: Condition = {
  id: 'c6',
  type: 'hasOptionalAffixes',
  affixIds: [],
  greaterAffixIds: [],
  minimumCount: 0,
}

describe('ConditionList', () => {
  it('renders one row per condition', () => {
    render(
      <ConditionList
        conditions={[itemPropertiesCondition, rarityMatchCondition]}
        onReorder={vi.fn()}
        onAddCondition={vi.fn()}
        onRemoveCondition={vi.fn()}
        onUpdateCondition={vi.fn()}
      />,
    )

    expect(screen.getByText('Item properties')).toBeInTheDocument()
    expect(screen.getByText('Item rarity match')).toBeInTheDocument()
  })

  it('offers only condition types not already present on the rule (issue #8)', () => {
    render(
      <ConditionList
        conditions={[itemPropertiesCondition]}
        onReorder={vi.fn()}
        onAddCondition={vi.fn()}
        onRemoveCondition={vi.fn()}
        onUpdateCondition={vi.fn()}
      />,
    )

    expect(screen.getByRole('option', { name: 'Item rarity match' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Item properties' })).not.toBeInTheDocument()
  })

  it('hides the add-condition control once every type is present', () => {
    render(
      <ConditionList
        conditions={[
          itemPropertiesCondition,
          rarityMatchCondition,
          codexUpgradeCheckCondition,
          itemTypeMatchCondition,
          hasRequiredAffixesCondition,
          hasOptionalAffixesCondition,
        ]}
        onReorder={vi.fn()}
        onAddCondition={vi.fn()}
        onRemoveCondition={vi.fn()}
        onUpdateCondition={vi.fn()}
      />,
    )

    expect(screen.queryByLabelText('Add condition')).not.toBeInTheDocument()
  })

  it('calls onAddCondition with the chosen type', async () => {
    const user = userEvent.setup()
    const onAddCondition = vi.fn()
    render(
      <ConditionList
        conditions={[]}
        onReorder={vi.fn()}
        onAddCondition={onAddCondition}
        onRemoveCondition={vi.fn()}
        onUpdateCondition={vi.fn()}
      />,
    )

    await user.selectOptions(screen.getByLabelText('Add condition'), 'itemProperties')

    expect(onAddCondition).toHaveBeenCalledWith('itemProperties')
  })

  it('calls onRemoveCondition with the removed condition id', async () => {
    const user = userEvent.setup()
    const onRemoveCondition = vi.fn()
    render(
      <ConditionList
        conditions={[itemPropertiesCondition]}
        onReorder={vi.fn()}
        onAddCondition={vi.fn()}
        onRemoveCondition={onRemoveCondition}
        onUpdateCondition={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: /remove item properties/i }))

    expect(onRemoveCondition).toHaveBeenCalledWith('c1')
  })

  it('calls onUpdateCondition with the condition id and patch', async () => {
    const user = userEvent.setup()
    const onUpdateCondition = vi.fn()
    render(
      <ConditionList
        conditions={[itemPropertiesCondition]}
        onReorder={vi.fn()}
        onAddCondition={vi.fn()}
        onRemoveCondition={vi.fn()}
        onUpdateCondition={onUpdateCondition}
      />,
    )

    await user.click(screen.getByLabelText('Mythic'))

    expect(onUpdateCondition).toHaveBeenCalledWith('c1', { mythic: true })
  })
})
