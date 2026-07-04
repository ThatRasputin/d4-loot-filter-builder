import { useEffect, useState, type KeyboardEvent } from 'react'

interface HexInputProps {
  color: string
  onCommit: (color: string) => void
}

const HEX_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

export function HexInput({ color, onCommit }: HexInputProps) {
  const [draft, setDraft] = useState(color)

  useEffect(() => {
    setDraft(color)
  }, [color])

  function commit() {
    if (!HEX_PATTERN.test(draft)) {
      setDraft(color)
      return
    }

    if (draft !== color) {
      onCommit(draft)
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      commit()
    }
  }

  return (
    <input
      type="text"
      aria-label="Hex color"
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={handleKeyDown}
    />
  )
}
