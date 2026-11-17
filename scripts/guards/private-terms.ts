import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { findTerms, isBinaryPath, type Failure, type GuardCtx } from "./lib.ts";

/** The gitignored list at the repo root, used when PRIVATE_TERMS_FILE is not set. */
const DEFAULT_TERMS_FILE = fileURLToPath(new URL("../../.private-terms", import.meta.url));

export interface PrivateTermsOpts {
  defaultFile?: string;
}

/**
 * Terms from PRIVATE_TERMS_FILE if set (it wins, and never falls back), else
 * from the default file. Null if unusable: unreadable or empty.
 */
function loadTerms(defaultFile: string): string[] | null {
  const path = process.env.PRIVATE_TERMS_FILE || defaultFile;
  try {
    const terms = readFileSync(path, "utf8")
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t !== "" && !t.startsWith("#"));
    return terms.length > 0 ? terms : null;
  } catch {
    return null;
  }
}

export function run(ctx: GuardCtx, opts: PrivateTermsOpts = {}): Failure[] {
  if (isBinaryPath(ctx.file)) return [];

  const terms = loadTerms(opts.defaultFile ?? DEFAULT_TERMS_FILE);
  if (terms === null) {
    // Fails closed: no list, no commit. CI has no list and skips this guard.
    if (process.env.CI === "true") return [];
    return [{ guard: "private-terms", file: "PRIVATE_TERMS_FILE", line: 1 }];
  }

  const lines = findTerms(ctx.content, terms);
  return lines.map((line) => ({ guard: "private-terms", file: ctx.file, line }));
}
