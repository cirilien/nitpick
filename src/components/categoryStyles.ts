const CATEGORY_COLORS: Record<string, { light: string; dark: string }> = {
  weasel_filler: { light: "#f6e4a8", dark: "#5c4a1e" },
  weasel_stance: { light: "#c8e6c0", dark: "#2a4a28" },
};

const FALLBACK = { light: "#e0e0e0", dark: "#444444" };

export function getCategoryColor(category: string, isDark: boolean): string {
  const colors = CATEGORY_COLORS[category] ?? FALLBACK;
  return isDark ? colors.dark : colors.light;
}
