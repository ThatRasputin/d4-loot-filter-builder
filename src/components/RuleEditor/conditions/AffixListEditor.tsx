import { AffixListPicker } from './AffixListPicker'

export interface AffixListPatch {
  affixIds?: string[]
  greaterAffixIds?: string[]
  minimumCount?: number
}

interface AffixListEditorProps {
  legend: string
  affixIds: string[]
  greaterAffixIds: string[]
  minimumCount: number
  onChange: (patch: AffixListPatch) => void
}

// Shared by HasRequiredAffixesEditor and HasOptionalAffixesEditor (#10) — the two condition
// types are mechanically identical (same fields, split only for filter-author readability),
// so the entire editor implementation lives here and each wrapper just adapts field names.
export function AffixListEditor({ legend, affixIds, greaterAffixIds, minimumCount, onChange }: AffixListEditorProps) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      <AffixListPicker affixIds={affixIds} greaterAffixIds={greaterAffixIds} onChange={onChange} />
      <label>
        At least
        <input
          type="number"
          min={0}
          value={minimumCount}
          onChange={(event) => onChange({ minimumCount: Math.max(0, Number(event.target.value) || 0) })}
        />
      </label>
    </fieldset>
  )
}
