import { useTheme } from "./ThemeContext";

export function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      className="text-xs px-2 py-1 rounded border border-surface/30 dark:border-dark-surface/30 text-surface/70 dark:text-dark-surface/70 hover:text-surface dark:hover:text-dark-surface transition-colors"
    >
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}
