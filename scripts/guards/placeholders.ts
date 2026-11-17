import { findTerms, isBinaryPath, type Failure, type GuardCtx } from "./lib.ts";

const TERMS = [
  "placeholder",
  "company a",
  "company b",
  "company c",
  "one line on",
  "one-line pitch",
  "a short paragraph",
  "impact bullet",
  "two or three lines",
  "city, country",
];

export function run(ctx: GuardCtx): Failure[] {
  if (isBinaryPath(ctx.file)) return [];
  if (
    !ctx.file.startsWith("src/content/") &&
    !ctx.file.startsWith("src/pages/") &&
    !ctx.file.startsWith("src/components/")
  ) {
    return [];
  }
  const lines = findTerms(ctx.content, TERMS);
  return lines.map((line) => ({ guard: "placeholders", file: ctx.file, line }));
}
