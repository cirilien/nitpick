import { describe, expect, test } from "vitest";
import { parse } from "../parse.ts";
import { wordRepetition } from "./wordRepetition.ts";

function analyze(text: string) {
  const tree = parse(text);
  return wordRepetition(tree);
}

describe("wordRepetition", () => {
  test("flags a word repeated nearby", () => {
    const hits = analyze("The practice of daily practice is important.");
    expect(hits).toHaveLength(2);
    expect(hits[0].category).toBe("repetition");
    expect(hits[0].label).toContain("practice");
    expect(hits[1].label).toContain("practice");
  });

  test("does not flag common words", () => {
    const hits = analyze("The dog is here. The cat is there.");
    expect(hits).toHaveLength(0);
  });

  test("does not flag short words even if uncommon", () => {
    const hits = analyze("The ox was red. The ox was blue.");
    expect(hits).toHaveLength(0);
  });

  test("matches case-insensitively", () => {
    const hits = analyze("Practice makes perfect. Good practice helps.");
    expect(hits).toHaveLength(2);
  });

  test("preserves original casing in labels", () => {
    const hits = analyze("Practice makes perfect. Good practice helps.");
    expect(hits[0].label).toContain("Practice");
    expect(hits[1].label).toContain("practice");
  });

  test("reports correct character positions", () => {
    const text = "The practice of daily practice matters.";
    const hits = analyze(text);
    expect(hits).toHaveLength(2);
    expect(text.slice(hits[0].start, hits[0].end)).toBe("practice");
    expect(text.slice(hits[1].start, hits[1].end)).toBe("practice");
  });

  test("returns empty for clean text", () => {
    expect(analyze("Every sentence uses different vocabulary.")).toEqual([]);
  });

  test("returns empty for empty input", () => {
    expect(analyze("")).toEqual([]);
  });

  test("does not flag words beyond the distance threshold", () => {
    // Build text with >200 filler words between two occurrences
    const padding = Array(210).fill("nonsensical").join(" ");
    const text = `The phenomenon was interesting. ${padding}. The phenomenon returned.`;
    const hits = analyze(text);
    // "phenomenon" should not be flagged (>200 words apart)
    // "nonsensical" will be flagged heavily since it repeats 210 times
    const phenomenonHits = hits.filter((h) => h.label.includes("phenomenon"));
    expect(phenomenonHits).toHaveLength(0);
  });

  test("flags multiple different repeated words", () => {
    const hits = analyze(
      "The algorithm processes data efficiently. Another algorithm handles data differently.",
    );
    const words = hits.map((h) => h.label);
    expect(words.some((l) => l.includes("algorithm"))).toBe(true);
    expect(words.some((l) => l.includes("data"))).toBe(true);
  });

  test("shows distance in label", () => {
    const hits = analyze("Practice makes perfect. Good practice helps.");
    expect(hits[0].label).toMatch(/\d+ words apart/);
  });

  test("flags word appearing three times, each pair", () => {
    const text =
      "The methodology is sound. Our methodology improves outcomes. This methodology works.";
    const hits = analyze(text);
    const methodologyHits = hits.filter((h) => h.label.includes("methodology"));
    // All three should be flagged
    expect(methodologyHits).toHaveLength(3);
  });

  test("does not double-flag the same position", () => {
    const text = "Practice today. Practice tomorrow. Practice forever.";
    const hits = analyze(text);
    const starts = hits.map((h) => h.start);
    const uniqueStarts = new Set(starts);
    expect(starts.length).toBe(uniqueStarts.size);
  });
});
