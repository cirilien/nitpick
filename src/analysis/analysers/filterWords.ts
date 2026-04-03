import type { Root } from "nlcst";
import { toString as nlcstToString } from "nlcst-to-string";
import { visit } from "unist-util-visit";
import type { Highlight } from "../../boundaryTypes";
import { highlightOffsets } from "../highlightOffsets";

interface FilterEntry {
  category: string;
  group: string;
  channelLabel: string;
}

function verb(
  forms: string[],
  category: string,
  group: string,
  channelLabel: string,
): [string, FilterEntry][] {
  return forms.map((f) => [f, { category, group, channelLabel }]);
}

const FILTER_WORDS = new Map<string, FilterEntry>([
  // --- Sight ---
  ...verb(
    ["see", "sees", "saw", "seen", "seeing"],
    "filter_sight",
    "see",
    "sight",
  ),
  ...verb(
    ["watch", "watches", "watched", "watching"],
    "filter_sight",
    "watch",
    "sight",
  ),
  ...verb(
    ["look", "looks", "looked", "looking"],
    "filter_sight",
    "look",
    "sight",
  ),
  ...verb(
    ["notice", "notices", "noticed", "noticing"],
    "filter_sight",
    "notice",
    "sight",
  ),
  ...verb(
    ["observe", "observes", "observed", "observing"],
    "filter_sight",
    "observe",
    "sight",
  ),
  ...verb(
    ["spot", "spots", "spotted", "spotting"],
    "filter_sight",
    "spot",
    "sight",
  ),
  ...verb(
    ["stare", "stares", "stared", "staring"],
    "filter_sight",
    "stare",
    "sight",
  ),
  ...verb(
    ["gaze", "gazes", "gazed", "gazing"],
    "filter_sight",
    "gaze",
    "sight",
  ),
  ...verb(
    ["glance", "glances", "glanced", "glancing"],
    "filter_sight",
    "glance",
    "sight",
  ),
  ...verb(
    ["peek", "peeks", "peeked", "peeking"],
    "filter_sight",
    "peek",
    "sight",
  ),

  // --- Sound ---
  ...verb(
    ["hear", "hears", "heard", "hearing"],
    "filter_sound",
    "hear",
    "sound",
  ),
  ...verb(
    ["listen", "listens", "listened", "listening"],
    "filter_sound",
    "listen",
    "sound",
  ),
  ...verb(
    ["overhear", "overhears", "overheard", "overhearing"],
    "filter_sound",
    "overhear",
    "sound",
  ),

  // --- Touch ---
  ...verb(
    ["feel", "feels", "felt", "feeling"],
    "filter_touch",
    "feel",
    "touch",
  ),
  ...verb(
    ["touch", "touches", "touched", "touching"],
    "filter_touch",
    "touch",
    "touch",
  ),

  // --- Smell ---
  ...verb(
    ["smell", "smells", "smelled", "smelt", "smelling"],
    "filter_smell",
    "smell",
    "smell",
  ),
  ...verb(
    ["scent", "scents", "scented", "scenting"],
    "filter_smell",
    "scent",
    "smell",
  ),

  // --- Taste ---
  ...verb(
    ["taste", "tastes", "tasted", "tasting"],
    "filter_taste",
    "taste",
    "taste",
  ),
  ...verb(
    [
      "savor",
      "savors",
      "savored",
      "savoring",
      "savour",
      "savours",
      "savoured",
      "savouring",
    ],
    "filter_taste",
    "savour",
    "taste",
  ),

  // --- Cognition ---
  ...verb(
    ["think", "thinks", "thought", "thinking"],
    "filter_cognition",
    "think",
    "cognition",
  ),
  ...verb(
    ["know", "knows", "knew", "known", "knowing"],
    "filter_cognition",
    "know",
    "cognition",
  ),
  ...verb(
    [
      "realize",
      "realizes",
      "realized",
      "realizing",
      "realise",
      "realises",
      "realised",
      "realising",
    ],
    "filter_cognition",
    "realise",
    "cognition",
  ),
  ...verb(
    ["remember", "remembers", "remembered", "remembering"],
    "filter_cognition",
    "remember",
    "cognition",
  ),
  ...verb(
    ["wonder", "wonders", "wondered", "wondering"],
    "filter_cognition",
    "wonder",
    "cognition",
  ),
  ...verb(
    ["consider", "considers", "considered", "considering"],
    "filter_cognition",
    "consider",
    "cognition",
  ),
  ...verb(
    ["believe", "believes", "believed", "believing"],
    "filter_cognition",
    "believe",
    "cognition",
  ),
  ...verb(
    ["decide", "decides", "decided", "deciding"],
    "filter_cognition",
    "decide",
    "cognition",
  ),
  ...verb(
    ["understand", "understands", "understood", "understanding"],
    "filter_cognition",
    "understand",
    "cognition",
  ),
  ...verb(
    ["imagine", "imagines", "imagined", "imagining"],
    "filter_cognition",
    "imagine",
    "cognition",
  ),
  ...verb(
    ["ponder", "ponders", "pondered", "pondering"],
    "filter_cognition",
    "ponder",
    "cognition",
  ),
  ...verb(
    ["reflect", "reflects", "reflected", "reflecting"],
    "filter_cognition",
    "reflect",
    "cognition",
  ),
  ...verb(
    ["contemplate", "contemplates", "contemplated", "contemplating"],
    "filter_cognition",
    "contemplate",
    "cognition",
  ),
  ...verb(
    ["conclude", "concludes", "concluded", "concluding"],
    "filter_cognition",
    "conclude",
    "cognition",
  ),
  ...verb(
    ["suspect", "suspects", "suspected", "suspecting"],
    "filter_cognition",
    "suspect",
    "cognition",
  ),
  ...verb(
    ["guess", "guesses", "guessed", "guessing"],
    "filter_cognition",
    "guess",
    "cognition",
  ),
  ...verb(
    ["learn", "learns", "learned", "learnt", "learning"],
    "filter_cognition",
    "learn",
    "cognition",
  ),
  ...verb(
    ["discover", "discovers", "discovered", "discovering"],
    "filter_cognition",
    "discover",
    "cognition",
  ),
  ...verb(
    ["recall", "recalls", "recalled", "recalling"],
    "filter_cognition",
    "recall",
    "cognition",
  ),

  // --- Emotion ---
  ...verb(
    ["worry", "worries", "worried", "worrying"],
    "filter_emotion",
    "worry",
    "emotion",
  ),
  ...verb(
    ["hope", "hopes", "hoped", "hoping"],
    "filter_emotion",
    "hope",
    "emotion",
  ),
  ...verb(
    ["wish", "wishes", "wished", "wishing"],
    "filter_emotion",
    "wish",
    "emotion",
  ),
  ...verb(
    ["want", "wants", "wanted", "wanting"],
    "filter_emotion",
    "want",
    "emotion",
  ),
  ...verb(
    ["fear", "fears", "feared", "fearing"],
    "filter_emotion",
    "fear",
    "emotion",
  ),
  ...verb(
    ["expect", "expects", "expected", "expecting"],
    "filter_emotion",
    "expect",
    "emotion",
  ),
  ...verb(
    ["doubt", "doubts", "doubted", "doubting"],
    "filter_emotion",
    "doubt",
    "emotion",
  ),
  ...verb(
    ["dread", "dreads", "dreaded", "dreading"],
    "filter_emotion",
    "dread",
    "emotion",
  ),

  // --- Seeming ---
  ...verb(
    ["seem", "seems", "seemed", "seeming"],
    "filter_seeming",
    "seem",
    "seeming",
  ),
  ...verb(
    ["appear", "appears", "appeared", "appearing"],
    "filter_seeming",
    "appear",
    "seeming",
  ),
]);

export function filterWords(tree: Root): Highlight[] {
  const highlights: Highlight[] = [];

  visit(tree, "WordNode", (node) => {
    const text = nlcstToString(node);
    const lower = text.toLowerCase();
    const entry = FILTER_WORDS.get(lower);
    if (!entry) return;

    const offsets = highlightOffsets(node);
    if (!offsets) return;

    highlights.push({
      ...offsets,
      label: `Filter (${entry.channelLabel}): ${text}`,
      category: entry.category,
      group: entry.group,
    });
  });

  return highlights;
}
