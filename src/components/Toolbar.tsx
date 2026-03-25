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
      className="accent-blue-600"
    />
    <span className="font-medium">{name}</span>
    <span className="text-gray-400 hidden sm:inline">— {description}</span>
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
    <div className="flex flex-col gap-3 px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
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
        className="w-full px-4 py-1.5 bg-blue-600 text-white text-sm rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Analyze
      </button>
    </div>
  );
}
