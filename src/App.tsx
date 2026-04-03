import { useMemo, useRef, useState } from "react";

import { analysers } from "./analysis/analysers";
import {
  findDialogueRanges,
  overlapsDialogue,
} from "./analysis/dialogueRanges";
import { parse } from "./analysis/parse";
import type { AnalysisResult } from "./boundaryTypes";
import { AnalyserInfo } from "./components/AnalyserInfo";
import { analyserDisplay } from "./components/analyserDisplay";
import { Editor } from "./components/Editor";
import { Header } from "./components/Header";
import { ResultsPanel } from "./components/ResultsPanel";
import { Toolbar } from "./components/Toolbar";
import { debounce } from "./lib/debounce";

const persistText = (text: string) => {
  localStorage.setItem("text", text);
};

const toolbarOptions = analysers.map((a) => ({
  id: a.id,
  ...analyserDisplay[a.id],
}));

const App = () => {
  const [text, setText] = useState(localStorage.getItem("text") || "");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedAnalyserId, setSelectedAnalyserId] = useState(analysers[0].id);
  const [hiddenGroups, setHiddenGroups] = useState<Set<string>>(new Set());
  const [ignoreDialogue, setIgnoreDialogue] = useState(false);

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
    setHiddenGroups(new Set());
  };

  const isStale = result !== null && text !== result.text;

  const groups = useMemo(() => {
    if (!result) return new Map<string, number>();
    const map = new Map<string, number>();
    for (const h of result.highlights) {
      if (h.group) map.set(h.group, (map.get(h.group) ?? 0) + 1);
    }
    return map;
  }, [result]);

  const dialogueRanges = useMemo(
    () => (result && ignoreDialogue ? findDialogueRanges(result.text) : []),
    [result, ignoreDialogue],
  );

  const filteredHighlights = useMemo(() => {
    if (!result) return [];
    let hl = result.highlights;
    if (ignoreDialogue && dialogueRanges.length > 0) {
      hl = hl.filter((h) => !overlapsDialogue(h, dialogueRanges));
    }
    if (hiddenGroups.size > 0) {
      hl = hl.filter((h) => !h.group || !hiddenGroups.has(h.group));
    }
    return hl;
  }, [result, hiddenGroups, ignoreDialogue, dialogueRanges]);

  const handleToggleGroup = (group: string) => {
    setHiddenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  const handleToggleAll = (show: boolean) => {
    if (show) {
      setHiddenGroups(new Set());
    } else {
      setHiddenGroups(new Set(groups.keys()));
    }
  };

  const displayId = result ? result.activeAnalyserId : selectedAnalyserId;
  const selectedDisplay = analyserDisplay[displayId];

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
              analysers={toolbarOptions}
              selectedAnalyserId={selectedAnalyserId}
              onSelect={setSelectedAnalyserId}
              onAnalyse={handleAnalyze}
              canAnalyse={!!text.trim()}
              ignoreDialogue={ignoreDialogue}
              onToggleDialogue={() => setIgnoreDialogue((prev) => !prev)}
            />
          </div>

          {/* Results + Info — side by side on wide screens, stacked on narrow */}
          <div className="flex-1 min-w-0 flex flex-col min-[1430px]:flex-row gap-4 overflow-hidden">
            <div className="flex-1 min-w-0 min-h-0 overflow-hidden bg-surface-screen dark:bg-dark-surface-screen rounded-lg border-2 border-surface-border dark:border-dark-surface-border text-text-screen dark:text-dark-text-screen texture-scanlines">
              <ResultsPanel
                isStale={isStale}
                result={result}
                filteredHighlights={filteredHighlights}
              />
            </div>
            <AnalyserInfo
              analyser={selectedDisplay}
              groups={groups}
              hiddenGroups={hiddenGroups}
              onToggleGroup={handleToggleGroup}
              onToggleAll={handleToggleAll}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
