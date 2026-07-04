import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { ItemPropertiesCondition } from '@core/types/condition'
import { ItemPropertiesEditor } from './ItemPropertiesEditor'

function makeCondition(overrides: Partial<ItemPropertiesCondition> = {}): ItemPropertiesCondition {
  return { id: 'c1', type: 'itemProperties', none: false, ancestral: false, mythic: false, ...overrides }
}

describe('ItemPropertiesEditor', () => {
  it('reflects the condition state in each checkbox', () => {
    render(<ItemPropertiesEditor condition={makeCondition({ ancestral: true })} onChange={vi.fn()} />)

    expect(screen.getByLabelText('None')).not.toBeChecked()
    expect(screen.getByLabelText('Ancestral')).toBeChecked()
    expect(screen.getByLabelText('Mythic')).not.toBeChecked()
  })

  it('reports a patch for the toggled field only when a checkbox is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ItemPropertiesEditor condition={makeCondition()} onChange={onChange} />)

    await user.click(screen.getByLabelText('Mythic'))

    expect(onChange).toHaveBeenCalledWith({ mythic: true })
  })

  it('unchecking a previously-checked box reports false', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ItemPropertiesEditor condition={makeCondition({ none: true })} onChange={onChange} />)

    await user.click(screen.getByLabelText('None'))

    expect(onChange).toHaveBeenCalledWith({ none: false })
  })
})
