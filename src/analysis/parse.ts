import type { Root } from "nlcst";
import retextEnglish from "retext-english";
import { unified } from "unified";

const parser = unified().use(retextEnglish);

export function parse(text: string): Root {
  return parser.parse(text);
}
