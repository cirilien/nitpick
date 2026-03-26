import { useState } from "react";
import type { Analyser } from "../analysis/analysers";

interface AnalyserInfoProps {
	analyser: Analyser;
}

export function AnalyserInfo({ analyser }: AnalyserInfoProps) {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<aside
			className={`bg-surface-raised dark:bg-dark-surface-raised rounded-lg border border-dashed border-surface-border dark:border-dark-surface-border transition-all duration-200 texture-grain ${collapsed ? "w-12" : "w-72"} shrink-0 flex flex-col`}
		>
			<button
				type="button"
				onClick={() => setCollapsed(!collapsed)}
				className="p-3 text-text-muted dark:text-dark-text-muted hover:text-text dark:hover:text-dark-text text-xs self-end"
				title={collapsed ? "Show info" : "Hide info"}
			>
				{collapsed ? "◀" : "▶"}
			</button>

			{!collapsed && (
				<div className="px-5 pb-5 text-sm">
					<h2 className="font-semibold text-base mb-1">
						{analyser.name}
					</h2>
					<p className="text-text-muted dark:text-dark-text-muted text-xs mb-3">
						{analyser.description}
					</p>
					<p className="leading-relaxed font-serif">
						{analyser.detail}
					</p>
				</div>
			)}
		</aside>
	);
}
