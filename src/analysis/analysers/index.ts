import type { Root } from "nlcst";
import type { Highlight } from "../../boundaryTypes";
import { weaselWords } from "./weaselWords";

export interface Analyser {
  id: string;
  name: string;
  description: string;
  fn: (tree: Root) => Highlight[];
}

export const analysers: Analyser[] = [
  {
    id: "weasel-words",
    name: "Weasel Words",
    description: "Hedging and filler words",
    fn: weaselWords,
  },
  {
    id: "weak-phrases",
    name: "Weak Phrases",
    description: "Filler and roundabout phrasing",
    fn: () => [],
  },
];
