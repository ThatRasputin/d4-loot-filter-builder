const MAX_RECENT_COLORS = 6

export function pushRecentColor(recentColors: string[], color: string): string[] {
  const withoutExisting = recentColors.filter((existing) => existing !== color)
  return [color, ...withoutExisting].slice(0, MAX_RECENT_COLORS)
}
