import { useMemo, useState } from "react";
import type { AnalyserDisplay } from "./analyserDisplay";

interface AnalyserInfoProps {
  analyser: AnalyserDisplay | undefined;
  groups?: Map<string, number>;
  hiddenGroups?: Set<string>;
  onToggleGroup?: (group: string) => void;
  onToggleAll?: (show: boolean) => void;
}

export function AnalyserInfo({
  analyser,
  groups,
  hiddenGroups,
  onToggleGroup,
  onToggleAll,
}: AnalyserInfoProps) {
  const [collapsed, setCollapsed] = useState(false);

  const sortedGroups = useMemo(() => {
    if (!groups || groups.size === 0) return [];
    return [...groups.entries()].sort((a, b) => b[1] - a[1]);
  }, [groups]);

  const allVisible =
    !hiddenGroups || sortedGroups.every(([g]) => !hiddenGroups.has(g));
  const noneVisible =
    hiddenGroups != null &&
    sortedGroups.length > 0 &&
    sortedGroups.every(([g]) => hiddenGroups.has(g));

  return (
    <aside
      className={`bg-surface-raised dark:bg-dark-surface-raised rounded-lg border border-dashed border-surface-border dark:border-dark-surface-border flex flex-col shrink-0 ${collapsed ? "min-[1430px]:w-12" : "min-[1430px]:w-62"}`}
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
        <div className="px-5 py-3 min-[1430px]:pb-5 min-[1430px]:pt-0 text-sm overflow-hidden flex flex-col">
          <h2 className="font-semibold text-base mb-1">{analyser.name}</h2>
          <p className="text-text-muted dark:text-dark-text-muted text-xs mb-3">
            {analyser.description}
          </p>
          <div className="leading-relaxed font-serif">{analyser.detail}</div>

          {sortedGroups.length > 0 && onToggleGroup && onToggleAll && (
            <div className="mt-4 border-t border-surface-border dark:border-dark-surface-border pt-3">
              <label className="flex items-center gap-2 text-xs font-semibold mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allVisible}
                  ref={(el) => {
                    if (el) el.indeterminate = !allVisible && !noneVisible;
                  }}
                  onChange={() => onToggleAll(!allVisible)}
                  className="accent-current"
                />
                Show all ({sortedGroups.length})
              </label>
              <ul className="space-y-1 max-h-48 overflow-y-auto text-xs">
                {sortedGroups.map(([group, count]) => (
                  <li key={group}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!hiddenGroups?.has(group)}
                        onChange={() => onToggleGroup(group)}
                        className="accent-current"
                      />
                      <span>{group}</span>
                      <span className="text-text-muted dark:text-dark-text-muted">
                        ({count})
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
