import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ColorControl } from './ColorControl'

describe('ColorControl', () => {
  it('renders the native color wheel bound to the current color', () => {
    render(<ColorControl color="#8a8a86" recentColors={[]} onChangeColor={vi.fn()} />)

    expect(screen.getByLabelText('Color wheel')).toHaveValue('#8a8a86')
  })

  it('dispatches a color change when the wheel value changes', () => {
    const onChangeColor = vi.fn()
    render(<ColorControl color="#8a8a86" recentColors={[]} onChangeColor={onChangeColor} />)

    // jsdom color inputs don't support real picker interaction; assert wiring via fireEvent.change.
    const wheel = screen.getByLabelText('Color wheel')
    fireEvent.change(wheel, { target: { value: '#123456' } })

    expect(onChangeColor).toHaveBeenCalledWith('#123456')
  })

  it('commits a valid hex value typed into the hex field', async () => {
    const user = userEvent.setup()
    const onChangeColor = vi.fn()
    render(<ColorControl color="#8a8a86" recentColors={[]} onChangeColor={onChangeColor} />)

    const hexInput = screen.getByRole('textbox')
    await user.clear(hexInput)
    await user.type(hexInput, '#ff00aa{Enter}')

    expect(onChangeColor).toHaveBeenCalledWith('#ff00aa')
  })

  it('applies a recent swatch instantly when clicked', async () => {
    const user = userEvent.setup()
    const onChangeColor = vi.fn()
    render(<ColorControl color="#8a8a86" recentColors={['#00ff00']} onChangeColor={onChangeColor} />)

    await user.click(screen.getByRole('button', { name: /#00ff00/i }))

    expect(onChangeColor).toHaveBeenCalledWith('#00ff00')
  })
})
