import { useEffect, useRef } from 'react'
import { GlobalAffixPoolEditor } from './GlobalAffixPoolEditor'

interface GlobalAffixPoolDialogProps {
  isOpen: boolean
  onClose: () => void
}

// Native <dialog> for focus-trapping and Escape-to-close for free. showModal()/close() are
// imperative, so a ref + effect keeps the element in sync with the isOpen prop. The close
// button calls the onClose prop directly rather than dialog.close() — the dialog's native
// 'close' event doesn't reliably reach React (it fires as a non-bubbling DOM event and isn't
// guaranteed to reach the onClose prop in every environment), so routing state changes through
// it would desync React state from the DOM after the first close, leaving the dialog unable to
// reopen. onClose is still wired to the 'close' event as a backup for the Escape-key path,
// where there's no button click to hook into.
export function GlobalAffixPoolDialog({ isOpen, onClose }: GlobalAffixPoolDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  return (
    <dialog ref={dialogRef} onClose={onClose} aria-label="Global affix pool">
      <button type="button" aria-label="Close" onClick={onClose}>
        ✕
      </button>
      <GlobalAffixPoolEditor />
    </dialog>
  )
}
