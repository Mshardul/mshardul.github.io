import { execSync, execFileSync } from "node:child_process";

export interface Failure {
  guard: string;
  file: string;
  line: number;
}

export interface GuardCtx {
  file: string;
  content: string;
}

const BINARY_EXT = new Set([
  ".pdf", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico",
  ".woff", ".woff2", ".ttf", ".eot", ".otf",
]);
const LOCK_FILES = new Set(["package-lock.json", "yarn.lock", "pnpm-lock.yaml"]);

export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 1-based line numbers of word-bounded, case-insensitive matches.
 * Uses lookaround instead of \b so terms starting/ending with symbols
 * (e.g. @zzmail, C#) are matched correctly. Lookarounds are only added
 * when the term starts/ends with a word character, so "@zzmail.test" still
 * matches inside "me@zzmail.test".
 */
export function findTerms(text: string, terms: string[]): number[] {
  const lines = text.split("\n");
  const hits: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const term of terms) {
      if (term.length === 0) continue;
      const start = /^\w/.test(term) ? "(?<!\\w)" : "";
      const end = /\w$/.test(term) ? "(?!\\w)" : "";
      const re = new RegExp(`${start}${escapeRegExp(term)}${end}`, "i");
      if (re.test(line)) {
        hits.push(i + 1);
        break;
      }
    }
  }
  return hits;
}

export function isBinaryPath(path: string): boolean {
  const base = path.split("/").pop() ?? "";
  const ext = base.slice(base.lastIndexOf(".")).toLowerCase();
  if (ext.length > 0 && BINARY_EXT.has(ext)) return true;
  if (LOCK_FILES.has(base)) return true;
  return false;
}

/** Paths that differ between HEAD and the index (staged), null-separated. */
export function stagedPaths(): string[] {
  try {
    const out = execSync("git diff --staged --name-only -z", {
      encoding: "utf8",
    });
    return out.split("\0").filter(Boolean);
  } catch {
    return [];
  }
}

export interface AddedLines {
  file: string;
  /** Sparse by 1-based line number in the new file; unlisted lines are "". */
  lines: Map<number, string>;
}

/** Added lines per file from `git show -p -U0` output, with real line numbers. */
export function parseAddedLines(diff: string): AddedLines[] {
  const out: AddedLines[] = [];
  let current: AddedLines | null = null;
  let next = 0;
  for (const raw of diff.split("\n")) {
    if (raw.startsWith("+++ ")) {
      const target = raw.slice(4);
      current = null;
      if (target.startsWith("b/")) {
        current = { file: target.slice(2), lines: new Map() };
        out.push(current);
      }
    } else if (raw.startsWith("@@")) {
      const m = raw.match(/\+(\d+)/);
      next = m ? Number(m[1]) : 0;
    } else if (current && raw.startsWith("+")) {
      current.lines.set(next, raw.slice(1));
      next++;
    }
  }
  return out;
}

/** Added lines of one commit (merges: against every parent). Throws on git error. */
export function commitAddedLines(sha: string): AddedLines[] {
  const diff = execFileSync(
    "git",
    ["show", "--format=", "-p", "-U0", "-m", "--no-color", "--no-ext-diff", sha],
    { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 },
  );
  return parseAddedLines(diff);
}

/** Message of one commit. Throws on git error. */
export function commitMessage(sha: string): string {
  return execFileSync("git", ["log", "-1", "--format=%B", sha], { encoding: "utf8" });
}

/** Content of a path as staged in the index. Empty string if not staged. */
export function readStagedContent(path: string): string {
  try {
    return execFileSync("git", ["show", ":" + path], { encoding: "utf8" });
  } catch {
    return "";
  }
}
