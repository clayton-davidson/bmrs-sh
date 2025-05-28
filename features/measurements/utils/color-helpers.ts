export function getColorForLevel(level: number): string {
  if (level < 20) return "#EF4444"; // Red
  if (level < 40) return "#F59E0B"; // Amber
  return "#10B981"; // Green
}

export function getDarkerColorForLevel(level: number): string {
  if (level < 20) return "#B91C1C"; // Dark red
  if (level < 40) return "#D97706"; // Dark amber
  return "#059669"; // Dark green
}

export function getLighterColorForLevel(level: number): string {
  if (level < 20) return "#FEE2E2"; // Light red
  if (level < 40) return "#FEF3C7"; // Light amber
  return "#D1FAE5"; // Light green
}
