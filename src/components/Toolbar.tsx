import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface AnalyserOption {
  id: string;
  name: string;
}

interface ToolbarProps {
  analysers: AnalyserOption[];
  selectedAnalyserId: string;
  onSelect: (id: string) => void;
  onAnalyse: () => void;
  canAnalyse: boolean;
  ignoreDialogue: boolean;
  onToggleDialogue: () => void;
}

interface AnalyserOptionProps {
  id: string;
  name: string;
  selectedAnalyserId: string;
  onSelect: (id: string) => void;
}

const AnalyserOptionItem = ({
  id,
  name,
  selectedAnalyserId,
  onSelect,
}: AnalyserOptionProps) => (
  <label className="flex items-center gap-1.5 cursor-pointer text-sm min-w-0">
    <input
      type="radio"
      name="analyser"
      value={id}
      checked={selectedAnalyserId === id}
      onChange={() => onSelect(id)}
      className="accent-accent dark:accent-dark-accent"
    />
    <span className="font-medium">{name}</span>
  </label>
);

export function Toolbar({
  analysers,
  selectedAnalyserId,
  onSelect,
  onAnalyse,
  canAnalyse,
  ignoreDialogue,
  onToggleDialogue,
}: ToolbarProps) {
  return (
    <div className="flex flex-col gap-3 px-5 py-4 border-t border-surface-border dark:border-dark-surface-border min-w-0">
      <div className="flex flex-col items-start gap-3 flex-wrap">
        {analysers.map((analyser) => (
          <AnalyserOptionItem
            key={analyser.id}
            {...analyser}
            selectedAnalyserId={selectedAnalyserId}
            onSelect={onSelect}
          />
        ))}
      </div>
      <label className="flex items-center gap-1.5 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={ignoreDialogue}
          onChange={onToggleDialogue}
          className="accent-accent dark:accent-dark-accent"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              render={
                <span className="underline decoration-dotted underline-offset-2" />
              }
            >
              Ignore dialogue
            </TooltipTrigger>
            <TooltipContent>
              Hide matches inside &quot;double&quot; or {"\u201C"}curly double
              {"\u201D"} quotes
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </label>
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
