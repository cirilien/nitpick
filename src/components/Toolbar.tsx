import type { Analyser } from "../analysis/analysers";

interface ToolbarProps {
	analysers: Analyser[];
	selectedAnalyserId: string;
	onSelect: (id: string) => void;
	onAnalyse: () => void;
	canAnalyse: boolean;
}

interface AnalyserOptionProps {
	id: string;
	name: string;
	description: string;
	selectedAnalyserId: string;
	onSelect: (id: string) => void;
}

const AnalyserOption = ({
	id,
	name,
	description,
	selectedAnalyserId,
	onSelect,
}: AnalyserOptionProps) => (
	<label className="flex items-center gap-1.5 cursor-pointer text-sm">
		<input
			type="radio"
			name="analyser"
			value={id}
			checked={selectedAnalyserId === id}
			onChange={() => onSelect(id)}
			className="accent-accent dark:accent-dark-accent"
		/>
		<span className="font-medium">{name}</span>
		<span className="text-text-muted dark:text-dark-text-muted hidden sm:inline">
			— {description}
		</span>
	</label>
);

export function Toolbar({
	analysers,
	selectedAnalyserId,
	onSelect,
	onAnalyse,
	canAnalyse,
}: ToolbarProps) {
	return (
		<div className="flex flex-col gap-3 px-5 py-4 border-t border-surface-border dark:border-dark-surface-border">
			<div className="flex items-center gap-3 flex-wrap">
				{analysers.map((analyser) => (
					<AnalyserOption
						key={analyser.id}
						{...analyser}
						selectedAnalyserId={selectedAnalyserId}
						onSelect={onSelect}
					/>
				))}
			</div>
			<button
				type="button"
				onClick={onAnalyse}
				disabled={!canAnalyse}
				className="w-full px-4 py-1.5 bg-accent dark:bg-dark-accent text-white text-sm rounded-md font-medium hover:bg-accent-hover dark:hover:bg-dark-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
			>
				Analyze
			</button>
		</div>
	);
}
