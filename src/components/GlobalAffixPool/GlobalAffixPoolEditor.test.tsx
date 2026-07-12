import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AppStateProvider } from '@state/AppStateContext'
import { createInitialAppState } from '@state/appState'
import type { AppState } from '@state/appState'
import { GlobalAffixPoolEditor } from './GlobalAffixPoolEditor'

function renderEditor(initialState: Partial<AppState> = {}) {
  return render(
    <AppStateProvider initialState={{ ...createInitialAppState(), ...initialState }}>
      <GlobalAffixPoolEditor />
    </AppStateProvider>,
  )
}

describe('GlobalAffixPoolEditor', () => {
  it('reflects the current enabled state in the toggle', () => {
    renderEditor({ globalAffixPool: { enabled: true, affixIds: [], greaterAffixIds: [] } })

    expect(screen.getByLabelText('Enable global affix pool')).toBeChecked()
  })

  it('reflects a disabled state in the toggle', () => {
    renderEditor({ globalAffixPool: { enabled: false, affixIds: [], greaterAffixIds: [] } })

    expect(screen.getByLabelText('Enable global affix pool')).not.toBeChecked()
  })

  it('enables the pool when the toggle is switched on', async () => {
    const user = userEvent.setup()
    renderEditor({ globalAffixPool: { enabled: false, affixIds: [], greaterAffixIds: [] } })

    await user.click(screen.getByLabelText('Enable global affix pool'))

    expect(screen.getByLabelText('Enable global affix pool')).toBeChecked()
  })

  it('disables the pool when the toggle is switched off', async () => {
    const user = userEvent.setup()
    renderEditor({ globalAffixPool: { enabled: true, affixIds: [], greaterAffixIds: [] } })

    await user.click(screen.getByLabelText('Enable global affix pool'))

    expect(screen.getByLabelText('Enable global affix pool')).not.toBeChecked()
  })

  it('renders the affix pickers bound to the global pool lists', () => {
    renderEditor({ globalAffixPool: { enabled: true, affixIds: [], greaterAffixIds: [] } })

    expect(screen.getByRole('group', { name: 'Affixes' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Greater affixes' })).toBeInTheDocument()
  })

  it('adds a selected affix to the global pool', async () => {
    const user = userEvent.setup()
    renderEditor({ globalAffixPool: { enabled: true, affixIds: [], greaterAffixIds: [] } })

    await user.type(screen.getByRole('combobox', { name: 'Search Affixes' }), 'abyss damage')
    await user.click(screen.getByRole('option', { name: 'abyss damage' }))

    expect(screen.getByText('abyss damage')).toBeInTheDocument()
  })

  it('renders no minimum count field', () => {
    renderEditor({ globalAffixPool: { enabled: true, affixIds: [], greaterAffixIds: [] } })

    expect(screen.queryByLabelText('At least')).not.toBeInTheDocument()
  })

  it('clears both lists when "Clear affix pool" is clicked', async () => {
    const user = userEvent.setup()
    renderEditor({
      globalAffixPool: { enabled: true, affixIds: ['abyss_damage'], greaterAffixIds: ['advance_resource_generation'] },
    })

    await user.click(screen.getByRole('button', { name: 'Clear affix pool' }))

    expect(screen.queryByText('abyss damage')).not.toBeInTheDocument()
    expect(screen.queryByText('advance resource generation')).not.toBeInTheDocument()
  })

  it('does not render the clear button when both lists are already empty', () => {
    renderEditor({ globalAffixPool: { enabled: true, affixIds: [], greaterAffixIds: [] } })

    expect(screen.queryByRole('button', { name: 'Clear affix pool' })).not.toBeInTheDocument()
  })
})
