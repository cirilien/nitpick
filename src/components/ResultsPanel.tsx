import type { AnalysisResult, Highlight } from "../boundaryTypes";
import { HighlightedText } from "./HighlightedText";

interface ResultsPanelProps {
  result: AnalysisResult | null;
  filteredHighlights: Highlight[];
  isStale: boolean;
}

export function ResultsPanel({
  result,
  filteredHighlights,
  isStale,
}: ResultsPanelProps) {
  if (!result) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-text-screen-muted dark:text-dark-text-screen-muted text-center text-sm">
          Choose an analysis mode and press Analyze.
        </p>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {isStale && (
        <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-sm border-b border-amber-200 dark:border-amber-800">
          Text has changed. Press Analyze to update.
        </div>
      )}

      <div className="px-5 py-2.5 text-xs text-text-screen-muted dark:text-dark-text-screen-muted border-b border-surface-border dark:border-dark-surface-border">
        {filteredHighlights.length} nitpick
        {filteredHighlights.length !== 1 && "s"} found
      </div>

      <div className="flex-1 overflow-y-auto p-5 text-base leading-relaxed font-serif">
        <HighlightedText text={result.text} highlights={filteredHighlights} />
      </div>
    </div>
  );
}
