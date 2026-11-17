import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { run as privateTerms } from "./guards/private-terms.ts";
import { run as genericBans } from "./guards/generic-bans.ts";
import { run as emailLocation } from "./guards/email-location.ts";
import { run as placeholders } from "./guards/placeholders.ts";
import { run as style } from "./guards/style.ts";
import { run as cssHygiene } from "./guards/css-hygiene.ts";
import { run as noindex } from "./guards/noindex.ts";
import { run as cssUsage } from "./guards/css-usage.ts";
import {
  type Failure,
  type GuardCtx,
  commitAddedLines,
  commitMessage,
  readStagedContent,
  stagedPaths,
} from "./guards/lib.ts";

// Fail guards: any failure exits non-zero (blocks commit/push/CI).
const FAIL_GUARDS: Array<(ctx: GuardCtx) => Failure[]> = [
  privateTerms,
  genericBans,
  emailLocation,
  cssHygiene,
];

// Warn guards: printed with a "warn" prefix and do not block, until `--strict`
// is passed. Task 18 and CI switch `--strict` on once all placeholder copy and
// inline style issues are gone.
const WARN_GUARDS: Array<(ctx: GuardCtx) => Failure[]> = [
  placeholders,
  style,
];

// Message and commit modes only run private-terms. The other guards need real
// file paths (email-location, css-hygiene) or repo config (noindex), and
// generic-bans/placeholders/style are scoped to src trees.
const MESSAGE_GUARDS: Array<(ctx: GuardCtx) => Failure[]> = [privateTerms];

const GLOBAL_GUARDS: Array<(ctx: GuardCtx) => Failure[]> = [noindex];

// Repo-level warn guards: warn until Task 10 clears the CSS-usage failures,
// then move to GLOBAL_GUARDS.
const GLOBAL_WARN_GUARDS: Array<(ctx: GuardCtx) => Failure[]> = [cssUsage];

function readFile(path: string): string {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

function addFailure(
  failures: Failure[],
  seen: Set<string>,
  f: Failure
): void {
  const key = `${f.guard}|${f.file}|${f.line}`;
  if (!seen.has(key)) {
    seen.add(key);
    failures.push(f);
  }
}

function getPaths(mode: "all" | "staged"): string[] {
  if (mode === "staged") {
    return stagedPaths();
  }
  try {
    const out = execSync("git ls-files -z", { encoding: "utf8" });
    return out.split("\0").filter(Boolean);
  } catch {
    return [];
  }
}

function contentFor(path: string, mode: "all" | "staged"): string {
  return mode === "staged" ? readStagedContent(path) : readFile(path);
}

/** Scan the message and added lines of each commit; failures name the commit and the real file:line. */
function scanCommits(shas: string[], failures: Failure[], seen: Set<string>): void {
  for (const sha of shas) {
    const short = sha.slice(0, 7);
    for (const guard of MESSAGE_GUARDS) {
      for (const f of guard({ file: `${short} message`, content: commitMessage(sha) })) {
        addFailure(failures, seen, f);
      }
    }
    for (const added of commitAddedLines(sha)) {
      const max = Math.max(0, ...added.lines.keys());
      const content = Array.from({ length: max }, (_, i) => added.lines.get(i + 1) ?? "").join("\n");
      for (const guard of MESSAGE_GUARDS) {
        for (const f of guard({ file: `${short} ${added.file}`, content })) {
          addFailure(failures, seen, f);
        }
      }
    }
  }
}

function main(argv: string[]): number {
  let mode: "all" | "staged" | "message" | "commit" = "all";
  let messageFile: string | null = null;
  const commits: string[] = [];
  const strict = argv.includes("--strict");

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--staged") {
      mode = "staged";
    } else if (a === "--message") {
      mode = "message";
      messageFile = argv[++i] ?? null;
    } else if (a === "--commit") {
      mode = "commit";
      const sha = argv[++i];
      if (sha) commits.push(sha);
    }
  }

  const failures: Failure[] = [];
  const warnings: Failure[] = [];
  const seen = new Set<string>();
  const warnSeen = new Set<string>();

  if (mode === "message") {
    if (!messageFile) {
      console.error("guard: --message requires a commit message file");
      return 1;
    }
    const content = readFile(messageFile);
    if (content === "") {
      console.error(`guard: cannot read message file: ${messageFile}`);
      return 1;
    }
    for (const guard of MESSAGE_GUARDS) {
      for (const f of guard({ file: messageFile, content })) {
        addFailure(failures, seen, f);
      }
    }
  } else if (mode === "commit") {
    if (commits.length === 0) {
      console.error("guard: --commit requires a commit sha");
      return 1;
    }
    try {
      scanCommits(commits, failures, seen);
    } catch {
      console.error(`guard: cannot read commit ${commits.join(", ")}`);
      return 1;
    }
  } else {
    for (const path of getPaths(mode)) {
      const content = contentFor(path, mode);
      for (const guard of FAIL_GUARDS) {
        for (const f of guard({ file: path, content })) addFailure(failures, seen, f);
      }
      for (const guard of WARN_GUARDS) {
        for (const f of guard({ file: path, content })) {
          addFailure(strict ? failures : warnings, strict ? seen : warnSeen, f);
        }
      }
    }
    // Global guards (e.g. noindex) evaluate repo-level config once.
    for (const guard of GLOBAL_GUARDS) {
      for (const f of guard({ file: "", content: "" })) {
        addFailure(failures, seen, f);
      }
    }
    for (const guard of GLOBAL_WARN_GUARDS) {
      for (const f of guard({ file: "", content: "" })) {
        addFailure(strict ? failures : warnings, strict ? seen : warnSeen, f);
      }
    }
  }

  for (const f of failures) {
    console.log(`${f.guard}: ${f.file}:${f.line}`);
  }
  for (const f of warnings) {
    console.log(`warn ${f.guard}: ${f.file}:${f.line}`);
  }

  if (warnings.length > 0) {
    console.error(`\n${warnings.length} warning(s), not blocking (use --strict to block)`);
  }
  if (failures.length > 0) {
    console.error(`\n${failures.length} guard failure(s)`);
    return 1;
  }
  return 0;
}

process.exitCode = main(process.argv.slice(2));
