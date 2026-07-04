import type { ReactNode } from 'react'
import { AppStateContext } from './appStateContextObject'
import type { AppState } from './appState'
import { createInitialAppState } from './appState'
import { useAppHistory } from './useAppHistory'

interface AppStateProviderProps {
  children: ReactNode
  initialState?: AppState
}

export function AppStateProvider({ children, initialState = createInitialAppState() }: AppStateProviderProps) {
  const controller = useAppHistory(initialState)
  return <AppStateContext.Provider value={controller}>{children}</AppStateContext.Provider>
}
