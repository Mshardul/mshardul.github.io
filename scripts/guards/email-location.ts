import { findTerms, isBinaryPath, type Failure, type GuardCtx } from "./lib.ts";
import { emailParts } from "../../src/lib/contact.ts";

const TERMS = [emailParts.user, `@${emailParts.domain}`];

export function run(ctx: GuardCtx): Failure[] {
  if (isBinaryPath(ctx.file)) return [];
  if (ctx.file === "src/lib/contact.ts") return [];
  const lines = findTerms(ctx.content, TERMS);
  return lines.map((line) => ({ guard: "email-location", file: ctx.file, line }));
}
