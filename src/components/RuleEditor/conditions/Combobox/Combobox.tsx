import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import Fuse from 'fuse.js'
import { useVirtualizer } from '@tanstack/react-virtual'
import { SelectedChips } from '../SelectedChips'

export interface ComboboxEntry {
  id: string
  displayName: string
}

interface ComboboxProps<T extends ComboboxEntry> {
  label: string
  pool: T[]
  selectedIds: string[]
  onChange: (nextSelectedIds: string[]) => void
}

const ROW_HEIGHT_PX = 32
const LISTBOX_HEIGHT_PX = 240

// Search-driven multi-select for large flat pools (AFFIX_POOL is 877 entries): a single
// combobox input, fuzzy-ranked via Fuse.js, rendered through a virtualized listbox so the
// DOM cost stays constant regardless of how many entries match. Unlike ChipPicker's grouped
// checklist (right for ITEM_TYPE_POOL's ~27 categorized entries with bulk "select all"),
// there's no natural grouping or bulk-select semantic for a flat 877-entry pool — this is
// the "add one at a time via search" interaction issue #10 actually asked for.
export function Combobox<T extends ComboboxEntry>({ label, pool, selectedIds, onChange }: ComboboxProps<T>) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()

  const selectedEntries = useMemo(() => pool.filter((entry) => selectedIds.includes(entry.id)), [pool, selectedIds])
  const availableEntries = useMemo(() => pool.filter((entry) => !selectedIds.includes(entry.id)), [pool, selectedIds])

  const fuse = useMemo(() => new Fuse(availableEntries, { keys: ['displayName'], threshold: 0.4 }), [availableEntries])

  const matches = useMemo(() => {
    if (!query) return availableEntries
    return fuse.search(query).map((result) => result.item)
  }, [query, fuse, availableEntries])

  const virtualizer = useVirtualizer({
    count: matches.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT_PX,
    overscan: 8,
  })

  useEffect(() => {
    if (isOpen && activeIndex >= 0) {
      virtualizer.scrollToIndex(activeIndex, { align: 'auto' })
    }
  }, [isOpen, activeIndex, virtualizer])

  function openDropdown() {
    setIsOpen(true)
    setActiveIndex((current) => (current >= 0 && current < matches.length ? current : matches.length > 0 ? 0 : -1))
  }

  function selectEntry(entry: T) {
    onChange([...selectedIds, entry.id])
    setQuery('')
    setIsOpen(false)
    setActiveIndex(-1)
    inputRef.current?.focus()
  }

  function handleRemove(id: string) {
    onChange(selectedIds.filter((selectedId) => selectedId !== id))
  }

  function handleDeselectAll() {
    onChange([])
  }

  function handleQueryChange(value: string) {
    setQuery(value)
    setIsOpen(true)
    setActiveIndex(0)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!isOpen) {
        openDropdown()
        return
      }
      setActiveIndex((current) => Math.min(current + 1, matches.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => Math.max(current - 1, 0))
    } else if (event.key === 'Enter') {
      if (isOpen && activeIndex >= 0 && matches[activeIndex]) {
        event.preventDefault()
        selectEntry(matches[activeIndex])
      }
    } else if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const activeOptionId = activeIndex >= 0 && activeIndex < matches.length ? `${listboxId}-option-${activeIndex}` : undefined

  return (
    <fieldset>
      <legend>{label}</legend>

      <SelectedChips entries={selectedEntries} onRemove={handleRemove} />

      {selectedIds.length > 0 && (
        <button type="button" aria-label={`Deselect all ${label}`} onClick={handleDeselectAll}>
          Deselect all
        </button>
      )}

      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-label={`Search ${label}`}
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={activeOptionId}
        placeholder={`Search ${label}`}
        value={query}
        onChange={(event) => handleQueryChange(event.target.value)}
        onFocus={openDropdown}
        onBlur={() => setIsOpen(false)}
        onKeyDown={handleKeyDown}
      />

      {isOpen && matches.length === 0 && <p>No matches found</p>}

      {isOpen && matches.length > 0 && (
        <div ref={scrollRef} role="listbox" id={listboxId} aria-label={label} style={{ height: LISTBOX_HEIGHT_PX, overflow: 'auto' }}>
          <div style={{ height: virtualizer.getTotalSize(), position: 'relative', width: '100%' }}>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const entry = matches[virtualRow.index]
              return (
                <div
                  key={entry.id}
                  id={`${listboxId}-option-${virtualRow.index}`}
                  role="option"
                  aria-selected={virtualRow.index === activeIndex}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    selectEntry(entry)
                  }}
                  onMouseEnter={() => setActiveIndex(virtualRow.index)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {entry.displayName}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </fieldset>
  )
}
