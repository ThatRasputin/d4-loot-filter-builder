interface AppToolbarProps {
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
}

export function AppToolbar({ canUndo, canRedo, onUndo, onRedo }: AppToolbarProps) {
  return (
    <div>
      <button type="button" onClick={onUndo} disabled={!canUndo}>
        Undo
      </button>
      <button type="button" onClick={onRedo} disabled={!canRedo}>
        Redo
      </button>
    </div>
  )
}
