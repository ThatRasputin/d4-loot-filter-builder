import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { HexInput } from './HexInput'

describe('HexInput', () => {
  it('renders the current color as the input value', () => {
    render(<HexInput color="#8a8a86" onCommit={vi.fn()} />)

    expect(screen.getByRole('textbox')).toHaveValue('#8a8a86')
  })

  it('commits a valid 6-digit hex value on Enter', async () => {
    const user = userEvent.setup()
    const onCommit = vi.fn()
    render(<HexInput color="#8a8a86" onCommit={onCommit} />)

    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, '#ff00aa{Enter}')

    expect(onCommit).toHaveBeenCalledWith('#ff00aa')
  })

  it('commits a valid hex value on blur', async () => {
    const user = userEvent.setup()
    const onCommit = vi.fn()
    render(
      <div>
        <HexInput color="#8a8a86" onCommit={onCommit} />
        <button type="button">elsewhere</button>
      </div>,
    )

    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, '#fff')
    await user.click(screen.getByRole('button', { name: 'elsewhere' }))

    expect(onCommit).toHaveBeenCalledWith('#fff')
  })

  it('reverts to the last valid color without committing when the input is invalid', async () => {
    const user = userEvent.setup()
    const onCommit = vi.fn()
    render(<HexInput color="#8a8a86" onCommit={onCommit} />)

    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, 'not-a-color{Enter}')

    expect(onCommit).not.toHaveBeenCalled()
    expect(input).toHaveValue('#8a8a86')
  })

  it('updates its displayed value when the color prop changes externally', () => {
    const { rerender } = render(<HexInput color="#8a8a86" onCommit={vi.fn()} />)
    rerender(<HexInput color="#123456" onCommit={vi.fn()} />)

    expect(screen.getByRole('textbox')).toHaveValue('#123456')
  })
})
