import type { Root, SentenceContent } from "nlcst";
import { toString as nlcstToString } from "nlcst-to-string";
import { visit } from "unist-util-visit";
import type { Highlight } from "../../boundaryTypes";
import { highlightOffsets } from "../highlightOffsets";

const TIER1_WORDS = new Set([
  "very",
  "really",
  "just",
  "quite",
  "rather",
  "somewhat",
  "slightly",
  "basically",
  "essentially",
  "actually",
  "simply",
  "literally",
  "practically",
  "totally",
  "utterly",
  "extremely",
  "fairly",
  "somehow",
]);

const TIER2_WORDS = new Set([
  "perhaps",
  "apparently",
  "presumably",
  "supposedly",
  "seemingly",
  "arguably",
  "hopefully",
  "naturally",
  "obviously",
  "clearly",
  "certainly",
  "definitely",
  "surely",
  "honestly",
  "frankly",
]);

const PHRASES: string[][] = [
  ["a", "bit"],
  ["a", "little"],
  ["kind", "of"],
  ["sort", "of"],
];

/** Build a lookup from first word → list of phrases starting with that word */
const PHRASE_STARTS = new Map<string, string[][]>();
for (const phrase of PHRASES) {
  const key = phrase[0];
  const existing = PHRASE_STARTS.get(key);
  if (existing) existing.push(phrase);
  else PHRASE_STARTS.set(key, [phrase]);
}

function isWord(
  node: SentenceContent,
): node is SentenceContent & { type: "WordNode" } {
  return node.type === "WordNode";
}

/**
 * Try to match a phrase starting at `startIdx` in the children array.
 * Returns the index of the last matched WordNode, or -1 if no match.
 */
function matchPhrase(
  children: SentenceContent[],
  startIdx: number,
  phrase: string[],
): number {
  let phraseIdx = 0;
  let lastMatchIdx = -1;

  for (
    let i = startIdx;
    i < children.length && phraseIdx < phrase.length;
    i++
  ) {
    const child = children[i];
    if (child.type === "WhiteSpaceNode") continue;
    if (!isWord(child)) return -1;

    if (nlcstToString(child).toLowerCase() !== phrase[phraseIdx]) return -1;

    lastMatchIdx = i;
    phraseIdx++;
  }

  return phraseIdx === phrase.length ? lastMatchIdx : -1;
}

export function weaselWords(tree: Root): Highlight[] {
  const highlights: Highlight[] = [];

  visit(tree, "SentenceNode", (sentence) => {
    const children = sentence.children as SentenceContent[];
    const skip = new Set<number>();

    for (let i = 0; i < children.length; i++) {
      if (skip.has(i)) continue;
      const child = children[i];
      if (!isWord(child)) continue;

      const word = nlcstToString(child);
      const lower = word.toLowerCase();

      // Check for phrase match first
      const candidates = PHRASE_STARTS.get(lower);
      if (candidates) {
        let matched = false;
        for (const phrase of candidates) {
          const endIdx = matchPhrase(children, i, phrase);
          if (endIdx !== -1) {
            const startPos = highlightOffsets(children[i]);
            const endPos = highlightOffsets(children[endIdx]);
            if (startPos && endPos) {
              highlights.push({
                start: startPos.start,
                end: endPos.end,
                label: `Filler phrase: ${children
                  .slice(i, endIdx + 1)
                  .map((n) => nlcstToString(n))
                  .join("")}`,
                category: "weasel_filler",
              });
              // Mark all WordNode indices in the phrase so we skip them
              for (let j = i; j <= endIdx; j++) {
                if (isWord(children[j])) skip.add(j);
              }
              matched = true;
              break;
            }
          }
        }
        if (matched) continue;
      }

      // Check single-word tiers
      const positions = highlightOffsets(child);
      if (!positions) continue;

      if (TIER1_WORDS.has(lower)) {
        highlights.push({
          ...positions,
          label: `Filler: ${word}`,
          category: "weasel_filler",
        });
      } else if (TIER2_WORDS.has(lower)) {
        highlights.push({
          ...positions,
          label: `Hedge: ${word}`,
          category: "weasel_stance",
        });
      }
    }
  });

  return highlights;
}
