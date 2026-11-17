import { isBinaryPath, type Failure, type GuardCtx } from "./lib.ts";

const HEX_RE = /#([0-9a-fA-F]{3,8})\b/;
const RGB_RE = /rgba?\(/i;
const PX_RE = /\d+px/;

function isCommentOnly(line: string): boolean {
  const trimmed = line.trimStart();
  return (
    trimmed.startsWith("/*") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("*") ||
    trimmed.startsWith("*/")
  );
}

export function run(ctx: GuardCtx): Failure[] {
  if (isBinaryPath(ctx.file)) return [];
  const isCss = ctx.file.endsWith(".css");
  const isAstro = ctx.file.endsWith(".astro");
  if (!isAstro && !(isCss && ctx.file.startsWith("src/"))) return [];
  if (ctx.file === "src/styles/tokens.css") return [];

  const failures: Failure[] = [];
  const lines = ctx.content.split("\n");
  lines.forEach((line, i) => {
    const lineNo = i + 1;
    const isMedia = /@media/.test(line);
    const commentOnly = isCommentOnly(line);
    if (HEX_RE.test(line) && !commentOnly) failures.push({ guard: "css-hygiene", file: ctx.file, line: lineNo });
    if (RGB_RE.test(line) && !commentOnly) failures.push({ guard: "css-hygiene", file: ctx.file, line: lineNo });
    if (!isMedia && !commentOnly && PX_RE.test(line)) failures.push({ guard: "css-hygiene", file: ctx.file, line: lineNo });
  });
  return failures;
}
