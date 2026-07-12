import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppStateProvider } from '@state/AppStateContext'
import { createInitialAppState } from '@state/appState'
import type { AppState } from '@state/appState'
import { GlobalAffixPoolCard } from './GlobalAffixPoolCard'

function renderCard(initialState: Partial<AppState> = {}) {
  return render(
    <AppStateProvider initialState={{ ...createInitialAppState(), ...initialState }}>
      <GlobalAffixPoolCard />
    </AppStateProvider>,
  )
}

describe('GlobalAffixPoolCard', () => {
  it('renders nothing when the global affix pool is disabled', () => {
    renderCard({ globalAffixPool: { enabled: false, affixIds: [], greaterAffixIds: [] } })

    expect(screen.queryByRole('region', { name: 'Global affix pool' })).not.toBeInTheDocument()
  })

  it('renders as a labeled section when the global affix pool is enabled', () => {
    renderCard({ globalAffixPool: { enabled: true, affixIds: [], greaterAffixIds: [] } })

    expect(screen.getByRole('region', { name: 'Global affix pool' })).toBeInTheDocument()
  })

  it('renders the global affix pool editor inside the card', () => {
    renderCard({ globalAffixPool: { enabled: true, affixIds: [], greaterAffixIds: [] } })

    expect(screen.getByLabelText('Enable global affix pool')).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Affixes' })).toBeInTheDocument()
  })

  it('shows the current global pool selections inside the card', () => {
    renderCard({ globalAffixPool: { enabled: true, affixIds: ['abyss_damage'], greaterAffixIds: [] } })

    expect(screen.getByText('abyss damage')).toBeInTheDocument()
  })
})
