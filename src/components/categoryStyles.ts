const CATEGORY_COLORS: Record<string, { light: string; dark: string }> = {
  weasel_filler: { light: "#f6e4a8", dark: "#ce9c23" },
  weasel_stance: { light: "#c8e6c0", dark: "#48ab73" },
  repetition: { light: "#d4c5f0", dark: "#9b72cf" },
  filter_sight: { light: "#bfdbfe", dark: "#5b9bd5" },
  filter_sound: { light: "#b2dfdb", dark: "#4db6ac" },
  filter_touch: { light: "#ffe0b2", dark: "#e09540" },
  filter_smell: { light: "#f8bbd0", dark: "#d4619a" },
  filter_taste: { light: "#f4a6a0", dark: "#c94d4d" },
  filter_cognition: { light: "#ffe082", dark: "#d4a017" },
  filter_emotion: { light: "#d5c4e6", dark: "#9a7bb5" },
  filter_seeming: { light: "#cfd8dc", dark: "#90a4ae" },
  adverb_ly: { light: "#f0c4a8", dark: "#d4845a" },
  adverb_irregular: { light: "#c4d8a8", dark: "#8aad5a" },
};

const FALLBACK = { light: "#e0e0e0", dark: "#bbbbbb" };

export function getCategoryColor(category: string, isDark: boolean): string {
  const colors = CATEGORY_COLORS[category] ?? FALLBACK;
  return isDark ? colors.dark : colors.light;
}
