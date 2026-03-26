import type { Root } from "nlcst";
import type { Highlight } from "../../boundaryTypes";
import { weaselWords } from "./weaselWords";

export interface Analyser {
  id: string;
  name: string;
  description: string;
  detail: string;
  fn: (tree: Root) => Highlight[];
}

export const analysers: Analyser[] = [
  {
    id: "weasel-words",
    name: "Weasel Words",
    description: "Hedging and filler words",
    detail:
      "Words like 'very', 'really', 'just', 'quite', and 'somewhat' dilute your meaning without adding information. They hedge where you could commit, or intensify where the word itself should do the work. This isn't saying cut them all — sometimes hedging is appropriate — but each one is worth a conscious decision.",
    fn: weaselWords,
  },
  {
    id: "weak-phrases",
    name: "Weak Phrases",
    description: "Filler and roundabout phrasing",
    detail:
      "Phrases like 'in order to', 'due to the fact that', and 'it is important to note' use more words than they need. They pad sentences without earning their space. Tightening these often makes prose clearer and more direct — but context matters, and sometimes the longer form serves a rhythm or tone.",
    fn: () => [],
  },
];
