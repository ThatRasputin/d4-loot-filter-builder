interface RuleListToolbarProps {
  onAddRule: () => void
  onEnableAll: () => void
  onDisableAll: () => void
}

export function RuleListToolbar({ onAddRule, onEnableAll, onDisableAll }: RuleListToolbarProps) {
  return (
    <div>
      <button type="button" onClick={onAddRule}>
        Add rule
      </button>
      <button type="button" onClick={onEnableAll}>
        Enable all
      </button>
      <button type="button" onClick={onDisableAll}>
        Disable all
      </button>
    </div>
  )
}
