import { useState } from 'react'

export interface ChipPickerEntry {
  id: string
  displayName: string
}

export interface ChipPickerProps<T extends ChipPickerEntry> {
  label: string
  pool: T[]
  selectedIds: string[]
  onChange: (nextSelectedIds: string[]) => void
  groupBy?: (entry: T) => string
  groupLabels?: Record<string, string>
}

export function ChipPicker<T extends ChipPickerEntry>({
  label,
  pool,
  selectedIds,
  onChange,
  groupBy,
  groupLabels,
}: ChipPickerProps<T>) {
  const [search, setSearch] = useState('')

  const selectedEntries = pool.filter((entry) => selectedIds.includes(entry.id))
  const filteredPool = pool.filter((entry) => entry.displayName.toLowerCase().includes(search.toLowerCase()))

  function handleToggle(id: string) {
    const next = selectedIds.includes(id) ? selectedIds.filter((selectedId) => selectedId !== id) : [...selectedIds, id]
    onChange(next)
  }

  function handleRemove(id: string) {
    onChange(selectedIds.filter((selectedId) => selectedId !== id))
  }

  function handleDeselectAll() {
    onChange([])
  }

  function groupEntries(entries: T[]): Array<{ key: string; label: string; entries: T[] }> {
    if (!groupBy) return [{ key: '', label: '', entries }]

    const entriesByGroup = new Map<string, T[]>()
    for (const entry of entries) {
      const key = groupBy(entry)
      const existing = entriesByGroup.get(key)
      if (existing) {
        existing.push(entry)
      } else {
        entriesByGroup.set(key, [entry])
      }
    }

    // groupLabels, when provided, defines the full canonical set of groups (in order) so a
    // category with zero matching entries (e.g. Talisman, which ITEM_TYPE_POOL has none of
    // yet) still renders its own empty fieldset instead of silently disappearing.
    const groupKeys = groupLabels ? Object.keys(groupLabels) : Array.from(entriesByGroup.keys())

    return groupKeys.map((key) => ({
      key,
      label: groupLabels?.[key] ?? key,
      entries: entriesByGroup.get(key) ?? [],
    }))
  }

  function handleSelectAllInGroup(groupEntriesList: T[]) {
    const groupIds = groupEntriesList.map((entry) => entry.id)
    const allSelected = groupIds.every((id) => selectedIds.includes(id))
    const next = allSelected
      ? selectedIds.filter((id) => !groupIds.includes(id))
      : [...selectedIds, ...groupIds.filter((id) => !selectedIds.includes(id))]
    onChange(next)
  }

  const groups = groupEntries(filteredPool)

  return (
    <fieldset>
      <legend>{label}</legend>

      <div>
        {selectedEntries.map((entry) => (
          <button key={entry.id} type="button" aria-label={`Remove ${entry.displayName}`} onClick={() => handleRemove(entry.id)}>
            {entry.displayName}
          </button>
        ))}
      </div>

      {selectedIds.length > 0 && (
        <button type="button" aria-label={`Deselect all ${label}`} onClick={handleDeselectAll}>
          Deselect all
        </button>
      )}

      <input
        type="search"
        aria-label={`Search ${label}`}
        placeholder={`Search ${label}`}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {groups.map((group) => (
        <fieldset key={group.key}>
          {group.label && <legend>{group.label}</legend>}
          {group.label && (
            <label>
              <input
                type="checkbox"
                aria-label={`Select all ${group.label}`}
                checked={group.entries.length > 0 && group.entries.every((entry) => selectedIds.includes(entry.id))}
                onChange={() => handleSelectAllInGroup(group.entries)}
              />
              Select all
            </label>
          )}
          {group.entries.map((entry) => (
            <label key={entry.id}>
              <input type="checkbox" checked={selectedIds.includes(entry.id)} onChange={() => handleToggle(entry.id)} />
              {entry.displayName}
            </label>
          ))}
        </fieldset>
      ))}
    </fieldset>
  )
}
