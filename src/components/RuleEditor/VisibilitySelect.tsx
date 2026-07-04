import type { RuleVisibility } from '@core/types/rule'

interface VisibilitySelectProps {
  visibility: RuleVisibility
  onChange: (visibility: RuleVisibility) => void
}

const VISIBILITY_LABELS: Record<RuleVisibility, string> = {
  show: 'Show',
  recolor: 'Recolor',
  hideText: 'Hide text label',
  hideAll: 'Hide all',
}

export function VisibilitySelect({ visibility, onChange }: VisibilitySelectProps) {
  return (
    <select
      aria-label="Visibility"
      value={visibility}
      onChange={(event) => onChange(event.target.value as RuleVisibility)}
    >
      {Object.entries(VISIBILITY_LABELS).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  )
}
