import type { DraggableAttributes } from '@dnd-kit/core'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Condition } from '@core/types/condition'
import { ConditionRow } from './ConditionRow'

const dragHandle = {
  attributes: {} as DraggableAttributes,
  listeners: undefined,
  setActivatorNodeRef: () => {},
}

const itemPropertiesCondition: Condition = {
  id: 'c1',
  type: 'itemProperties',
  none: false,
  ancestral: false,
  mythic: false,
}

describe('ConditionRow', () => {
  it('renders the condition type label and its editor', () => {
    render(
      <ConditionRow condition={itemPropertiesCondition} dragHandle={dragHandle} onRemove={vi.fn()} onUpdate={vi.fn()} />,
    )

    expect(screen.getByText('Item properties')).toBeInTheDocument()
    expect(screen.getByLabelText('None')).toBeInTheDocument()
  })

  it('has a drag handle for reordering', () => {
    render(
      <ConditionRow condition={itemPropertiesCondition} dragHandle={dragHandle} onRemove={vi.fn()} onUpdate={vi.fn()} />,
    )

    expect(screen.getByLabelText('Drag to reorder')).toBeInTheDocument()
  })

  it('calls onRemove when the delete button is clicked', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(
      <ConditionRow
        condition={itemPropertiesCondition}
        dragHandle={dragHandle}
        onRemove={onRemove}
        onUpdate={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: /remove item properties/i }))

    expect(onRemove).toHaveBeenCalled()
  })

  it('forwards editor changes via onUpdate', async () => {
    const user = userEvent.setup()
    const onUpdate = vi.fn()
    render(
      <ConditionRow
        condition={itemPropertiesCondition}
        dragHandle={dragHandle}
        onRemove={vi.fn()}
        onUpdate={onUpdate}
      />,
    )

    await user.click(screen.getByLabelText('Mythic'))

    expect(onUpdate).toHaveBeenCalledWith({ mythic: true })
  })
})
