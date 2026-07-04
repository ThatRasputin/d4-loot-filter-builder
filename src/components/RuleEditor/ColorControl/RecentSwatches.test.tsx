import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RecentSwatches } from './RecentSwatches'

describe('RecentSwatches', () => {
  it('renders one swatch button per recent color', () => {
    render(<RecentSwatches colors={['#ff0000', '#00ff00']} onApply={vi.fn()} />)

    expect(screen.getByRole('button', { name: /#ff0000/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /#00ff00/i })).toBeInTheDocument()
  })

  it('applies a color instantly when its swatch is clicked', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    render(<RecentSwatches colors={['#ff0000', '#00ff00']} onApply={onApply} />)

    await user.click(screen.getByRole('button', { name: /#00ff00/i }))

    expect(onApply).toHaveBeenCalledWith('#00ff00')
  })

  it('renders nothing when there are no recent colors', () => {
    const { container } = render(<RecentSwatches colors={[]} onApply={vi.fn()} />)

    expect(container).toBeEmptyDOMElement()
  })
})
