import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark(!dark)}
      className="text-xs px-2 py-1 rounded border border-surface/30 dark:border-dark-surface/30 text-surface/70 dark:text-dark-surface/70 hover:text-surface dark:hover:text-dark-surface transition-colors"
    >
      {dark ? "Light mode" : "Dark mode"}
    </button>
  );
}
