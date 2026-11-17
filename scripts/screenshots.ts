/*
  Visual check runner: `make screenshots`.

  Serves the built `dist/` on a free local port and screenshots every page view
  in every browser, screen size, theme and JS setting, into
  `.screenshots/<yyyymmdd>-<HHMMSS>/<browser>/<screen>/<view>--<theme>--js-<on|off>.png`.

  A view is a path, optionally with a `#id`. A hash view scrolls to that
  element and captures one viewport; a view without a hash captures the full
  page unless it is marked `full: false`.

  Filters (all optional, comma-separated): --view, --screen, --theme, --js, --browser
  e.g. node scripts/screenshots.ts --view home,experience --screen mobile --theme dark
*/

import { createServer, type Server } from "node:http";
import { existsSync, readFileSync, statSync, mkdirSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { chromium, webkit, type Browser, type BrowserType } from "playwright";
import { projects } from "../src/content/projects.ts";

const DIST = resolve("dist");
const OUT_ROOT = resolve(".screenshots");

type View = { name: string; url: string; full: boolean };

const homeSections = ["experience", "built", "skills", "education", "about", "build", "contact"];

const VIEWS: View[] = [
  { name: "home", url: "/", full: false },
  ...homeSections.map((id) => ({ name: `home-${id}`, url: `/#${id}`, full: false })),
  { name: "experience", url: "/experience", full: true },
  { name: "projects", url: "/projects", full: true },
  ...projects.map((p) => ({ name: `project-${p.slug}`, url: `/projects/${p.slug}`, full: true })),
  { name: "build-with-me", url: "/build-with-me", full: true },
  { name: "not-found", url: "/404.html", full: true },
];

const SCREENS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
];

const THEMES = ["light", "dark"] as const;
const JS_MODES = ["on", "off"] as const;
const BROWSERS: Record<string, BrowserType> = { chrome: chromium, safari: webkit };
const DEFAULT_BROWSERS = ["chrome"];

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".txt": "text/plain",
};

function serveDist(): Promise<{ server: Server; origin: string }> {
  const server = createServer((req, res) => {
    const pathname = decodeURIComponent((req.url ?? "/").split(/[?#]/)[0]);
    let file = join(DIST, pathname);
    if (!file.startsWith(DIST)) {
      res.writeHead(403).end();
      return;
    }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
    let status = 200;
    if (!existsSync(file)) {
      file = join(DIST, "404.html");
      status = 404;
    }
    res.writeHead(status, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
    res.end(readFileSync(file));
  });
  return new Promise((done) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      done({ server, origin: `http://127.0.0.1:${port}` });
    });
  });
}

function stamp(date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  const day = `${date.getFullYear()}${p(date.getMonth() + 1)}${p(date.getDate())}`;
  return `${day}-${p(date.getHours())}${p(date.getMinutes())}${p(date.getSeconds())}`;
}

function pick<T>(all: readonly T[], wanted: string | undefined, key: (item: T) => string, label: string): T[] {
  if (!wanted) return [...all];
  const names = wanted.split(",");
  const chosen = all.filter((item) => names.includes(key(item)));
  const known = all.map(key).join(", ");
  const unknown = names.filter((n) => !all.some((item) => key(item) === n));
  if (unknown.length) throw new Error(`Unknown ${label}: ${unknown.join(", ")}. Known: ${known}`);
  return chosen;
}

async function main() {
  const { values } = parseArgs({
    options: {
      view: { type: "string" },
      screen: { type: "string" },
      theme: { type: "string" },
      js: { type: "string" },
      browser: { type: "string" },
    },
  });

  if (!existsSync(join(DIST, "index.html"))) {
    throw new Error("dist/ is missing. Run `make screenshots` (it builds first) or `npm run build`.");
  }

  const views = pick(VIEWS, values.view, (v) => v.name, "view");
  const screens = pick(SCREENS, values.screen, (s) => s.name, "screen");
  const themes = pick(THEMES, values.theme, (t) => t, "theme");
  const jsModes = pick(JS_MODES, values.js, (j) => j, "js mode");
  const browserNames = values.browser ? values.browser.split(",") : DEFAULT_BROWSERS;
  for (const name of browserNames) {
    if (!BROWSERS[name]) throw new Error(`Unknown browser: ${name}. Known: ${Object.keys(BROWSERS).join(", ")}`);
  }

  const runDir = join(OUT_ROOT, stamp());
  const { server, origin } = await serveDist();
  let count = 0;
  const failures: string[] = [];

  try {
    for (const browserName of browserNames) {
      const browser: Browser = await BROWSERS[browserName].launch();
      for (const screen of screens) {
        const dir = join(runDir, browserName, screen.name);
        mkdirSync(dir, { recursive: true });
        for (const theme of themes) {
          for (const js of jsModes) {
            const context = await browser.newContext({
              viewport: { width: screen.width, height: screen.height },
              colorScheme: theme,
              javaScriptEnabled: js === "on",
            });
            const page = await context.newPage();
            for (const view of views) {
              const file = join(dir, `${view.name}--${theme}--js-${js}.png`);
              try {
                await page.goto(origin + view.url, { waitUntil: "load" });
                await page.evaluate(() => document.fonts.ready).catch(() => {});
                // Let reveal transitions and scroll-to-hash settle.
                await page.waitForTimeout(view.url.includes("#") ? 900 : 300);
                await page.screenshot({ path: file, fullPage: view.full });
                count += 1;
              } catch (error) {
                failures.push(`${browserName}/${screen.name}/${view.name}--${theme}--js-${js}: ${(error as Error).message.split("\n")[0]}`);
              }
            }
            await context.close();
          }
        }
      }
      await browser.close();
    }
  } finally {
    server.close();
  }

  console.log(`${count} screenshot(s) in ${runDir}`);
  if (failures.length) {
    console.error(`${failures.length} failure(s):\n${failures.join("\n")}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
