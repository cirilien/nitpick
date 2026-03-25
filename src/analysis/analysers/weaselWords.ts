// TODO: Rework into tiered word lists
//
// Tier 1 (strong — filler/hedge, almost never needed):
//   very, really, just, quite, rather, somewhat, slightly, basically,
//   essentially, actually, simply, literally, practically, totally,
//   utterly, extremely, fairly, somehow
//
// Tier 2 (weaker — narrator stance/certainty, higher false-positive rate):
//   perhaps, apparently, presumably, supposedly, seemingly, arguably,
//   hopefully, naturally, obviously, clearly, certainly, definitely,
//   surely, honestly, frankly
//
// Multi-word (needs phrase matching):
//   a bit, a little, kind of, sort of

import type { Root } from "nlcst";
import { visit } from "unist-util-visit";
import { toString as nlcstToString } from "nlcst-to-string";
import type { Highlight } from "../../boundaryTypes";
import { highlightOffsets } from "../highlightOffsets";

const WEASEL_WORDS = new Set([
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

export function weaselWords(tree: Root): Highlight[] {
  const highlights: Highlight[] = [];

  visit(tree, "WordNode", (node) => {
    const word = nlcstToString(node);
    const wordToMatch = word.toLowerCase();
    const positions = highlightOffsets(node);

    if (WEASEL_WORDS.has(wordToMatch) && positions)
      highlights.push({
        ...positions,
        label: `Weasel word: ${word}`,
        category: "weasel_word",
      });
  });

  return highlights;
}
