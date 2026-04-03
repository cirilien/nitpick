export interface TextRange {
  start: number;
  end: number;
}

/** Quote pairs: [open, close] */
const QUOTE_PAIRS: [string, string][] = [
  ['"', '"'], // straight double
  ['\u201C', '\u201D'], // curly double  " "
];

/**
 * Find all dialogue ranges (quoted text) in a string.
 * Returns non-overlapping ranges sorted by start position.
 * Each range spans from the opening quote to the closing quote (inclusive).
 */
export function findDialogueRanges(text: string): TextRange[] {
  const ranges: TextRange[] = [];

  for (const [open, close] of QUOTE_PAIRS) {
    let i = 0;
    while (i < text.length) {
      const openIdx = text.indexOf(open, i);
      if (openIdx === -1) break;

      const closeIdx = text.indexOf(close, openIdx + 1);
      if (closeIdx === -1) break;

      ranges.push({ start: openIdx, end: closeIdx + 1 });
      i = closeIdx + 1;
    }
  }

  // Sort by start, then merge overlapping ranges
  ranges.sort((a, b) => a.start - b.start);
  return mergeOverlapping(ranges);
}

function mergeOverlapping(ranges: TextRange[]): TextRange[] {
  if (ranges.length === 0) return ranges;

  const merged: TextRange[] = [ranges[0]];
  for (let i = 1; i < ranges.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = ranges[i];
    if (curr.start <= prev.end) {
      prev.end = Math.max(prev.end, curr.end);
    } else {
      merged.push(curr);
    }
  }
  return merged;
}

/**
 * Check whether a highlight overlaps any dialogue range.
 * Assumes dialogueRanges is sorted and non-overlapping.
 */
export function overlapsDialogue(
  highlight: { start: number; end: number },
  dialogueRanges: TextRange[],
): boolean {
  // Binary search for the first range that could overlap
  let lo = 0;
  let hi = dialogueRanges.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const range = dialogueRanges[mid];
    if (range.end <= highlight.start) {
      lo = mid + 1;
    } else if (range.start >= highlight.end) {
      hi = mid - 1;
    } else {
      return true; // overlap
    }
  }
  return false;
}
