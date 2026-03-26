import { useRef, useState } from "react";

import { analysers } from "./analysis/analysers";
import { parse } from "./analysis/parse";
import type { AnalysisResult } from "./boundaryTypes";
import { AnalyserInfo } from "./components/AnalyserInfo";
import { Editor } from "./components/Editor";
import { ResultsPanel } from "./components/ResultsPanel";
import { ThemeToggle } from "./components/ThemeToggle";
import { Toolbar } from "./components/Toolbar";
import { debounce } from "./lib/debounce";

const persistText = (text: string) => {
  localStorage.setItem("text", text);
};

const App = () => {
  const [text, setText] = useState(localStorage.getItem("text") || "");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedAnalyserId, setSelectedAnalyserId] = useState(analysers[0].id);

  const persist = useRef(debounce(persistText, 500));
  const onTextChange = (text: string) => {
    setText(text);
    persist.current(text);
  };

  const handleAnalyze = (): void => {
    const analyser = analysers.find((a) => a.id === selectedAnalyserId);
    if (!analyser) return;
    const tree = parse(text);
    const highlights = analyser.fn(tree);

    setResult({ highlights, text, activeAnalyserId: selectedAnalyserId });
  };

  const selectedAnalyser = analysers.find((a) => a.id === selectedAnalyserId);

  return (
    <div className="h-screen flex flex-col bg-surface dark:bg-dark-surface text-text dark:text-dark-text lg:p-10 xl:p-16 font-mono">
      <header className="border-b border-surface-border dark:border-dark-surface-border px-8 py-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-accent dark:text-dark-accent">&gt; </span>
            NitPick
            <span className="inline-block w-[0.55em] h-[0.15em] bg-text dark:bg-dark-text ml-0.5 animate-blink align-baseline" />
          </h1>
          <p className="text-sm text-text-muted dark:text-dark-text-muted mt-1">
            Programmatic line-editing tools for prose. No AI, no opinions — just
            patterns worth a second look.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex gap-4 overflow-hidden p-4 pt-4">
        {/* Editor — grain */}
        <div className="flex flex-col w-[480px] shrink-0 bg-surface-raised dark:bg-dark-surface-raised rounded-lg border border-surface-border dark:border-dark-surface-border texture-grain">
          <div className="flex-1 min-h-0 p-5">
            <Editor text={text} onChange={onTextChange} />
          </div>
          <Toolbar
            analysers={analysers}
            selectedAnalyserId={selectedAnalyserId}
            onSelect={setSelectedAnalyserId}
            onAnalyse={handleAnalyze}
            canAnalyse={!!text.trim()}
          />
        </div>

        {/* Results — scanline */}
        <div className="flex-1 min-w-0 overflow-hidden bg-surface-screen dark:bg-dark-surface-screen rounded-lg border border-surface-border dark:border-dark-surface-border text-text-screen dark:text-dark-text-screen texture-scanlines">
          <ResultsPanel isStale={false} result={result} />
        </div>

        {/* Info — grain */}
        <AnalyserInfo analyser={selectedAnalyser} />
      </main>
    </div>
  );
};

export default App;
