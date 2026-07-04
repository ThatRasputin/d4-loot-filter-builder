import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RuleListToolbar } from './RuleListToolbar'

describe('RuleListToolbar', () => {
  it('calls onAddRule when the add-rule button is clicked', async () => {
    const user = userEvent.setup()
    const onAddRule = vi.fn()
    render(<RuleListToolbar onAddRule={onAddRule} onEnableAll={vi.fn()} onDisableAll={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /add rule/i }))

    expect(onAddRule).toHaveBeenCalledOnce()
  })

  it('calls onEnableAll when the enable-all button is clicked', async () => {
    const user = userEvent.setup()
    const onEnableAll = vi.fn()
    render(<RuleListToolbar onAddRule={vi.fn()} onEnableAll={onEnableAll} onDisableAll={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /enable all/i }))

    expect(onEnableAll).toHaveBeenCalledOnce()
  })

  it('calls onDisableAll when the disable-all button is clicked', async () => {
    const user = userEvent.setup()
    const onDisableAll = vi.fn()
    render(<RuleListToolbar onAddRule={vi.fn()} onEnableAll={vi.fn()} onDisableAll={onDisableAll} />)

    await user.click(screen.getByRole('button', { name: /disable all/i }))

    expect(onDisableAll).toHaveBeenCalledOnce()
  })
})
