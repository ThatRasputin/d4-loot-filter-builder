interface RecentSwatchesProps {
  colors: string[]
  onApply: (color: string) => void
}

export function RecentSwatches({ colors, onApply }: RecentSwatchesProps) {
  if (colors.length === 0) return null

  return (
    <div>
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          aria-label={color}
          onClick={() => onApply(color)}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
}
