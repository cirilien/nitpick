import { describe, expect, test } from "vitest";
import { parse } from "../parse";
import { adverbs } from "./adverbs";

function analyze(text: string) {
  return adverbs(parse(text));
}

describe("adverbs", () => {
  // --- -ly detection ---

  test("flags -ly adverbs", () => {
    const hits = analyze("She walked quickly down the hall.");
    expect(hits).toHaveLength(1);
    expect(hits[0].category).toBe("adverb_ly");
  });

  test("flags multiple -ly adverbs", () => {
    const hits = analyze("He moved slowly and deliberately toward the door.");
    expect(hits).toHaveLength(2);
    expect(hits.every((h) => h.category === "adverb_ly")).toBe(true);
  });

  // --- Irregular detection ---

  test("flags irregular adverbs", () => {
    const hits = analyze("She almost never arrived on time.");
    expect(hits).toHaveLength(2);
    expect(hits.every((h) => h.category === "adverb_irregular")).toBe(true);
  });

  // --- Exceptions ---

  test("does not flag -ly words that are not adverbs", () => {
    expect(analyze("The friendly family had a lovely butterfly garden.")).toEqual(
      [],
    );
  });

  test("does not flag non-adverb -ly verbs", () => {
    expect(analyze("He could reply and comply.")).toEqual([]);
  });

  // --- Categorisation ---

  test("categorises -ly vs irregular separately", () => {
    const hits = analyze("She always walked slowly.");
    expect(hits).toHaveLength(2);
    expect(hits[0].category).toBe("adverb_irregular");
    expect(hits[1].category).toBe("adverb_ly");
  });

  test("labels -ly and irregular adverbs differently", () => {
    const hits = analyze("She always walked slowly.");
    expect(hits[0].label).toBe("Adverb (irregular): always");
    expect(hits[1].label).toBe("Adverb: slowly");
  });

  // --- Case ---

  test("matches case-insensitively", () => {
    const hits = analyze("QUICKLY she ran.");
    expect(hits).toHaveLength(1);
    expect(hits[0].label).toBe("Adverb: QUICKLY");
  });

  // --- Positions ---

  test("reports correct character positions", () => {
    const text = "She walked quickly.";
    const hits = analyze(text);
    expect(hits).toHaveLength(1);
    expect(text.slice(hits[0].start, hits[0].end)).toBe("quickly");
  });

  // --- Edge cases ---

  test("returns empty for clean text", () => {
    expect(analyze("The cat sat on the mat.")).toEqual([]);
  });

  test("returns empty for empty input", () => {
    expect(analyze("")).toEqual([]);
  });
});
