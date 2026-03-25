export interface Analyser {
  id: string;
  name: string;
  description: string;
  fn: () => null;
}

export const analysers: Analyser[] = [
  {
    id: "weasel-words",
    name: "Weasel Words",
    description: "Hedging and filler words",
    fn: () => null,
  },
  {
    id: "weak-phrases",
    name: "Weak Phrases",
    description: "Filler and roundabout phrasing",
    fn: () => null,
  },
];
