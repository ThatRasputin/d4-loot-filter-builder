import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { DraggableAttributes } from '@dnd-kit/core'
import type { Rule } from '@core/types/rule'
import type { DragHandleProps } from '@components/dnd/SortableItem'
import { RuleListRow } from './RuleListRow'

function buildRule(overrides: Partial<Rule> = {}): Rule {
  return {
    id: 'rule-1',
    name: 'New rule',
    enabled: true,
    visibility: 'recolor',
    color: '#8a8a86',
    conditions: [],
    optionalAffixes: null,
    ...overrides,
  }
}

const stubDraggableAttributes: DraggableAttributes = {
  role: 'button',
  tabIndex: 0,
  'aria-disabled': false,
  'aria-pressed': undefined,
  'aria-roledescription': 'sortable',
  'aria-describedby': 'stub',
}

const dragHandle: DragHandleProps = {
  attributes: stubDraggableAttributes,
  listeners: undefined,
  setActivatorNodeRef: () => {},
}

describe('RuleListRow', () => {
  it('renders the rule name and an enabled checkbox reflecting rule.enabled', () => {
    render(
      <RuleListRow
        rule={buildRule({ enabled: false })}
        isSelected={false}
        onSelect={vi.fn()}
        onToggleEnabled={vi.fn()}
        onRename={vi.fn()}
        onDuplicate={vi.fn()}
        onDelete={vi.fn()}
        dragHandle={dragHandle}
      />,
    )

    expect(screen.getByText('New rule')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('calls onToggleEnabled when the checkbox is clicked', async () => {
    const user = userEvent.setup()
    const onToggleEnabled = vi.fn()
    render(
      <RuleListRow
        rule={buildRule()}
        isSelected={false}
        onSelect={vi.fn()}
        onToggleEnabled={onToggleEnabled}
        onRename={vi.fn()}
        onDuplicate={vi.fn()}
        onDelete={vi.fn()}
        dragHandle={dragHandle}
      />,
    )

    await user.click(screen.getByRole('checkbox'))

    expect(onToggleEnabled).toHaveBeenCalledOnce()
  })

  it('calls onDuplicate when the duplicate button is clicked', async () => {
    const user = userEvent.setup()
    const onDuplicate = vi.fn()
    render(
      <RuleListRow
        rule={buildRule()}
        isSelected={false}
        onSelect={vi.fn()}
        onToggleEnabled={vi.fn()}
        onRename={vi.fn()}
        onDuplicate={onDuplicate}
        onDelete={vi.fn()}
        dragHandle={dragHandle}
      />,
    )

    await user.click(screen.getByRole('button', { name: /duplicate/i }))

    expect(onDuplicate).toHaveBeenCalledOnce()
  })

  it('calls onDelete when the delete button is clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(
      <RuleListRow
        rule={buildRule()}
        isSelected={false}
        onSelect={vi.fn()}
        onToggleEnabled={vi.fn()}
        onRename={vi.fn()}
        onDuplicate={vi.fn()}
        onDelete={onDelete}
        dragHandle={dragHandle}
      />,
    )

    await user.click(screen.getByRole('button', { name: /delete/i }))

    expect(onDelete).toHaveBeenCalledOnce()
  })

  it('calls onSelect when the row is clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <RuleListRow
        rule={buildRule()}
        isSelected={false}
        onSelect={onSelect}
        onToggleEnabled={vi.fn()}
        onRename={vi.fn()}
        onDuplicate={vi.fn()}
        onDelete={vi.fn()}
        dragHandle={dragHandle}
      />,
    )

    await user.click(screen.getByText('New rule'))

    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('marks the row as selected via aria-selected when isSelected is true', () => {
    render(
      <RuleListRow
        rule={buildRule()}
        isSelected={true}
        onSelect={vi.fn()}
        onToggleEnabled={vi.fn()}
        onRename={vi.fn()}
        onDuplicate={vi.fn()}
        onDelete={vi.fn()}
        dragHandle={dragHandle}
      />,
    )

    expect(screen.getByRole('option')).toHaveAttribute('aria-selected', 'true')
  })

  it('has a drag handle button for reordering', () => {
    render(
      <RuleListRow
        rule={buildRule()}
        isSelected={false}
        onSelect={vi.fn()}
        onToggleEnabled={vi.fn()}
        onRename={vi.fn()}
        onDuplicate={vi.fn()}
        onDelete={vi.fn()}
        dragHandle={dragHandle}
      />,
    )

    expect(screen.getByRole('button', { name: /drag/i })).toBeInTheDocument()
  })
})
