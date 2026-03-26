interface EditorProps {
	text: string;
	onChange: (text: string) => void;
}

export function Editor({ text, onChange }: EditorProps) {
	return (
		<textarea
			className="w-full h-full resize-none rounded-lg border border-surface-border dark:border-dark-surface-border bg-surface-raised dark:bg-dark-surface-raised p-4 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent placeholder:text-text-muted dark:placeholder:text-dark-text-muted font-serif"
			placeholder="Paste or type your prose here. NitPick will analyze it for clarity, conciseness, and style."
			value={text}
			onChange={(e) => onChange(e.target.value)}
		/>
	);
}
