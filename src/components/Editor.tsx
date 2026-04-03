interface EditorProps {
  text: string;
  onChange: (text: string) => void;
}

export function Editor({ text, onChange }: EditorProps) {
  return (
    <textarea
      cols={1}
      className="w-full h-full min-w-0 resize-none bg-transparent p-0 text-base leading-relaxed focus:outline-none placeholder:text-text-muted dark:placeholder:text-dark-text-muted font-serif"
      placeholder="Paste or type your prose here."
      value={text}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
