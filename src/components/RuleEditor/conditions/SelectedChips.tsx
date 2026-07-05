export interface SelectedChipsEntry {
  id: string
  displayName: string
}

interface SelectedChipsProps<T extends SelectedChipsEntry> {
  entries: T[]
  onRemove: (id: string) => void
}

// Shared by ChipPicker and Combobox — both render the current selection as removable chips
// identically; only how new entries get added (checkbox list vs. searchable dropdown) differs.
export function SelectedChips<T extends SelectedChipsEntry>({ entries, onRemove }: SelectedChipsProps<T>) {
  return (
    <div>
      {entries.map((entry) => (
        <button key={entry.id} type="button" aria-label={`Remove ${entry.displayName}`} onClick={() => onRemove(entry.id)}>
          {entry.displayName}
        </button>
      ))}
    </div>
  )
}
