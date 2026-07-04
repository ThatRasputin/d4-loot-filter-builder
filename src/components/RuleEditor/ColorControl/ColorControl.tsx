import { HexInput } from './HexInput'
import { RecentSwatches } from './RecentSwatches'

interface ColorControlProps {
  color: string
  recentColors: string[]
  onChangeColor: (color: string) => void
}

export function ColorControl({ color, recentColors, onChangeColor }: ColorControlProps) {
  return (
    <div>
      <input
        type="color"
        aria-label="Color wheel"
        value={color}
        onChange={(event) => onChangeColor(event.target.value)}
      />
      <HexInput color={color} onCommit={onChangeColor} />
      <RecentSwatches colors={recentColors} onApply={onChangeColor} />
    </div>
  )
}
