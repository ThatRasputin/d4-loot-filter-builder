import { AFFIX_POOL } from '@core/data/affixPool'
import { Combobox } from './Combobox/Combobox'

export interface AffixListPatch {
  affixIds?: string[]
  greaterAffixIds?: string[]
}

interface AffixListPickerProps {
  affixIds: string[]
  greaterAffixIds: string[]
  onChange: (patch: AffixListPatch) => void
}

// The two-combobox picker shared by the per-rule AffixListEditor and the global affix pool
// editor — pulled out of AffixListEditor so the global pool (which has no count field) can
// reuse it without dragging the minimumCount input along.
export function AffixListPicker({ affixIds, greaterAffixIds, onChange }: AffixListPickerProps) {
  return (
    <>
      <Combobox label="Affixes" pool={AFFIX_POOL} selectedIds={affixIds} onChange={(ids) => onChange({ affixIds: ids })} />
      <Combobox
        label="Greater affixes"
        pool={AFFIX_POOL}
        selectedIds={greaterAffixIds}
        onChange={(ids) => onChange({ greaterAffixIds: ids })}
      />
    </>
  )
}
