# Mockup review: decisions

Source: [mockup-review.md](mockup-review.md). All decisions settled and applied to the mockup (stage 1 and 2). See [css-inventory.md](css-inventory.md) sections 13 and 14 for what changed, the deviations and the open interpretations. Next: owner review of the mockup, then the port to `src/`.

| ID | Topic | Decision | Why |
|----|-------|----------|-----|
| 1 | Fix scope | Report only, no code edits yet. Lifted for the CSS at decision 31 | Settle every decision first, then change the mockup once in one reviewable pass |
| 3 | Mobile hero | Small round avatar beside the badge; headline and CTA above the fold | Identity stays, CTA no longer pushed below the fold |
| 4 | Repeated CTAs | Keep the filled header button on every page, unify labels | Sticky header CTA is the only action visible on long pages; the defect is inconsistent labels |
| 5 | Focus ring on navy band | White ring (`--on-navy`) on dark surfaces, scoped to dark bands | Any future dark surface gets a visible ring automatically; no new colour |
| 6 | Control borders | Separate control-border role set to `--mute`; dividers and cards stay faint | Retune controls without touching dividers; meets 3:1 with an existing colour |
| 7 | CTA label | "Get in touch" everywhere | One neutral label fits both hiring and project enquiries |
| 8 | Obvious fixes | Batch purely technical ones (listed below); anything that changes how the page looks gets its own question | Technical bugs have no taste involved; visible changes stay the owner's call |
| 9 | Mobile nav without JS | Links work from plain HTML and CSS; JS only handles open and close. Look and behaviour with JS on stay the same | Nav survives script failure; menu logic stays in `site.js` |
| 10 | Build-with-me project names | Keep the rows as is; names link to a "Coming soon" page until projects are integrated | Projects are not integrated yet |
| 11 | "Ways to start" | Add a link on each of the three, with a subject line per engagement type | Visitor can act at the moment of interest |
| 12 | "Coming soon" page | One shared page, linked from build-with-me and from the project cards | Every unfinished link behaves the same; swap each to its real page later |
| 13 | (closed) | "Get in touch" on all three "ways to start" rejected as repetitive; replaced by 15 | |
| 14 | Projects grid last row | Centre the last row for now. Revisit in the later "projects" phase | Individual project pages are still being created |
| 15 | "Ways to start" links | The engagement title is the link, with an arrow (for example "One-off project →"), subject line per type | No repeated label; matches the "See: experience →" pattern |
| 16 | "Coming soon" page | Build it and keep it permanently as the fallback for every unfinished project and any future upcoming page. Must match the site: both themes, header, footer, same styles | A new card or link never leads to a dead end |
| 17 | Mobile menu open state | Button label switches "Menu" / "Close", `aria-expanded` kept in sync | Text states the action without relying on colour |
| 18 | Stats row | Top rule per cell, no vertical dividers (same pattern as "ways to start" and education) | One pattern across sections; collapses cleanly to 2 columns on mobile |
| 19 | Experience role line | Two lines: title in heading colour, impact in a lighter regular line below | Separates fact from claim; blue stays for links and labels |
| 20 | Celery chip icon | Redraw the traced mark as a flat single-colour glyph, same weight as the other icons | One consistent chip icon style |
| 21, 24 | Dark navy | Dark-theme `--navy` changes from `#101d33` to `#1a2f57`. It paints the contact band and the "Need something built" card. Owner-approved exception to the frozen palette | Band stands out (1.40 vs page); all text AA; ghost border 3.4:1 |
| 22 | Minimum text size | 13px floor. A fixed set of font-size tokens in the CSS; every element uses one of them, no other sizes | Readable floor set once; no stray sizes |
| 23 | Touch targets | Control-height role: 44px on touch devices (`pointer: coarse`), 40px on desktop | Full finger target on phones, compact on desktop; one token with one override |
| 25 | Profile photo in dark mode | Leave untouched; the thin border stays | A filter is tuned to one photo; the photo is identity and should look the same in both themes |
| 26 | Active state on home | None; the logo is the home link | Convention; keeps the nav working without JS (decision 9) |
| 27 | Desktop hero | Slightly smaller max headline size and a larger gap between badge and headline | Hero must fit common laptop heights whatever the headline length |
| 28 | "Two ways" card weight | Hiring card is the heavy (navy) card; "Need something built" becomes the outlined card | Visual weight matches reading order and the hero message |
| 29, 30 | Spacing, type and other sizes | Role-based tokens and classes: each value belongs to a category of use (for example section gap, paragraph gap, header padding), one set of values per category. No per-element or inline values | Uniform across the site; far fewer distinct values; the port reuses the classes |
| 31 | CSS restructure | Inventory first, owner approves the role table, then restructure the mockup CSS (tokens file, role classes, no inline styles) | Roles reviewed as a document before they shape code; mockup becomes the spec for the port |
| 32 | Chips | One chip component with two variants: static tag and interactive filter | One size, radius and focus style; filter adds only hover and selected |
| 33 | Cards | One `.card` base (border, radius, padding) with modifiers (outlined, heavy, link) | A card change happens in one place |
| 34 | Class names | Descriptive role-based names (`.section`, `.button`, `.card--outlined`), renamed in the restructure pass | Readable for the port and for later work |
| 35 | Hardcoded colours | Move into tokens with the exact same values (existing token where it matches, new named token otherwise). No colour shifts | Every colour lives in the token file; palette stays frozen |
| 36 | Button states | Add disabled and active states to the button component, using existing colours | Contact flow will likely need disabled; defined once with the component |
| 37 | Tablet hero | Phone layout up to about 760px, then the desktop two-column layout. Breakpoint is one token | No third layout to maintain |
| 38 | Role table | Approved as written in [css-inventory.md](css-inventory.md) sections 2, 4, 5, 6. Values snap to the roles (most shifts 1-4px); any visible shift above 4px is flagged after restructuring | A small value set keeps the site uniform as it grows |
| 39 | Breakpoints | Three: 560, 760, 980. Nav and stats collapse moves from 860 to 760 after a check that the nav fits at 761px; if it does not, flag it and do not decide silently | Fewer layouts to test; the one risky spot is checked |
| 40 | Page gutter | 24px (was 28px), on the spacing scale | Common phone gutter; scale stays at 7 values, no exceptions |
| 41 | Restructure staging | Stage 1 (tokens, class renames, value snapping), then stage 2 (decision changes). Both applied | Stage 1 checkable against the baseline for drift; decision changes reviewed on their own |
| 42 | Celery chip icon | Use the Simple Icons Celery mark (flat, single colour, same set as the other chip icons) instead of a redraw. Replaces decision 20. The traced file and its manifest entry in `src/assets/tech-icons/` change at port time | The icon exists in the set already; no hand-made mark to maintain |
| 43 | Button labels | One label per kind of action; the label names the action. Every contact (email) button reads "Get in touch" and uses the mail icon; the subject line still differs by context. Buttons that go to a page keep a label naming that page. Labels must not drift between pages for the same action | Labels do not wander |
| 44 | Project pages | Each project's own page lives in its own repo; the site will open it in a new tab. `project.html` stays as the template. Cards go to "Coming soon" until each page exists (decision 12) | Template untouched; links swap to the real pages later |
| 45 | Next step | Owner reviews the mockup first. The port to `src/` is planned and confirmed with the owner before any edit in `src/` | The port copies the mockup, so review changes are made once |
| 46 | Fonts in the port | Self-host Newsreader and Public Sans through pinned `@fontsource` packages; remove the Inter and Space Grotesk packages | Stays self-hosted, no third-party font request, matches the existing setup |
| 47 | Port order | Stages, each checked before the next: (1) tokens, fonts, base; (2) global components (nav, button, footer, chip, card); (3) pages one at a time, each compared with the mockup screenshots | A mismatch points to one stage; review in small pieces |
| 48 | Copy in the port | First release follows the mockup text as is; `src/content/` is not the reference. Content polish is a later phase | Review was about design; content is a separate phase |
| 49 | Stage 3 start | Port stage 3 (the pages) begins now; stages 1-2 are committed and the baseline is green. | Port order is checked page by page so any drift is attributable to one page. |
| 50 | Page order | home, experience, projects, project template ([slug]), build-with-me, 404, coming-soon; old-design cleanup last. | Every intermediate state stays buildable and reviewable. |
| 51 | Unfinished links | Projects cards and "Next project" link to the new `coming-soon.astro` for now; real project pages open in a new tab only when they exist in their own repos later. | Decision 16: coming-soon is a permanent fallback, so no link dead-ends. |

## Obvious fixes (decision 8, veto any)

- `scroll-margin-top` on anchored sections so the sticky header stops covering headings
- Non-breaking hyphens or `text-wrap: pretty` to stop "go-/live" style wraps
- Profile image: fallback when it fails to load (today it just hides)
- Filter chips on projects: hidden when JS is off, since they do nothing
- Confirm Escape closes the mobile menu and focus returns to the Menu button
