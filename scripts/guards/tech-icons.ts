import { existsSync, readFileSync } from "node:fs";
import { type Failure, type GuardCtx } from "./lib.ts";

const DIR = "src/assets/tech-icons";

interface Entry {
  label?: string;
  file?: string;
  source?: string;
  version?: string;
  license?: string;
}

function readText(path: string): string {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

/** Every technology named in a role's `tech: [...]` list. */
export function techNames(experienceSource: string): string[] {
  const names = new Set<string>();
  for (const m of experienceSource.matchAll(/\btech:\s*\[([^\]]*)\]/g)) {
    for (const s of m[1].matchAll(/"([^"]+)"/g)) names.add(s[1]);
  }
  return [...names];
}

export interface TechIconOpts {
  manifest?: string;
  experience?: string;
  fileExists?: (path: string) => boolean;
}

export function run(_ctx: GuardCtx, opts: TechIconOpts = {}): Failure[] {
  const manifestText = opts.manifest ?? readText(`${DIR}/manifest.json`);
  const experience = opts.experience ?? readText("src/content/experience.ts");
  const exists = opts.fileExists ?? existsSync;
  const failures: Failure[] = [];
  const fail = (msg: string) => failures.push({ guard: "tech-icons", file: msg, line: 1 });

  let icons: Entry[] = [];
  try {
    icons = (JSON.parse(manifestText) as { icons?: Entry[] }).icons ?? [];
  } catch {
    fail(`${DIR}/manifest.json is missing or not valid JSON`);
    return failures;
  }

  const labels = new Set<string>();
  for (const e of icons) {
    const name = e.label ?? "(no label)";
    if (!e.label || !e.file || !e.source || !e.version || !e.license) {
      fail(`manifest entry "${name}" needs label, file, source, version and license`);
    }
    if (e.file && !exists(`${DIR}/${e.file}`)) fail(`icon file ${DIR}/${e.file} for "${name}" does not exist`);
    if (e.label) labels.add(e.label);
  }
  for (const t of techNames(experience)) {
    if (!labels.has(t)) fail(`technology "${t}" in experience.ts has no icon in the manifest`);
  }
  return failures;
}
