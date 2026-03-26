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
      "Words like 'very', 'really', 'just', often don't add much. These flags give you the opportunity to examine whether you are hedging instead of committing, or if a more specific word choice would be stronger. Sometimes they can be cut entirely and the sentence is better for it.",
    fn: weaselWords,
  },
  {
    id: "weak-phrases",
    name: "Weak Phrases",
    description: "Filler and roundabout phrasing",
    detail:
      "Phrases like 'in order to', 'due to the fact that', and 'it is important to note' pad sentences and reduce punch. Tightening often makes prose clearer, but the cost can be rhythm or tone.",
    fn: () => [],
  },
];
