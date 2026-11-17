import { findTerms, isBinaryPath, type Failure, type GuardCtx } from "./lib.ts";

const BANNED = ["managed", "direct report", "spearhead", "100 concurrent"];

export function run(ctx: GuardCtx): Failure[] {
  if (isBinaryPath(ctx.file)) return [];
  if (!ctx.file.startsWith("src/content/")) return [];
  const lines = findTerms(ctx.content, BANNED);
  return lines.map((line) => ({ guard: "generic-bans", file: ctx.file, line }));
}
