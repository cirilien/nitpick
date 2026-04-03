import type { Root } from "nlcst";
import { toString as nlcstToString } from "nlcst-to-string";
import { visit } from "unist-util-visit";
import type { Highlight } from "../../boundaryTypes";
import { highlightOffsets } from "../highlightOffsets";

/**
 * Irregular adverbs and common -ly adverbs that are worth flagging.
 * We catch most adverbs via the -ly suffix, but these don't end in -ly.
 */
const IRREGULAR_ADVERBS = new Set([
  "always",
  "never",
  "often",
  "seldom",
  "almost",
  "already",
  "also",
  "even",
  "ever",
  "forever",
  "indeed",
  "instead",
  "nevertheless",
  "nonetheless",
  "now",
  "only",
  "perhaps",
  "quite",
  "rather",
  "sometimes",
  "somewhat",
  "soon",
  "still",
  "then",
  "too",
  "well",
  "yet",
]);

/**
 * Words ending in -ly that are NOT adverbs.
 * Adjectives, nouns, verbs that happen to end in -ly.
 */
const LY_EXCEPTIONS = new Set([
  "ally",
  "anomaly",
  "apply",
  "assembly",
  "belly",
  "bully",
  "butterfly",
  "comply",
  "curly",
  "daily",
  "deadly",
  "early",
  "elderly",
  "family",
  "fly",
  "friendly",
  "ghastly",
  "holy",
  "homely",
  "imply",
  "italy",
  "jelly",
  "jolly",
  "july",
  "lily",
  "lively",
  "lonely",
  "lovely",
  "manly",
  "melancholy",
  "monopoly",
  "multiply",
  "orderly",
  "poly",
  "rally",
  "rely",
  "reply",
  "silly",
  "sly",
  "supply",
  "tally",
  "ugly",
  "unlikely",
  "unruly",
  "wily",
  "worldly",
]);

function isAdverb(lower: string): boolean {
  if (IRREGULAR_ADVERBS.has(lower)) return true;
  if (lower.length >= 4 && lower.endsWith("ly") && !LY_EXCEPTIONS.has(lower))
    return true;
  return false;
}

export function adverbs(tree: Root): Highlight[] {
  const highlights: Highlight[] = [];

  visit(tree, "WordNode", (node) => {
    const text = nlcstToString(node);
    const lower = text.toLowerCase();
    if (!isAdverb(lower)) return;

    const offsets = highlightOffsets(node);
    if (!offsets) return;

    const isLy = lower.endsWith("ly");
    highlights.push({
      ...offsets,
      label: isLy ? `Adverb: ${text}` : `Adverb (irregular): ${text}`,
      category: isLy ? "adverb_ly" : "adverb_irregular",
    });
  });

  return highlights;
}
