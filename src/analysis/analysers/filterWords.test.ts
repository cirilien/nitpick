import { describe, expect, test } from "vitest";
import { parse } from "../parse.ts";
import { filterWords } from "./filterWords.ts";

function analyze(text: string) {
  const tree = parse(text);
  return filterWords(tree);
}

describe("filterWords", () => {
  // --- Category assignment ---

  test("flags sight verbs", () => {
    const hits = analyze("She saw the door open.");
    expect(hits).toHaveLength(1);
    expect(hits[0].category).toBe("filter_sight");
    expect(hits[0].label).toBe("Filter (sight): saw");
  });

  test("flags sound verbs", () => {
    const hits = analyze("He hears footsteps.");
    expect(hits).toHaveLength(1);
    expect(hits[0].category).toBe("filter_sound");
  });

  test("flags touch verbs", () => {
    const hits = analyze("She felt the cold wind.");
    expect(hits).toHaveLength(1);
    expect(hits[0].category).toBe("filter_touch");
  });

  test("flags smell verbs", () => {
    const hits = analyze("He smelled smoke.");
    expect(hits).toHaveLength(1);
    expect(hits[0].category).toBe("filter_smell");
  });

  test("flags taste verbs", () => {
    const hits = analyze("She tasted copper.");
    expect(hits).toHaveLength(1);
    expect(hits[0].category).toBe("filter_taste");
  });

  test("flags cognition verbs", () => {
    const hits = analyze("He realised the truth.");
    expect(hits).toHaveLength(1);
    expect(hits[0].category).toBe("filter_cognition");
  });

  test("flags emotion verbs", () => {
    const hits = analyze("She worried about the test.");
    expect(hits).toHaveLength(1);
    expect(hits[0].category).toBe("filter_emotion");
  });

  test("flags seeming verbs", () => {
    const hits = analyze("It seemed wrong.");
    expect(hits).toHaveLength(1);
    expect(hits[0].category).toBe("filter_seeming");
  });

  // --- Conjugations ---

  test("flags all conjugations of a verb", () => {
    const texts = [
      "I see the light.",
      "She sees the light.",
      "He saw the light.",
      "They have seen the light.",
      "We are seeing the light.",
    ];
    for (const t of texts) {
      const hits = analyze(t);
      const seeHits = hits.filter((h) => h.group === "see");
      expect(seeHits.length, `expected hit in: "${t}"`).toBeGreaterThanOrEqual(
        1,
      );
    }
  });

  // --- Grouping ---

  test("groups conjugations under the same lemma", () => {
    const hits = analyze("She saw the bird. He sees it too.");
    expect(hits).toHaveLength(2);
    expect(hits[0].group).toBe("see");
    expect(hits[1].group).toBe("see");
  });

  test("different verbs get different groups", () => {
    const hits = analyze("She watched and listened.");
    expect(hits).toHaveLength(2);
    const groups = new Set(hits.map((h) => h.group));
    expect(groups.size).toBe(2);
    expect(groups).toContain("watch");
    expect(groups).toContain("listen");
  });

  // --- Case ---

  test("matches case-insensitively", () => {
    const hits = analyze("She SAW the door.");
    expect(hits).toHaveLength(1);
    expect(hits[0].label).toBe("Filter (sight): SAW");
  });

  // --- Positions ---

  test("reports correct character positions", () => {
    const text = "He watched the sunset.";
    const hits = analyze(text);
    expect(hits).toHaveLength(1);
    expect(text.slice(hits[0].start, hits[0].end)).toBe("watched");
  });

  // --- Edge cases ---

  test("returns empty for clean text", () => {
    expect(analyze("The door creaked open.")).toEqual([]);
  });

  test("returns empty for empty input", () => {
    expect(analyze("")).toEqual([]);
  });

  // --- Multiple hits ---

  test("flags multiple filter words in one sentence", () => {
    const hits = analyze(
      "She noticed he seemed upset and felt a pang of guilt.",
    );
    expect(hits).toHaveLength(3);
    const categories = hits.map((h) => h.category);
    expect(categories).toContain("filter_sight");
    expect(categories).toContain("filter_seeming");
    expect(categories).toContain("filter_touch");
  });
});
