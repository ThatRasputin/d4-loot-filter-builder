import { useCallback, useReducer } from 'react'
import { canRedo, canUndo, push, redo as redoHistory, undo as undoHistory } from '@core/history/createHistory'
import { createHistory } from '@core/types/history'
import type { History } from '@core/types/history'
import type { AppAction } from './actions'
import { appReducer } from './appReducer'
import type { AppState } from './appState'

type HistoryAction = { type: 'DISPATCH'; action: AppAction } | { type: 'UNDO' } | { type: 'REDO' }

function historyReducer(history: History<AppState>, action: HistoryAction): History<AppState> {
  switch (action.type) {
    case 'DISPATCH':
      return push(history, appReducer(history.present, action.action))
    case 'UNDO':
      return undoHistory(history)
    case 'REDO':
      return redoHistory(history)
    default: {
      const exhaustiveCheck: never = action
      return exhaustiveCheck
    }
  }
}

export interface AppHistoryController {
  state: AppState
  dispatch: (action: AppAction) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

export function useAppHistory(initialState: AppState): AppHistoryController {
  const [history, dispatchHistoryAction] = useReducer(historyReducer, initialState, createHistory)

  const dispatch = useCallback((action: AppAction) => dispatchHistoryAction({ type: 'DISPATCH', action }), [])
  const undo = useCallback(() => dispatchHistoryAction({ type: 'UNDO' }), [])
  const redo = useCallback(() => dispatchHistoryAction({ type: 'REDO' }), [])

  return {
    state: history.present,
    dispatch,
    undo,
    redo,
    canUndo: canUndo(history),
    canRedo: canRedo(history),
  }
}
