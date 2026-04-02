import type { Root } from "nlcst";
import { toString as nlcstToString } from "nlcst-to-string";
import { visit } from "unist-util-visit";
import type { Highlight } from "../../boundaryTypes";
import { highlightOffsets } from "../highlightOffsets";
import { COMMON_WORDS } from "./commonWords";

const DISTANCE_THRESHOLD = 200;
const MIN_WORD_LENGTH = 3;

interface WordOccurrence {
  wordIndex: number;
  start: number;
  end: number;
  originalText: string;
}

export function wordRepetition(tree: Root): Highlight[] {
  // Collect all words in document order
  const words: {
    lower: string;
    start: number;
    end: number;
    original: string;
  }[] = [];

  visit(tree, "WordNode", (node) => {
    const text = nlcstToString(node);
    const offsets = highlightOffsets(node);
    if (!offsets) return;
    words.push({
      lower: text.toLowerCase(),
      start: offsets.start,
      end: offsets.end,
      original: text,
    });
  });

  // Track last occurrence of each word
  const lastSeen = new Map<string, WordOccurrence>();
  // Track which character offsets we've already flagged
  const flagged = new Set<number>();
  const highlights: Highlight[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word.lower.length < MIN_WORD_LENGTH) continue;
    if (COMMON_WORDS.has(word.lower)) continue;

    const prev = lastSeen.get(word.lower);
    if (prev && i - prev.wordIndex <= DISTANCE_THRESHOLD) {
      const distance = i - prev.wordIndex;

      // Flag previous occurrence if not already flagged
      if (!flagged.has(prev.start)) {
        flagged.add(prev.start);
        highlights.push({
          start: prev.start,
          end: prev.end,
          label: `Repeated: "${prev.originalText}" (${distance} words apart)`,
          category: "repetition",
          group: word.lower,
        });
      }

      // Flag current occurrence
      if (!flagged.has(word.start)) {
        flagged.add(word.start);
        highlights.push({
          start: word.start,
          end: word.end,
          label: `Repeated: "${word.original}" (${distance} words apart)`,
          category: "repetition",
          group: word.lower,
        });
      }
    }

    lastSeen.set(word.lower, {
      wordIndex: i,
      start: word.start,
      end: word.end,
      originalText: word.original,
    });
  }

  return highlights;
}
