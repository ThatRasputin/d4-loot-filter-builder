import { useAppState } from '@state/useAppState'
import { GlobalAffixPoolEditor } from './GlobalAffixPoolEditor'

// Always-visible companion to GlobalAffixPoolDialog: while the modal is the full management
// surface reachable from the toolbar, this card surfaces the same editor inline above the rule
// list whenever the pool is actually active, so it doesn't take a dialog round-trip to see or
// adjust what every rule is currently inheriting from. Unmounts entirely when disabled, matching
// this app's general "don't show controls for a feature nobody has turned on" convention (#21).
export function GlobalAffixPoolCard() {
  const { state } = useAppState()

  if (!state.globalAffixPool.enabled) return null

  return (
    <section aria-label="Global affix pool">
      <h2>Global Affix Pool</h2>
      <GlobalAffixPoolEditor />
    </section>
  )
}
