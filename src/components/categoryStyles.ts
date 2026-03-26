const CATEGORY_COLORS: Record<string, { light: string; dark: string }> = {
  weasel_filler: { light: "#f6e4a8", dark: "#ce9c23" },
  weasel_stance: { light: "#c8e6c0", dark: "#48ab73" },
};

const FALLBACK = { light: "#e0e0e0", dark: "#bbbbbb" };

export function getCategoryColor(category: string, isDark: boolean): string {
  const colors = CATEGORY_COLORS[category] ?? FALLBACK;
  return isDark ? colors.dark : colors.light;
}
