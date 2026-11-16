// Common header: switches option, device and theme without leaving the page.
// Deep link: index.html#<a|b|c>-<desktop|phone>-<light|dark>, e.g. #b-phone-dark
(function () {
  const OPTIONS = {
    a: { file: "a-snap.html", note: "A, Snap: each section fills the screen and snaps into place. Feels like separate pages. Cost: sections taller than the screen (timeline, project grid) scroll awkwardly inside the snap." },
    b: { file: "b-stack.html", note: "B, Stack: each section slides up over the previous one like stacked cards. Most page-like. Cost: needs a small script so tall sections stay readable; busiest on phones." },
    c: { file: "c-flow.html", note: "C, Flow: a normal long page where content fades in as you reach it. Safest with any content length. Cost: least like separate pages." },
  };

  const frame = document.getElementById("frame");
  const stage = document.getElementById("stage");
  const note = document.getElementById("note");
  const state = { option: "c", device: "desktop", theme: "light" };

  function readHash() {
    const [option, device, theme] = location.hash.replace("#", "").split("-");
    if (OPTIONS[option]) state.option = option;
    if (device === "desktop" || device === "phone") state.device = device;
    if (theme === "light" || theme === "dark") state.theme = theme;
  }

  function render() {
    document.querySelectorAll("[data-key]").forEach((b) =>
      b.setAttribute("aria-pressed", String(state[b.dataset.key] === b.dataset.value))
    );
    stage.classList.toggle("viewer__stage--phone", state.device === "phone");
    note.textContent = OPTIONS[state.option].note;

    // when only the fragment changes (theme switch), this is a same-document navigation: the page reacts to hashchange, no reload
    frame.src = `${OPTIONS[state.option].file}#${state.theme}`;

    history.replaceState(null, "", `#${state.option}-${state.device}-${state.theme}`);
  }

  document.querySelectorAll("[data-key]").forEach((b) =>
    b.addEventListener("click", () => {
      state[b.dataset.key] = b.dataset.value;
      render();
    })
  );
  addEventListener("hashchange", () => { readHash(); render(); });

  readHash();
  render();
})();
