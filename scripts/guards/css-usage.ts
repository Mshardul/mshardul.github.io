import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { posix } from "node:path";
import { type Failure, type GuardCtx } from "./lib.ts";

/*
  Repo-level guard (like noindex): reads every CSS, .astro and .ts file under
  src and fails on
    - a src/styles/components/*.css file that no .astro or .ts file imports;
    - a class defined in CSS that no markup or script uses;
    - a class used in markup that no CSS defines.
  Failures carry file and line only, never the class name.

  Uses: class="..." and class:list in .astro; classList calls and selector
  strings (querySelector, closest, matches) in .ts. A class built from a
  template literal contributes its literal parts; a literal fragment next to
  ${...} acts as a prefix or suffix and counts every matching CSS class as used.
  A class inside :not(), :is(), :where() or :has() is a reference, not a definition.
*/

const GUARD = "css-usage";
const COMPONENT_CSS = /^src\/styles\/components\/[^/]+\.css$/;
const NAME = "[A-Za-z_][\\w-]*";

export interface CssUsageOpts {
  files?: Record<string, string>;
}

interface Located {
  name: string;
  line: number;
}

function lineAt(text: string, index: number): number {
  let line = 1;
  for (let i = 0; i < index; i++) if (text.charCodeAt(i) === 10) line++;
  return line;
}

function blank(text: string, re: RegExp): string {
  return text.replace(re, (m) => m.replace(/[^\n]/g, " "));
}

function skipBlock(text: string, open: number): number {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}" && --depth === 0) return i;
  }
  return text.length;
}

/** Classes defined by selectors, and classes only referenced inside :not() and friends. */
function parseCss(raw: string): { defined: Located[]; referenced: string[] } {
  const text = blank(raw, /\/\*[\s\S]*?\*\//g);
  const defined: Located[] = [];
  const referenced: string[] = [];

  const collect = (prelude: string, offset: number) => {
    let selector = blank(prelude, /\[[^\]]*\]/g);
    for (const m of selector.matchAll(new RegExp(`:(?:not|is|where|has)\\(([^)]*)\\)`, "g"))) {
      for (const c of m[1].matchAll(new RegExp(`\\.(${NAME})`, "g"))) referenced.push(c[1]);
    }
    selector = blank(selector, /:(?:not|is|where|has)\([^)]*\)/g);
    for (const m of selector.matchAll(new RegExp(`\\.(${NAME})`, "g"))) {
      defined.push({ name: m[1], line: lineAt(text, offset + (m.index ?? 0)) });
    }
  };

  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === "{") {
      const prelude = text.slice(start, i);
      const head = prelude.trim();
      if (/^@(media|supports|layer|container)\b/.test(head)) {
        start = i + 1;
        continue;
      }
      if (!head.startsWith("@")) collect(prelude, start);
      i = skipBlock(text, i);
      start = i + 1;
    } else if (c === "}" || c === ";") {
      start = i + 1;
    }
  }
  return { defined, referenced };
}

interface Markup {
  tokens: Located[];
  prefixes: string[];
  suffixes: string[];
}

function balancedExpression(text: string, open: number): string {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}" && --depth === 0) return text.slice(open + 1, i);
  }
  return text.slice(open + 1);
}

function parseMarkup(text: string): Markup {
  const tokens: Located[] = [];
  const prefixes: string[] = [];
  const suffixes: string[] = [];
  const split = (value: string) => value.split(/\s+/).filter(Boolean);

  for (const m of text.matchAll(/\bclass(?::list)?=(?:"([^"]*)"|'([^']*)'|(\{))/g)) {
    const line = lineAt(text, m.index ?? 0);
    const quoted = m[1] ?? m[2];
    if (quoted !== undefined) {
      for (const name of split(quoted)) tokens.push({ name, line });
      continue;
    }
    const expr = balancedExpression(text, (m.index ?? 0) + m[0].length - 1);
    for (const lit of expr.matchAll(/"([^"]*)"|'([^']*)'/g)) {
      for (const name of split(lit[1] ?? lit[2] ?? "")) tokens.push({ name, line });
    }
    for (const tpl of expr.matchAll(/`([^`]*)`/g)) {
      const fragment = tpl[1].replace(/\$\{[^}]*\}/g, "\u0000");
      for (const part of split(fragment)) {
        const name = part.replace(/\u0000/g, "");
        if (!part.includes("\u0000")) tokens.push({ name, line });
        else if (name && part.endsWith("\u0000") && !part.startsWith("\u0000")) prefixes.push(name);
        else if (name && part.startsWith("\u0000") && !part.endsWith("\u0000")) suffixes.push(name);
      }
    }
  }
  return { tokens, prefixes, suffixes };
}

/** Class names a script adds, removes, toggles or selects. */
function parseScript(text: string): string[] {
  const names: string[] = [];
  for (const m of text.matchAll(/classList\.(?:add|remove|toggle|contains|replace)\(([^)]*)\)/g)) {
    for (const lit of m[1].matchAll(/"([^"]*)"|'([^']*)'/g)) names.push(...(lit[1] ?? lit[2] ?? "").split(/\s+/).filter(Boolean));
  }
  for (const m of text.matchAll(/(?:querySelector(?:All)?|closest|matches)\(\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/g)) {
    const selector = m[1] ?? m[2] ?? m[3] ?? "";
    for (const c of selector.matchAll(new RegExp(`\\.(${NAME})`, "g"))) names.push(c[1]);
  }
  for (const m of text.matchAll(/getElementsByClassName\(\s*(?:"([^"]*)"|'([^']*)')/g)) {
    names.push(...(m[1] ?? m[2] ?? "").split(/\s+/).filter(Boolean));
  }
  return names;
}

function importedCss(file: string, text: string): string[] {
  const dir = posix.dirname(file);
  return [...text.matchAll(/import\s+["']([^"']+\.css)["']/g)].map((m) => posix.join(dir, m[1]));
}

function loadSourceFiles(): Record<string, string> {
  const files: Record<string, string> = {};
  let listed: string[] = [];
  try {
    listed = execFileSync("git", ["ls-files", "-z", "src"], { encoding: "utf8" }).split("\0").filter(Boolean);
  } catch {
    return files;
  }
  for (const path of listed) {
    if (!/\.(css|astro|ts)$/.test(path)) continue;
    try {
      files[path] = readFileSync(path, "utf8");
    } catch {
      // a file listed by git but missing on disk is not this guard's concern
    }
  }
  return files;
}

export function run(_ctx: GuardCtx, opts: CssUsageOpts = {}): Failure[] {
  const files = opts.files ?? loadSourceFiles();
  const failures: Failure[] = [];
  const fail = (file: string, line: number) => failures.push({ guard: GUARD, file, line });

  const definedNames = new Set<string>();
  const used = new Set<string>();
  const prefixes: string[] = [];
  const suffixes: string[] = [];
  const imported = new Set<string>();
  const cssDefinitions: Array<{ file: string; defined: Located[] }> = [];
  const markupUses: Array<{ file: string; tokens: Located[] }> = [];

  for (const [file, text] of Object.entries(files)) {
    if (file.endsWith(".css")) {
      const { defined, referenced } = parseCss(text);
      cssDefinitions.push({ file, defined });
      for (const d of defined) definedNames.add(d.name);
      for (const name of referenced) used.add(name);
    } else if (file.endsWith(".astro")) {
      const markup = parseMarkup(text);
      markupUses.push({ file, tokens: markup.tokens });
      for (const t of markup.tokens) used.add(t.name);
      prefixes.push(...markup.prefixes);
      suffixes.push(...markup.suffixes);
      for (const css of importedCss(file, text)) imported.add(css);
    } else if (file.endsWith(".ts")) {
      for (const name of parseScript(text)) used.add(name);
      for (const css of importedCss(file, text)) imported.add(css);
    }
  }

  const isUsed = (name: string) =>
    used.has(name) || prefixes.some((p) => name.startsWith(p)) || suffixes.some((s) => name.endsWith(s));

  for (const file of Object.keys(files)) {
    if (COMPONENT_CSS.test(file) && !imported.has(file)) fail(file, 1);
  }
  for (const { file, defined } of cssDefinitions) {
    for (const d of defined) if (!isUsed(d.name)) fail(file, d.line);
  }
  for (const { file, tokens } of markupUses) {
    for (const t of tokens) if (!definedNames.has(t.name)) fail(file, t.line);
  }

  const seen = new Set<string>();
  return failures
    .filter((f) => {
      const key = `${f.file}|${f.line}`;
      return seen.has(key) ? false : (seen.add(key), true);
    })
    .sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
}
