interface EditorProps {
  text: string;
  onChange: (text: string) => void;
}

export function Editor({ text, onChange }: EditorProps) {
  return (
    <textarea
      className="w-full h-full resize-none rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
      placeholder="Paste or type your prose here. NitPick will analyze it for clarity, conciseness, and style."
      value={text}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
