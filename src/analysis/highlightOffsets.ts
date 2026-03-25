import type { Nodes } from "nlcst";

/**
 * Extract start/end offsets from an NLCST node.
 * This is mostly for typescript to shut up
 */
export function highlightOffsets(
  node: Nodes,
): { start: number; end: number } | null {
  const start = node.position?.start.offset;
  const end = node.position?.end.offset;
  if (start === undefined || end === undefined) return null;
  return { start, end };
}
