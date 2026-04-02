import type { Root } from "nlcst";
import type { Highlight } from "../../boundaryTypes";
import { weaselWords } from "./weaselWords";
import { wordRepetition } from "./wordRepetition";

export interface Analyser {
  id: string;
  fn: (tree: Root) => Highlight[];
}

export const analysers: Analyser[] = [
  { id: "weasel-words", fn: weaselWords },
  { id: "word-repetition", fn: wordRepetition },
];
