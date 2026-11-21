/*
  Client init. Runs on every astro:page-load.
  Binds: theme toggle, nav menu, mailto links, reveal observer, stack offsets.
  Disconnects the previous observer first so nothing binds twice.
*/

import { buildMailto } from "../lib/mailto.ts";
import { emailParts } from "../lib/contact.ts";
import { stackTop } from "../lib/stack.ts";
import { resolveTheme } from "../lib/theme.ts";

let revealObserver: IntersectionObserver | null = null;
let resizeHandle: (() => void) | null = null;

/** Bind theme toggle button. The label always names the action it will do. */
function bindThemeToggle() {
  const toggle = document.querySelector<HTMLElement>("[data-theme-toggle]");
  if (!toggle) return;
  if (toggle.dataset.bound) return; // init runs on load and on every page change
  toggle.dataset.bound = "1";

  const update = () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    toggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  };

  toggle.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    const next = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // ignore quota/private-mode errors
    }
    update();
  });

  update();
}

let menuKeyHandler: ((event: KeyboardEvent) => void) | null = null;

/**
 * Bind the nav menu button (phone). The links work without JS; this only opens and
 * closes them. The button text and aria-expanded change together.
 */
function bindNavMenu() {
  const menuBtn = document.querySelector<HTMLElement>(".menu-toggle");
  const links = document.querySelector<HTMLElement>(".nav-links");
  if (!menuBtn || !links) return;

  const newBtn = menuBtn.cloneNode(true) as HTMLElement;
  menuBtn.parentNode?.replaceChild(newBtn, menuBtn);

  const isOpen = () => links.classList.contains("open");
  const setOpen = (open: boolean) => {
    links.classList.toggle("open", open);
    newBtn.setAttribute("aria-expanded", String(open));
    newBtn.textContent = open ? "Close" : "Menu";
  };

  newBtn.addEventListener("click", () => setOpen(!isOpen()));

  // Escape closes the menu and returns focus to the button.
  if (menuKeyHandler) document.removeEventListener("keydown", menuKeyHandler);
  menuKeyHandler = (event) => {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      newBtn.focus();
    }
  };
  document.addEventListener("keydown", menuKeyHandler);

  // Following a menu link closes the menu (same-page anchors do not reload).
  links.addEventListener("click", (event) => {
    if ((event.target as Element).closest("a")) setOpen(false);
  });
}

/** Assemble mailto hrefs for a[data-mail] anchors. */
function bindMailtoLinks() {
  const anchors = document.querySelectorAll<HTMLAnchorElement>("a[data-mail]");

  anchors.forEach((a) => {
    if (a.dataset.mailBound) return;
    a.dataset.mailBound = "1";
    a.href = buildMailto({
      user: emailParts.user,
      domain: emailParts.domain,
      subject: a.dataset.mailSubject,
    });
  });
}

/** Set up reveal IntersectionObserver for .reveal elements. */
function bindRevealObserver() {
  if (revealObserver) {
    revealObserver.disconnect();
    revealObserver = null;
  }

  const elements = document.querySelectorAll<HTMLElement>(".reveal");
  if (!elements.length) return;

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((el) => revealObserver!.observe(el));
}

/** Set up stack offsets for sticky sections on the home page. */
function bindStackOffsets() {
  const html = document.documentElement;
  const stackMain = document.querySelector<HTMLElement>("[data-scroll='stack']");

  if (!stackMain) {
    html.classList.remove("has-stack");
    return;
  }

  html.classList.add("has-stack");

  const sections = document.querySelectorAll<HTMLElement>("[data-scroll='stack'] .section");
  const applyOffsets = () => {
    const vh = window.innerHeight;
    sections.forEach((section) => {
      const top = stackTop(vh, section.offsetHeight);
      section.style.top = `${top}px`;
    });
  };

  applyOffsets();

  // Clean up previous resize listener so nothing binds twice.
  if (resizeHandle) {
    resizeHandle();
  }

  let rafId: number | null = null;
  const onResize = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(applyOffsets);
  };
  window.addEventListener("resize", onResize);
  resizeHandle = () => {
    window.removeEventListener("resize", onResize);
    if (rafId) cancelAnimationFrame(rafId);
  };

  document.fonts.ready.then(applyOffsets);
}

/** Public entry point. Called on every astro:page-load. */
export function init() {
  // Marks "scripts are running": the phone menu and filter chips depend on it.
  // Set again here because a client-side page change replaces the <html> attributes.
  document.documentElement.classList.add("js");
  bindThemeToggle();
  bindNavMenu();
  bindMailtoLinks();
  bindRevealObserver();
  bindStackOffsets();
}

/* ------------------------------------------------------------------ */
/* Inline head theme script (before paint)                            */
/* ------------------------------------------------------------------ */

/**
 * Returns the inline head script source. The resolveTheme implementation is
 * inserted via resolveTheme.toString() so there is one implementation shared
 * between src/lib/theme.ts and the head script.
 */
export function inlineThemeScript(): string {
  const resolveThemeSource = resolveTheme.toString();
  return `
(function() {
  ${resolveThemeSource}
  try {
    var stored = localStorage.getItem('theme');
  } catch (e) {
    var stored = null;
  }
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = resolveTheme(stored, systemDark);
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.add('js');
})();

// Register the after-swap listener once (guarded by registration flag,
// not by returning early inside the handler).
if (!window.__themeSwapRegistered) {
  window.__themeSwapRegistered = true;
  document.addEventListener('astro:after-swap', function() {
    try {
      var stored = localStorage.getItem('theme');
    } catch (e) {
      var stored = null;
    }
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = resolveTheme(stored, systemDark);
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.add('js');
  });
}
`;
}