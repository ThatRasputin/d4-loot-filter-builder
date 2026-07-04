import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { CodexUpgradeCheckCondition } from '@core/types/condition'
import { CodexUpgradeCheckEditor } from './CodexUpgradeCheckEditor'

function makeCondition(overrides: Partial<CodexUpgradeCheckCondition> = {}): CodexUpgradeCheckCondition {
  return { id: 'c1', type: 'codexUpgradeCheck', codexUpgrade: false, ...overrides }
}

describe('CodexUpgradeCheckEditor', () => {
  it('reflects the condition state in the checkbox', () => {
    render(<CodexUpgradeCheckEditor condition={makeCondition({ codexUpgrade: true })} onChange={vi.fn()} />)

    expect(screen.getByLabelText('Codex Upgrade Check')).toBeChecked()
  })

  it('reports a patch when the checkbox is toggled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<CodexUpgradeCheckEditor condition={makeCondition()} onChange={onChange} />)

    await user.click(screen.getByLabelText('Codex Upgrade Check'))

    expect(onChange).toHaveBeenCalledWith({ codexUpgrade: true })
  })
})
