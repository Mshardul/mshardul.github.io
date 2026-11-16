// Behaviour shared by the three option pages: theme, reveal-on-scroll, sticky offsets for stack mode.
(function () {
  const root = document.documentElement;

  // opened on its own? go through the common header (index.html) so the switcher is always there
  if (window.top === window) {
    const option = { snap: "a", stack: "b", flow: "c" }[document.body.dataset.scroll];
    const theme = location.hash === "#dark" ? "dark" : "light";
    location.replace(`index.html#${option}-desktop-${theme}`);
    return;
  }

  // nav links scroll to a section without touching the URL hash (the hash carries the theme)
  document.querySelectorAll("[data-scroll-to]").forEach((a) =>
    a.addEventListener("click", () =>
      document.getElementById(a.dataset.scrollTo)?.scrollIntoView({ behavior: "smooth" })
    )
  );

  // theme: #light or #dark in the URL wins (the index page uses this), else system setting
  function applyTheme() {
    const fromHash = location.hash.replace("#", "");
    const dark = fromHash === "dark" || (fromHash !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
    root.dataset.theme = dark ? "dark" : "light";
  }
  applyTheme();
  addEventListener("hashchange", applyTheme);

  document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  });

  // reveal
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // stack: a section taller than the screen sticks at its bottom edge, so all of it can be read
  function setStackOffsets() {
    if (document.body.dataset.scroll !== "stack") return;
    document.querySelectorAll(".section").forEach((s) => {
      s.style.top = Math.min(0, innerHeight - s.offsetHeight) + "px";
    });
  }
  setStackOffsets();
  addEventListener("resize", setStackOffsets);
  document.fonts?.ready.then(setStackOffsets);
})();
