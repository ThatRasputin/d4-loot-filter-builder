import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SelectedChips } from './SelectedChips'

describe('SelectedChips', () => {
  it('renders one removable chip per entry', () => {
    render(
      <SelectedChips
        entries={[
          { id: 'a', displayName: 'Alpha' },
          { id: 'b', displayName: 'Beta' },
        ]}
        onRemove={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Remove Alpha' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove Beta' })).toBeInTheDocument()
  })

  it('calls onRemove with the clicked entry\'s id', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<SelectedChips entries={[{ id: 'a', displayName: 'Alpha' }]} onRemove={onRemove} />)

    await user.click(screen.getByRole('button', { name: 'Remove Alpha' }))

    expect(onRemove).toHaveBeenCalledWith('a')
  })

  it('renders nothing when there are no entries', () => {
    render(<SelectedChips entries={[]} onRemove={vi.fn()} />)

    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })
})
