# Design decisions

Design rules that hold today, with the reason for each. All were applied to the mockup (`docs/design/mockup/`) and ported to the Astro site. IDs are kept from the original review so references like "decision 12" still resolve; finished process steps (review scope, restructure and port staging, page order) were removed, so IDs have gaps.

| ID | Topic | Decision | Why |
|----|-------|----------|-----|
| 3 | Mobile hero | Small round avatar beside the badge; headline and CTA above the fold | Identity stays, CTA no longer pushed below the fold |
| 4 | Repeated CTAs | Keep the filled header button on every page, unify labels | Sticky header CTA is the only action visible on long pages; the defect is inconsistent labels |
| 5 | Focus ring on navy band | White ring (`--on-navy`) on dark surfaces, scoped to dark bands | Any future dark surface gets a visible ring automatically; no new colour |
| 6 | Control borders | Separate control-border role set to `--mute`; dividers and cards stay faint | Retune controls without touching dividers; meets 3:1 with an existing colour |
| 7 | CTA label | "Get in touch" everywhere | One neutral label fits both hiring and project enquiries |
| 9 | Mobile nav without JS | Links work from plain HTML and CSS; JS only handles open and close. Look and behaviour with JS on stay the same | Nav survives script failure; menu logic stays in `site.js` |
| 10 | Build-with-me project names | Keep the rows as is; names link to a "Coming soon" page until projects are integrated | Projects are not integrated yet |
| 11 | "Ways to start" | Add a link on each of the three, with a subject line per engagement type | Visitor can act at the moment of interest |
| 12 | "Coming soon" page | One shared page, linked from build-with-me and from the project cards | Every unfinished link behaves the same; swap each to its real page later |
| 14 | Projects grid last row | Centre the last row for now. Revisit in the later "projects" phase | Individual project pages are still being created |
| 15 | "Ways to start" links | The engagement title is the link, with an arrow (for example "One-off project →"), subject line per type | No repeated label; matches the "See: experience →" pattern |
| 16 | "Coming soon" page | Build it and keep it permanently as the fallback for every unfinished project and any future upcoming page. Must match the site: both themes, header, footer, same styles | A new card or link never leads to a dead end |
| 17 | Mobile menu open state | Button label switches "Menu" / "Close", `aria-expanded` kept in sync | Text states the action without relying on colour |
| 18 | Stats row | Top rule per cell, no vertical dividers (same pattern as "ways to start" and education) | One pattern across sections; collapses cleanly to 2 columns on mobile |
| 19 | Experience role line | Two lines: title in heading colour, impact in a lighter regular line below | Separates fact from claim; blue stays for links and labels |
| 21, 24 | Dark navy | Dark-theme `--navy` changes from `#101d33` to `#1a2f57`. It paints the contact band and the "Need something built" card. Owner-approved exception to the frozen palette | Band stands out (1.40 vs page); all text AA; ghost border 3.4:1 |
| 22 | Minimum text size | 13px floor. A fixed set of font-size tokens in the CSS; every element uses one of them, no other sizes | Readable floor set once; no stray sizes |
| 23 | Touch targets | Control-height role: 44px on touch devices (`pointer: coarse`), 40px on desktop | Full finger target on phones, compact on desktop; one token with one override |
| 25 | Profile photo in dark mode | Leave untouched; the thin border stays | A filter is tuned to one photo; the photo is identity and should look the same in both themes |
| 26 | Active state on home | None; the logo is the home link | Convention; keeps the nav working without JS (decision 9) |
| 27 | Desktop hero | Slightly smaller max headline size and a larger gap between badge and headline | Hero must fit common laptop heights whatever the headline length |
| 28 | "Two ways" card weight | Hiring card is the heavy (navy) card; "Need something built" becomes the outlined card | Visual weight matches reading order and the hero message |
| 29, 30 | Spacing, type and other sizes | Role-based tokens and classes: each value belongs to a category of use (for example section gap, paragraph gap, header padding), one set of values per category. No per-element or inline values | Uniform across the site; far fewer distinct values; the port reuses the classes |
| 32 | Chips | One chip component with two variants: static tag and interactive filter | One size, radius and focus style; filter adds only hover and selected |
| 33 | Cards | One `.card` base (border, radius, padding) with modifiers (outlined, heavy, link) | A card change happens in one place |
| 34 | Class names | Descriptive role-based names (`.section`, `.button`, `.card--outlined`) | Readable for later work |
| 35 | Hardcoded colours | Every colour lives in the token file; palette stays frozen | One place to read and audit colours |
| 36 | Button states | Disabled and active states on the button component, using existing colours | Contact flow will likely need disabled; defined once with the component |
| 37 | Tablet hero | Phone layout up to about 760px, then the desktop two-column layout | No third layout to maintain |
| 38 | Role table | Spacing, type and other sizes snap to a small set of role values in `src/styles/tokens.css` | A small value set keeps the site uniform as it grows |
| 39 | Breakpoints | Three: 560, 760, 980. Literal values in `@media` (custom properties cannot be used there) | Fewer layouts to test |
| 40 | Page gutter | 24px, on the spacing scale | Common phone gutter; scale stays at 7 values, no exceptions |
| 42 | Celery chip icon | The Simple Icons Celery mark (flat, single colour, same set as the other chip icons) | The icon exists in the set already; no hand-made mark to maintain |
| 43 | Button labels | One label per kind of action; the label names the action. Every contact (email) button reads "Get in touch" and uses the mail icon; the subject line still differs by context. Buttons that go to a page keep a label naming that page. Labels must not drift between pages for the same action | Labels do not wander |
| 44 | Project pages | Each project's own page lives in its own repo; the site will open it in a new tab. `project.html` stays as the template. Cards go to "Coming soon" until each page exists (decision 12) | Template untouched; links swap to the real pages later |
| 46 | Fonts | Self-host Newsreader and Public Sans through pinned `@fontsource` packages | Stays self-hosted, no third-party font request |
| 48 | Copy source | Page copy lives in `src/content/*.ts` (changed 2026-11-22; the port first hard-coded the mockup text). Home shows glimpses of each role (`highlights`); the experience page shows the full detail (`bullets` plus optional `context`, `challenges`, `outcomes`, `links`) | One source so home and experience cannot drift; home is the landing page so it keeps every role |
| 51 | Unfinished links | Projects cards and "Next project" link to `coming-soon.astro` for now; real project pages open in a new tab only when they exist in their own repos later | Decision 16: coming-soon is a permanent fallback, so no link dead-ends |
| 52 | Theme | Light and dark are both required. Default follows the system setting, with a manual toggle that remembers the choice | Respects the visitor's setting and keeps their override |
| 53 | Motion | Polished with motion: scroll animations, page transitions, hover effects. No heavy interactive demos or 3D. Reduced-motion is always respected | Feels crafted without costing performance or accessibility |
| 54 | Phone layout | Single column. The nav collapses to the theme toggle and a Menu button | One layout to maintain on small screens |
| 55 | Timeline gaps | No gap marker. Each role shows its own date range as text | Gaps are not drawn or explained; the dates speak for themselves |
