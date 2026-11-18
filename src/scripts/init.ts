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

/** Bind theme toggle button. */
function bindThemeToggle() {
  const toggle = document.querySelector<HTMLElement>("[data-theme-toggle], .theme-toggle");
  if (!toggle) return;

  const update = () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    toggle.setAttribute("aria-pressed", String(isDark));
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

/** Bind nav menu button (mobile). Toggles a class instead of inline style. */
function bindNavMenu() {
  const menuBtn = document.querySelector<HTMLElement>(".nav__menu");
  const links = document.querySelector<HTMLElement>(".nav__links");
  if (!menuBtn || !links) return;

  const newBtn = menuBtn.cloneNode(true) as HTMLElement;
  menuBtn.parentNode?.replaceChild(newBtn, menuBtn);

  const setOpen = (open: boolean) => {
    links.classList.toggle("nav__links--open", open);
    newBtn.setAttribute("aria-expanded", String(open));
  };
  const isOpen = () => links.classList.contains("nav__links--open");

  newBtn.addEventListener("click", () => setOpen(!isOpen()));

  // Escape closes the menu and returns focus to the button.
  links.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      newBtn.focus();
    }
  });

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
})();

// Register the after-swap listener once (guarded by registration flag,
// not by returning early inside the handler).
if (!window.__themeSwapRegistered) {
  window.__themeSwapRegistered = true;
  window.addEventListener('astro:after-swap', function() {
    try {
      var stored = localStorage.getItem('theme');
    } catch (e) {
      var stored = null;
    }
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = resolveTheme(stored, systemDark);
    document.documentElement.dataset.theme = theme;
  });
}
`;
}