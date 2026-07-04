import { createContext } from 'react'
import type { AppHistoryController } from './useAppHistory'

export const AppStateContext = createContext<AppHistoryController | null>(null)
