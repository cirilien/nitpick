import type { Highlight } from "../boundaryTypes";

type HighlightedTextProps = {
  text: string;
  highlights: Highlight[];
};

export function HighlightedText({ text, highlights }: HighlightedTextProps) {
  if (highlights.length === 0) {
    return <span className="whitespace-pre-wrap">{text}</span>;
  }

  const sorted = highlights.toSorted((a, b) => a.start - b.start);
  const parts: React.ReactNode[] = [];

  let cursor = 0;
  for (const h of sorted) {
    if (h.start > cursor) {
      parts.push(text.slice(cursor, h.start));
    }
    parts.push(
      <mark
        key={`${h.start}-${h.end}`}
        title={h.label}
        style={{ backgroundColor: "palegreen", borderRadius: "2px" }}
        className="px-0.5 cursor-help"
      >
        {text.slice(h.start, h.end)}
      </mark>,
    );
    cursor = h.end;
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return <span className="whitespace-pre-wrap">{parts}</span>;
}
