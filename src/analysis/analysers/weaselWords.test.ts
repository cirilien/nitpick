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

function categories(text: string) {
  return analyze(text).map((h) => h.category);
}

describe("weaselWords", () => {
  // --- Tier 1 (filler) ---

  test("flags a single filler word", () => {
    const hits = analyze("This is very good.");
    expect(hits).toHaveLength(1);
    expect(hits[0].label).toBe("Filler: very");
    expect(hits[0].category).toBe("weasel_filler");
  });

  test("flags multiple filler words", () => {
    expect(labels("It was really quite bad.")).toEqual([
      "Filler: really",
      "Filler: quite",
    ]);
  });

  test("matches case-insensitively", () => {
    expect(labels("Basically it works. BASICALLY.")).toEqual([
      "Filler: Basically",
      "Filler: BASICALLY",
    ]);
  });

  test("preserves original casing in label", () => {
    const hits = analyze("Very nice.");
    expect(hits[0].label).toBe("Filler: Very");
  });

  test("matches whole words only", () => {
    expect(analyze("She made an adjustment.")).toHaveLength(0);
    expect(analyze("The justice system is fair.")).toHaveLength(0);
  });

  test("returns correct positions for filler words", () => {
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

  // --- Tier 2 (stance/hedge) ---

  test("flags tier 2 words with weasel_stance category", () => {
    const hits = analyze("Perhaps she was right.");
    expect(hits).toHaveLength(1);
    expect(hits[0].label).toBe("Hedge: Perhaps");
    expect(hits[0].category).toBe("weasel_stance");
  });

  test("flags multiple tier 2 words", () => {
    expect(labels("Obviously this is clearly wrong.")).toEqual([
      "Hedge: Obviously",
      "Hedge: clearly",
    ]);
  });

  test("distinguishes tier 1 and tier 2 categories", () => {
    expect(categories("It was very obviously wrong.")).toEqual([
      "weasel_filler",
      "weasel_stance",
    ]);
  });

  // --- Multi-word phrases ---

  test("flags 'kind of' as a phrase", () => {
    const text = "It was kind of boring.";
    const hits = analyze(text);
    expect(hits).toHaveLength(1);
    expect(hits[0].label).toBe("Filler phrase: kind of");
    expect(hits[0].category).toBe("weasel_filler");
    expect(text.slice(hits[0].start, hits[0].end)).toBe("kind of");
  });

  test("flags 'sort of' as a phrase", () => {
    const text = "He sort of agreed.";
    const hits = analyze(text);
    expect(hits).toHaveLength(1);
    expect(text.slice(hits[0].start, hits[0].end)).toBe("sort of");
  });

  test("flags 'a bit' as a phrase", () => {
    const text = "It was a bit much.";
    const hits = analyze(text);
    expect(hits).toHaveLength(1);
    expect(text.slice(hits[0].start, hits[0].end)).toBe("a bit");
  });

  test("flags 'a little' as a phrase", () => {
    const text = "She was a little nervous.";
    const hits = analyze(text);
    expect(hits).toHaveLength(1);
    expect(text.slice(hits[0].start, hits[0].end)).toBe("a little");
  });

  test("does not match partial phrases", () => {
    expect(analyze("She took a bite.")).toHaveLength(0);
    expect(analyze("A man walked in.")).toHaveLength(0);
  });

  test("phrase matching is case-insensitive", () => {
    const hits = analyze("Kind Of silly.");
    expect(hits).toHaveLength(1);
    expect(hits[0].label).toBe("Filler phrase: Kind Of");
  });

  // --- Mixed ---

  test("mixed tier 1, tier 2, and phrase in one sentence", () => {
    const text = "It was very obviously kind of broken.";
    const hits = analyze(text);
    expect(hits).toHaveLength(3);
    expect(hits[0].label).toBe("Filler: very");
    expect(hits[1].label).toBe("Hedge: obviously");
    expect(hits[2].label).toBe("Filler phrase: kind of");
  });

  // --- Edge cases ---

  test("returns empty array for clean text", () => {
    expect(analyze("The dog ran across the field.")).toEqual([]);
  });

  test("returns empty array for empty input", () => {
    expect(analyze("")).toEqual([]);
  });
});
