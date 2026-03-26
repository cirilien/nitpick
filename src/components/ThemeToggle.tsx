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
			className="text-xs px-2 py-1 rounded border border-surface-border dark:border-dark-surface-border text-text-muted dark:text-dark-text-muted hover:text-text dark:hover:text-dark-text transition-colors"
		>
			{dark ? "Light" : "Dark"}
		</button>
	);
}
