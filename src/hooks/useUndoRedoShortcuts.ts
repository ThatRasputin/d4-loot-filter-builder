import { useEffect } from 'react'
import { isEditableElement } from './isEditableElement'

interface UseUndoRedoShortcutsOptions {
  undo: () => void
  redo: () => void
}

export function useUndoRedoShortcuts({ undo, redo }: UseUndoRedoShortcutsOptions): void {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableElement(event.target)) return

      const modifierPressed = event.ctrlKey || event.metaKey
      if (!modifierPressed) return

      if (event.key === 'z' && !event.shiftKey) {
        event.preventDefault()
        undo()
        return
      }

      if (event.key === 'y' || (event.key === 'z' && event.shiftKey)) {
        event.preventDefault()
        redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])
}
