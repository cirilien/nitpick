import { useRef, useState } from "react";

import { analysers } from "./analysis/analysers";
import { parse } from "./analysis/parse";
import type { AnalysisResult } from "./boundaryTypes";
import { Editor } from "./components/Editor";
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

  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <header className="border-b border-gray-200 dark:border-gray-800 px-6 py-3">
        <h1 className="text-xl font-bold tracking-tight">NitPick</h1>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex flex-col md:w-[45%] md:max-w-xl border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800">
          <div className="flex-1 min-h-[150px] p-4">
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
        <div className="flex-1 overflow-hidden">
          <ResultsPanel isStale={false} result={result} />
        </div>
      </main>
    </div>
  );
};

export default App;
