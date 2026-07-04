import { useState, type KeyboardEvent } from 'react'

interface RuleTitleProps {
  name: string
  onRename: (name: string) => void
}

export function RuleTitle({ name, onRename }: RuleTitleProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(name)

  function startEditing() {
    setDraft(name)
    setIsEditing(true)
  }

  function commit() {
    const trimmed = draft.trim()
    if (trimmed.length > 0 && trimmed !== name) {
      onRename(trimmed)
    }
    setIsEditing(false)
  }

  function cancel() {
    setDraft(name)
    setIsEditing(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      commit()
    } else if (event.key === 'Escape') {
      cancel()
    }
  }

  if (isEditing) {
    return (
      <input
        type="text"
        value={draft}
        autoFocus
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
      />
    )
  }

  return (
    <span>
      {name}
      <button type="button" aria-label="Rename rule" onClick={startEditing}>
        ✎
      </button>
    </span>
  )
}
