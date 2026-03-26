import { useRef, useState } from "react";

import { analysers } from "./analysis/analysers";
import { parse } from "./analysis/parse";
import type { AnalysisResult } from "./boundaryTypes";
import { AnalyserInfo } from "./components/AnalyserInfo";
import { Editor } from "./components/Editor";
import { Header } from "./components/Header";
import { ResultsPanel } from "./components/ResultsPanel";
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

  const isStale = result !== null && text !== result.text;

  const selectedAnalyser = analysers.find((a) =>
    result ? a.id === result.activeAnalyserId : a.id === selectedAnalyserId,
  );

  return (
    <div className="h-screen flex flex-col bg-surface dark:bg-dark-surface text-text dark:text-dark-text font-mono">
      <div className="app w-full mx-auto flex flex-col flex-1 overflow-hidden lg:p-8 xl:p-10">
        <Header />

        <main className="flex-1 flex gap-4 overflow-hidden p-4 pt-4">
          {/* Editor — grain, light border */}
          <div className="flex flex-col w-[40%] max-w-[480px] min-w-0 overflow-hidden bg-surface-raised dark:bg-dark-surface-raised rounded-lg border border-dashed border-surface-border dark:border-dark-surface-border texture-grain">
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

          {/* Results + Info — side by side on wide screens, stacked on narrow */}
          <div className="flex-1 min-w-0 flex flex-col min-[1430px]:flex-row gap-4 overflow-hidden">
            <div className="flex-1 min-w-0 min-h-0 overflow-hidden bg-surface-screen dark:bg-dark-surface-screen rounded-lg border-2 border-surface-border dark:border-dark-surface-border text-text-screen dark:text-dark-text-screen texture-scanlines">
              <ResultsPanel isStale={isStale} result={result} />
            </div>
            <AnalyserInfo analyser={selectedAnalyser} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
