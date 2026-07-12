interface AppToolbarProps {
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onOpenGlobalAffixPool: () => void
}

export function AppToolbar({ canUndo, canRedo, onUndo, onRedo, onOpenGlobalAffixPool }: AppToolbarProps) {
  return (
    <div>
      <button type="button" onClick={onUndo} disabled={!canUndo}>
        Undo
      </button>
      <button type="button" onClick={onRedo} disabled={!canRedo}>
        Redo
      </button>
      <button type="button" onClick={onOpenGlobalAffixPool}>
        Global Affix Pool…
      </button>
    </div>
  )
}
