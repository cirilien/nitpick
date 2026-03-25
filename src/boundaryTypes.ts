export interface Highlight {
  start: number;
  end: number;
  category: string; // TODO: maybe make this more specific later
  label: string;
}

export interface AnalysisResult {
  text: string;
  highlights: Highlight[];
  activeAnalyserId: string;
}
