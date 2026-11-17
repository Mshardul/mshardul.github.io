import { readFileSync } from "node:fs";
import { type Failure, type GuardCtx } from "./lib.ts";

function readText(path: string): string {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

function indexableValue(text: string): boolean | null {
  const m = text.match(/INDEXABLE\s*(?::\s*\w+)?\s*=\s*(true|false)/);
  return m ? m[1] === "true" : null;
}

function hasExactDisallowRoot(robots: string): boolean {
  return robots.split("\n").some((line) => line.trim() === "Disallow: /");
}

export interface NoIndexOpts {
  site?: string;
  robots?: string;
  base?: string;
}

export function run(
  _ctx: GuardCtx,
  opts: NoIndexOpts = {}
): Failure[] {
  const siteText = opts.site ?? readText("src/lib/site.ts");
  const robots = opts.robots ?? readText("public/robots.txt");
  const base = opts.base ?? readText("src/layouts/BaseLayout.astro");

  const indexable = indexableValue(siteText);
  const hasDisallow = hasExactDisallowRoot(robots);
  const hasRobotsMeta = base.includes('name="robots"') && base.includes("noindex");

  const failures: Failure[] = [];
  if (indexable === null) {
    failures.push({ guard: "noindex", file: "src/lib/site.ts", line: 1 });
  } else if (indexable === false) {
    if (!hasDisallow) {
      failures.push({ guard: "noindex", file: "public/robots.txt", line: 1 });
    }
    if (!hasRobotsMeta) {
      failures.push({ guard: "noindex", file: "src/layouts/BaseLayout.astro", line: 1 });
    }
  } else if (indexable === true && hasDisallow) {
    failures.push({ guard: "noindex", file: "public/robots.txt", line: 1 });
  }
  return failures;
}
