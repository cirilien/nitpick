import { describe, expect, test } from "vitest";
import { findDialogueRanges, overlapsDialogue } from "./dialogueRanges";

describe("findDialogueRanges", () => {
  test("straight double quotes", () => {
    const text = 'She said "hello" quietly.';
    const ranges = findDialogueRanges(text);
    expect(ranges).toEqual([{ start: 9, end: 16 }]);
  });

  test("curly double quotes", () => {
    const text = "She said \u201Chello\u201D quietly.";
    const ranges = findDialogueRanges(text);
    expect(ranges).toEqual([{ start: 9, end: 16 }]);
  });

  test("curly single quotes are not matched (apostrophe ambiguity)", () => {
    const text = "She said \u2018hello\u2019 quietly.";
    const ranges = findDialogueRanges(text);
    expect(ranges).toEqual([]);
  });

  test("multiple quoted sections", () => {
    const text = '"Hello," she said. "Goodbye."';
    const ranges = findDialogueRanges(text);
    expect(ranges).toEqual([
      { start: 0, end: 8 },
      { start: 19, end: 29 },
    ]);
  });

  test("nested quotes are merged", () => {
    // Outer curly double, inner curly single
    const text = "She said \u201CHe whispered \u2018run\u2019 urgently\u201D to me.";
    const ranges = findDialogueRanges(text);
    // The outer range covers everything, inner is merged into it
    expect(ranges).toHaveLength(1);
    expect(ranges[0].start).toBe(9);
  });

  test("unmatched opening quote is ignored", () => {
    const text = 'She said "hello and never closed it.';
    const ranges = findDialogueRanges(text);
    expect(ranges).toEqual([]);
  });

  test("apostrophes in contractions are not matched", () => {
    // Straight apostrophes — should not be treated as quotes
    const text = "She doesn't know what it's about.";
    const ranges = findDialogueRanges(text);
    expect(ranges).toEqual([]);
  });

  test("curly apostrophes are not matched as opening quotes", () => {
    // Right single quote used as apostrophe — no left single quote to open
    const text = "She doesn\u2019t know.";
    const ranges = findDialogueRanges(text);
    expect(ranges).toEqual([]);
  });

  test("empty text", () => {
    expect(findDialogueRanges("")).toEqual([]);
  });

  test("empty quotes", () => {
    const text = 'She said "" and left.';
    const ranges = findDialogueRanges(text);
    expect(ranges).toEqual([{ start: 9, end: 11 }]);
  });
});

describe("overlapsDialogue", () => {
  const ranges = [
    { start: 10, end: 20 },
    { start: 30, end: 40 },
  ];

  test("highlight fully inside a range", () => {
    expect(overlapsDialogue({ start: 12, end: 15 }, ranges)).toBe(true);
  });

  test("highlight spanning a range boundary", () => {
    expect(overlapsDialogue({ start: 8, end: 14 }, ranges)).toBe(true);
  });

  test("highlight fully outside", () => {
    expect(overlapsDialogue({ start: 22, end: 28 }, ranges)).toBe(false);
  });

  test("highlight before all ranges", () => {
    expect(overlapsDialogue({ start: 0, end: 5 }, ranges)).toBe(false);
  });

  test("highlight after all ranges", () => {
    expect(overlapsDialogue({ start: 45, end: 50 }, ranges)).toBe(false);
  });

  test("highlight exactly at range boundary (adjacent, not overlapping)", () => {
    // end: 20 means the range covers up to index 19. highlight starts at 20.
    expect(overlapsDialogue({ start: 20, end: 25 }, ranges)).toBe(false);
  });

  test("empty ranges", () => {
    expect(overlapsDialogue({ start: 5, end: 10 }, [])).toBe(false);
  });
});
