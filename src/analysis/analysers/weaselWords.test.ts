import { describe, expect, test } from "vitest";
import { parse } from "../parse.ts";
import { weaselWords } from "./weaselWords.ts";

function analyze(text: string) {
  const tree = parse(text);
  return weaselWords(tree);
}

function labels(text: string) {
  return analyze(text).map((h) => h.label);
}

describe("analyzeWeaselWords", () => {
  test("flags a single weasel word", () => {
    const hits = analyze("This is very good.");
    expect(hits).toHaveLength(1);
    expect(hits[0].label).toBe("Weasel word: very");
  });

  test("flags multiple weasel words", () => {
    expect(labels("It was really quite bad.")).toEqual([
      "Weasel word: really",
      "Weasel word: quite",
    ]);
  });

  test("matches case-insensitively", () => {
    expect(labels("Basically it works. BASICALLY.")).toEqual([
      "Weasel word: Basically",
      "Weasel word: BASICALLY",
    ]);
  });

  test("preserves original casing in label", () => {
    const hits = analyze("Very nice.");
    expect(hits[0].label).toBe("Weasel word: Very");
  });

  test("matches whole words only", () => {
    expect(analyze("She made an adjustment.")).toHaveLength(0);
    expect(analyze("The justice system is fair.")).toHaveLength(0);
  });

  test("returns correct positions", () => {
    const text = "It was very good.";
    const hits = analyze(text);
    expect(hits).toHaveLength(1);
    expect(text.slice(hits[0].start, hits[0].end)).toBe("very");
  });

  test("positions are correct with leading whitespace", () => {
    const text = "   very nice";
    const hits = analyze(text);
    expect(hits).toHaveLength(1);
    expect(text.slice(hits[0].start, hits[0].end)).toBe("very");
  });

  test("positions across multiple sentences", () => {
    const text = "She was fairly sure. He practically agreed.";
    const hits = analyze(text);
    expect(hits).toHaveLength(2);
    expect(text.slice(hits[0].start, hits[0].end)).toBe("fairly");
    expect(text.slice(hits[1].start, hits[1].end)).toBe("practically");
  });

  test("returns empty array for clean text", () => {
    expect(analyze("The dog ran across the field.")).toEqual([]);
  });

  test("returns empty array for empty input", () => {
    expect(analyze("")).toEqual([]);
  });
});
