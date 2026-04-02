import type { ReactNode } from "react";
import { getCategoryColor } from "./categoryStyles";
import { useTheme } from "./ThemeContext";

export interface AnalyserDisplay {
  name: string;
  description: string;
  detail: ReactNode;
}

function ColorSwatch({ category }: { category: string }) {
  const { isDark } = useTheme();
  return (
    <span
      className="inline-block w-3 h-3 rounded-sm align-middle mr-1.5"
      style={{ backgroundColor: getCategoryColor(category, isDark) }}
    />
  );
}

export const analyserDisplay: Record<string, AnalyserDisplay> = {
  "weasel-words": {
    name: "Weasel Words",
    description: "Hedging and filler words",
    detail: (
      <div className="space-y-2">
        <p>
          Words like &lsquo;very&rsquo;, &lsquo;really&rsquo;,
          &lsquo;just&rsquo; often don&rsquo;t add much. These flags give you
          the opportunity to examine whether you are hedging instead of
          committing, or if a more specific word choice would be stronger.
          Sometimes they can be cut entirely and the sentence is better for it.
        </p>
        <ul className="text-xs text-text-muted dark:text-dark-text-muted space-y-1 mt-2">
          <li>
            <ColorSwatch category="weasel_filler" />
            Filler &amp; hedge words
          </li>
          <li>
            <ColorSwatch category="weasel_stance" />
            Narrator stance &amp; certainty words
          </li>
        </ul>
      </div>
    ),
  },
  "weak-phrases": {
    name: "Weak Phrases",
    description: "Filler and roundabout phrasing",
    detail:
      "Phrases like 'in order to', 'due to the fact that', and 'it is important to note' pad sentences and reduce punch. Tightening often makes prose clearer, but the cost can be rhythm or tone.",
  },
  "word-repetition": {
    name: "Word Repetition",
    description: "Conspicuous repeated words",
    detail: (
      <div className="space-y-2">
        <p>
          Flags repetition within 200 words. Common words (pronouns,
          prepositions, articles, frequent verbs) are excluded so only
          conspicuous repetition is highlighted. Some repetition is stylistic or
          emphatic, sometimes it is reaching for the same word because it's
          fresh in your mind.
        </p>
      </div>
    ),
  },
};
