import type { AnalysisResult } from "../boundaryTypes";
import { HighlightedText } from "./HighlightedText";

interface ResultsPanelProps {
	result: AnalysisResult | null;
	isStale: boolean;
}

export function ResultsPanel({ result, isStale }: ResultsPanelProps) {
	if (!result) {
		return (
			<div className="h-full flex items-center justify-center">
				<p className="text-text-muted dark:text-dark-text-muted text-center">
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

			<div className="px-4 py-2 text-sm text-text-muted dark:text-dark-text-muted border-b border-surface-border dark:border-dark-surface-border">
				{result.highlights.length} nitpick
				{result.highlights.length !== 1 && "s"} found
			</div>

			<div className="flex-1 overflow-y-auto p-4 text-base leading-relaxed font-serif">
				<HighlightedText
					text={result.text}
					highlights={result.highlights}
				/>
			</div>
		</div>
	);
}
