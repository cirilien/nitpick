import { useState } from "react";
import type { AnalyserDisplay } from "./analyserDisplay";

interface AnalyserInfoProps {
  analyser: AnalyserDisplay | undefined;
}

export function AnalyserInfo({ analyser }: AnalyserInfoProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-surface-raised dark:bg-dark-surface-raised rounded-lg border border-dashed border-surface-border dark:border-dark-surface-border transition-all duration-200 texture-grain flex flex-col shrink-0 ${collapsed ? "min-[1430px]:w-12" : "min-[1430px]:w-62"}`}
    >
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 text-text-muted dark:text-dark-text-muted hover:text-text dark:hover:text-dark-text text-xs self-end hidden min-[1430px]:block"
        title={collapsed ? "Show info" : "Hide info"}
      >
        {collapsed ? "◀" : "▶"}
      </button>

      {!collapsed && analyser && (
        <div className="px-5 py-3 min-[1430px]:pb-5 min-[1430px]:pt-0 text-sm">
          <h2 className="font-semibold text-base mb-1">{analyser.name}</h2>
          <p className="text-text-muted dark:text-dark-text-muted text-xs mb-3">
            {analyser.description}
          </p>
          <div className="leading-relaxed font-serif">{analyser.detail}</div>
        </div>
      )}
    </aside>
  );
}
