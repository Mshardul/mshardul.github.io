import { isBinaryPath, type Failure, type GuardCtx } from "./lib.ts";

const AMERICAN_SPELLINGS = [
  "organization",
  "optimize",
  "behavior",
  "prioritize",
  "analyze",
  "center",
  "color",
];

export function run(ctx: GuardCtx): Failure[] {
  if (isBinaryPath(ctx.file)) return [];
  const inScope =
    ctx.file.startsWith("src/content/") ||
    ctx.file.startsWith("src/pages/") ||
    ctx.file.startsWith("src/components/");
  if (!inScope) return [];

  const failures: Failure[] = [];
  const lines = ctx.content.split("\n");
  lines.forEach((line, i) => {
    const lineNo = i + 1;
    if (line.includes("—")) {
      failures.push({ guard: "style", file: ctx.file, line: lineNo });
    }
    if (ctx.file.startsWith("src/content/")) {
      for (const word of AMERICAN_SPELLINGS) {
        const re = new RegExp(`\\b${word}\\b`, "i");
        if (re.test(line)) {
          failures.push({ guard: "style", file: ctx.file, line: lineNo });
          break;
        }
      }
    }
  });
  return failures;
}
