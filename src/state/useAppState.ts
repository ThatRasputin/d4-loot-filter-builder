import { useContext } from 'react'
import { AppStateContext } from './appStateContextObject'
import type { AppHistoryController } from './useAppHistory'

export function useAppState(): AppHistoryController {
  const context = useContext(AppStateContext)
  if (context === null) {
    throw new Error('useAppState must be used within an AppStateProvider')
  }
  return context
}
