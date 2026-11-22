# Mockup CSS inventory and proposed role table

Source: `docs/design/mockup/styles.css` (310 lines) and the six HTML pages. Decisions: [mockup-review-decisions.md](mockup-review-decisions.md) (29, 30, 31). **Status: role table approved (decisions 38-40). No CSS edited yet; restructure not started.**

## 1. Today vs proposed

| Property | Distinct values today | Proposed roles |
|----------|----------------------|----------------|
| Font size | 33 (24 fixed, 9 fluid) | 5 text + 6 heading/display |
| Spacing (padding, margin, gap) | 27 fixed px values (2px to 48px) + 9 fluid | 7-step scale + 3 fluid roles |
| Radius | 8 | 4 + focus |
| Control and button height | 6 | 3 |
| Breakpoints | 10 (`260` and `130` are not breakpoints) | 3 |
| Border widths | 4 | 4 (named) |
| Hardcoded colours outside `:root` | 15 declarations | 0 (tokens, same values) |
| Inline `style=` attributes | 6 | 0 |

## 2. Font-size roles (decision 22: 13px floor)

Rule: every element uses one of these. Nothing else.

| Role token | Value | Replaces (examples) |
|------------|-------|---------------------|
| `--fs-caption` | 13px | 11.5 (mock-only note), 12.5 (hero card small), 13, 13.5 (tags, credits) |
| `--fs-meta` | 14px | 14, 14.5, 15 (eyebrow, crumbs, counts, dates, chips, small buttons, nav links, footer) |
| `--fs-text-sm` | 16px | 15.5, 16, 16.5 (card text, list items, role line, stat captions) |
| `--fs-text` | 17px | 17, 17.5 (body, row text, mobile nav links, footer name) |
| `--fs-lead` | 19px | 18, 19, 20 (lead paragraphs, strengths heading, contact text) |
| `--fs-h4` | clamp(19px, 2vw, 24px) | row titles: education, card titles (24), brand (20), trust names (20) |
| `--fs-h3` | clamp(22px, 2.6vw, 32px) | job, step, aiwork, story, build-with-me, next-project, path-card headings (21-34) |
| `--fs-h2` | clamp(30px, 3.8vw, 46px) | section headings |
| `--fs-h2-xl` | clamp(34px, 4.2vw, 52px) | contact band heading |
| `--fs-stat` | clamp(40px, 4.6vw, 60px) | stat numbers |
| `--fs-h1` | clamp(38px, 5.4vw, 66px) | hero and page-head headings (66 and 64 merge) |
| `--fs-h1-xl` | clamp(44px, 7vw, 92px) | 404 only |

- Mock-only placeholders (`.mono` 56px, `.ph b` 72px) are dropped from the port. They exist only for the mockup.
- Sub-heading size inside the hero (`clamp(18px,1.7vw,21px)`) uses `--fs-lead`.
- **Visible effect:** most text moves by 0.5-1px. 11.5px and 12.5px rise to 13px.

## 3. Line height and tracking roles

| Role | Value | Replaces |
|------|-------|----------|
| `--lh-display` | 1.1 | 1.03, 1.06, 1.1, 1.12, 1.15 (display and h1-h3) |
| `--lh-heading` | 1.25 | 1.2, 1.25 (small headings, row titles) |
| `--lh-text` | 1.55 | 1.45, 1.55 (lead, compact text) |
| `--lh-body` | 1.65 | body (unchanged) |
| `--track-heading` | -0.015em | -.01, -.015, -.02 (headings) |
| `--track-display` | -0.03em | -.03 (stat numbers and monograms) |

## 4. Spacing roles

Scale (the only spacing numbers allowed):

| Token | Value |
|-------|-------|
| `--sp-1` | 4px |
| `--sp-2` | 8px |
| `--sp-3` | 12px |
| `--sp-4` | 16px |
| `--sp-5` | 24px |
| `--sp-6` | 32px |
| `--sp-7` | 48px |

Roles, which map to the scale and are what classes use:

| Role | Value | Used for (replaces) |
|------|-------|---------------------|
| `--gap-inline` | `--sp-2` | icon to label, chip row, filter row, tag row (7, 8, 10) |
| `--gap-stack` | `--sp-3` | eyebrow to heading, list items, button group, label to title (10, 12, 14) |
| `--gap-text` | `--sp-4` | heading to lead, paragraph groups, card inner content (16, 18, 20, 22) |
| `--gap-block` | `--sp-5` | grid and card gaps, hero heading margins, media top (22-28, 30) |
| `--gap-content` | `--sp-6` | title block to content, sub-sections, action rows (32-36) |
| `--gap-region` | `--sp-7` | section heading to its content (40-48) |
| `--pad-control-x` | `--sp-4` (chips, small buttons), `--sp-5` (button), `--sp-6` (large button) | horizontal control padding (14, 16, 18, 24, 30) |
| `--pad-card` | `--sp-5` (compact card), `--sp-6` (feature card) | card insets (22, 24, 26, 28, 32) |
| `--pad-row` | `--sp-6` (default), `--sp-5` (compact) | job, story, build-with-me, education rows (16, 20, 28, 30) |
| `--pad-section` | clamp(40px, 5vw, 64px) | section vertical padding (unchanged) |
| `--pad-hero` | clamp(40px, 6vw, 72px) | hero vertical padding |
| `--pad-pagehead` | clamp(48px, 7vw, 88px) | page head vertical padding |
| `--pad-band` | clamp(48px, 6vw, 80px) | contact band vertical padding |
| `--pad-card-feature` | clamp(28px, 3.4vw, 44px) | hiring and project cards |
| `--gutter` | `--sp-5` | page side padding (28 becomes 24) |

- Micro nudges (2, 3, 4, 5, 6, 9px) become `--sp-1` or are removed.
- **Visible effect:** most spacing moves by 1-4px. The page keeps the same structure.

## 5. Radius, borders and shape roles

| Role | Value | Replaces |
|------|-------|----------|
| `--radius-control` | 8px | buttons, menu button, theme toggle, notes (6, 8) |
| `--radius-card` | 14px | cards, frames, bands, the hero card (12, 14, 16) |
| `--radius-pill` | 99px | chips, tags, availability badge |
| `--radius-circle` | 50% | dots, step markers, avatar |
| `--radius-focus` | 4px | focus ring (unchanged) |
| `--bw-hair` | 1px | dividers, card borders |
| `--bw-control` | 1.5px | buttons, chips, toggles |
| `--bw-rule` | 2px | strong section rules, timeline |
| `--bw-focus` | 3px | focus ring (unchanged) |

## 6. Control size roles (decision 23)

| Role | Value | Replaces |
|------|-------|----------|
| `--control-h` | 40px desktop, 44px when `pointer: coarse` | small button (42), menu button (42), theme toggle (42), filter chip (40) |
| `--button-h` | 48px | primary button |
| `--button-h-lg` | 56px | contact-band button |
| `--icon-sm` | 16px | icons in tags (15) |
| `--icon-md` | 18px | line icons |
| `--icon-lg` | 24px | next-project arrow |
| `--logo-h` | 34px | stack logos, 28px company marks fold into this with their own width cap |

## 7. Breakpoints

CSS cannot use custom properties inside `@media`, so these are three literal values used everywhere and listed once in the file header.

| Name | Value | Replaces |
|------|-------|----------|
| `phone` | 560px | 520, 560, 620 |
| `tablet` | 760px | 720, 760, 860, 900 (decision 37: hero switches here) |
| `desktop-narrow` | 980px | 980 |

- **Check needed before approving:** nav links and stats currently collapse at 860px. At 760px the five nav links plus the CTA must still fit. I will verify with screenshots at 761-860px during the restructure and report back, not decide silently.

## 8. Other roles

| Role | Value | Replaces |
|------|-------|----------|
| `--measure-heading` | 20ch | heading width caps (unchanged) |
| `--measure-narrow` | 34ch | stat captions, step text (24ch, 34ch) |
| `--measure-text` | 60ch | body and lead blocks (46, 50, 54, 56, 62, 64) |
| `--duration` | 0.15s | transitions (0.15s, 0.2s) |
| `--shadow-pop` | one shadow, ink-tinted | hero card, mobile menu (14px/40px, 18px/30px) |
| `--shadow-hover` | blue-tinted shadow | project card hover |

## 9. Hardcoded colours moved to tokens (decision 35: same values, no shifts)

| New token | Value | Used by |
|-----------|-------|---------|
| `--btn-on-dark-bg` | `#fff` | white button on navy surfaces (two places) |
| `--btn-on-dark-fg` | `#0d1f3c` | text of that button |
| `--btn-on-dark-hover` | `#e8edf7` | its hover |
| `--ghost-on-dark-border` | rgba(255,255,255,.4) | ghost button on navy |
| `--check-on-dark-bg` | rgba(255,255,255,.14) | tick circle on navy card |
| `--shadow-ink` / `--shadow-blue` | rgba(13,31,60,.28) / rgba(28,79,216,.35) | the two shadow tokens above |

- The tick icon in `.path li::before` bakes colours (`#1c4fd8`, `white`) into a data-URI image, so it cannot follow tokens. Proposed technical fix: draw it with a mask and `currentColor`, so it follows the theme with no new colour.
- Dark-theme `--navy` change (decision 21/24) is applied here as the one palette edit.

## 10. Inline styles to remove

| Where | Inline value | Becomes |
|-------|--------------|---------|
| project.html, projects.html (section) | `padding-top:36px` | `.section--tight` (role `--pad-section-tight`) |
| index.html #help section | `padding-top:0` | `.section--flush-top` |
| experience.html jobs list | `margin-top:0` | `.jobs--flush` |
| index.html tags row | `margin-top:12px` | `--gap-stack` on the tag group |
| index.html photo placeholder note | `font-size:12.5px` | removed (mock-only placeholder) |

## 11. Class naming (decision 34) and component bases

| Today | Becomes |
|-------|---------|
| `.s`, `.wrap`, `.nav`, `.l` | `.section`, `.container`, `.site-header`, `.nav-link` |
| `.btn`, `.btn.ghost`, `.btn.sm` | `.button`, `.button--ghost`, `.button--sm` |
| `.path`, `.path.alt`, `.pcard`, `.nextp`, `.stackbox`, `.aiwork` | `.card` with `--feature`, `--outlined`, `--link`, `--panel` |
| `.tags span`, `.fchip`, `.avail` | `.chip`, `.chip--filter`, `.chip--status` (decision 32) |
| `.er`, `.ed`, `.rw`, `.sr`, `.job` | `.row` with `--education`, `--build`, `--story`, `--job` |
| `.xp`, `.stk`, `.str`, `.stats`, `.phases`, `.step` | `.section--soft`, `.stack-list`, `.strengths`, `.stats`, `.timeline`, `.timeline__step` |

A full old-to-new rename list is produced at restructure time.

## 13. Stage 1 result (restructure done, decision changes not yet applied)

Files: `docs/design/mockup/tokens.css` (new), `styles.css` (rewritten, 310 to about 200 lines), six HTML pages (classes renamed, 6 inline styles removed). Baseline screenshots: `.screenshots/20261122-014938-mockup`; stage 1: `.screenshots/20261122-015901-mockup`.

Deviations from the table above (decide or veto):

- **`--fs-h3` split in two.** One merged size made job titles jump from 26px to 32px on desktop. Added `--fs-h3-lg` (24-34px) for card, build-row and next-project titles. Heading roles: 13, not 12.
- **Extra spacing roles** needed once the code was written: `--pad-cell` (stat and education cells), `--pad-pagehead-end`, `--pad-fullpage` (404), `--pad-section-tight`, `--gap-split` (hero columns), `--header-h`.
- **`--logo-h` dropped.** Nothing in the mockup uses a 34px logo (the old stack-logo grid was dead CSS).
- **Dead CSS removed:** phases/step timeline, strength cards `.stack6`, `.aiwork`, `.beyond`, compact education, an old `footer` rule shadowed by `.sitefoot`.
- **Tick icon on the cards** still bakes colours into a data-URI image. The mask and `currentColor` fix is left for stage 2.
- **Navy is unchanged** (`#101d33` in dark) until stage 2 applies decision 21/24.

Shifts to review:

- **Tablet (768px) now shows the desktop layout:** full nav links instead of the menu button, two-column hero, build and story rows in columns. Nav fits (checked in the 768px screenshot). Per decisions 37 and 39.
- Page height changes at 1280px: experience +45px, 404 -36px, project -43px, projects -40px, build-with-me -3px.
- Page height changes at 390px: project -70px, build-with-me -35px, projects +20px, experience -18px.
- Hero sub-text and contact-band text width cap went from 46-56ch to 60ch, so some lines wrap differently.
- Stage 2 will list the "orphan word" wraps (for example "it." alone on a line) under `text-wrap: pretty`.

## 14. Stage 2 result (decision changes applied to the mockup)

Applied: 3, 5, 6, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21/24, 27, 28, 36, and the obvious fixes (decision 8) except the tick-icon mask. Decisions 25 and 26 needed no change. Checked with Playwright: menu label and `aria-expanded` sync, Escape closes the menu and returns focus, filter chips work, filter bar hidden with JS off, nav visible with JS off, no horizontal overflow at 360, 390, 768 and 1280px, no failed local assets.

Interpretations to confirm:

- **Labels (decisions 7, 43), settled:** every email button reads "Get in touch" with the mail icon (the two card buttons and the build-with-me buttons changed). "Start a project" stays only where it goes to the build-with-me page.
- **Project cards, "Next project" and build-with-me project names** all go to `coming-soon.html` (decision 12). `project.html` (the template) has no link to it and opens directly.
- **Celery icon (decision 42), settled:** the Simple Icons Celery mark, replacing the traced one. The traced file and manifest entry in `src/assets/tech-icons/` still need updating at port time; footer credit no longer mentions a traced mark.
- **`project.html` (decision 44):** stays as the template; project pages live in their own repos and will open in a new tab. Cards go to "Coming soon" for now.
- **Hero note** ("Currently...") is hidden on phones; the role stays in the sub-text.
- **Hero headline** max size is 60px for all `h1` (page heads were 64px), so hero and page heads stay on one role.
- **Profile image fallback:** the placeholder behind the photo already is the fallback; no change.

Not done: tick icon on the feature cards still bakes colours into a data-URI image (mask and `currentColor` fix). No non-breaking hyphens; `text-wrap: pretty` is used instead.

Bug fixed during review: the home "Tools I ship with" chips were unstyled after the rename (the list had an inline style that the rename script skipped).

## 15. Port log (to `src/`, decisions 46-48)

**Stage 1 done:** fonts and tokens.

- `package.json`: added `@fontsource/newsreader` and `@fontsource/public-sans` (exact `5.1.0`); removed `@fontsource/inter` and `@fontsource/space-grotesk`.
- `BaseLayout.astro`: imports Newsreader 500/600 and Public Sans 400-700.
- `src/styles/tokens.css`: the mockup tokens plus component dimensions. The previous design's tokens stay in a marked "legacy" block; removed in stage 3.
- Result: `npm run guard` (same 32 non-blocking warnings), `npm run check` and `npm run build` pass.

**Stage 2 done:** global components.

- New components: `Button`, `Icon`, `ChipList`, `SiteHeader`, `SiteFooter`. `SkipLink` restyled. `Cta` and `TagList` thin bridges until stage 3.
- New CSS: `button.css`, `chip.css`, `icon.css`, `site-header.css`, `site-footer.css`, `skip-link.css`; `base.css` rewritten; `.container` added to `helpers.css`.
- Removed: `Nav`, `Footer`, `ThemeToggle`, `tag.css`.
- Celery icon is the Simple Icons mark (decision 42).
- Bug fixed: `astro:page-load` / `astro:after-swap` listeners moved from `window` to `document`; theme toggle binds idempotently; `init()` adds the `js` class.
- Checks: guard (32 warnings), check (0 errors), test (46 pass), build.

**Stage 3 done:** the pages, then the old-design cleanup.

Pages ported from the mockup (decision 48: mockup text as is; `src/content` is not the reference):
- `src/pages/index.astro` — hero (avatar + chip--status badge on phones, decision 3), logo-strip, stats, skills chips, feature cards (heavy + plain), experience rows, education strip (`edu-strip`), outside-work chips, contact band.
- `src/pages/experience.astro` — page-head, job rows (`row--job` with tech chips), contact band.
- `src/pages/projects/index.astro` — page-head, filter bar (`chip--filter`, hidden without JS), project grid (`card--link card--project` → coming-soon, decision 51), result count, contact band.
- `src/pages/projects/[slug].astro` — page-head with breadcrumb (decision with crumb), story rows (`row--story`), next-project card → coming-soon (decision 51), contact band.
- `src/pages/build-with-me.astro` — page-head, build rows (`row--build` → coming-soon / experience), three "ways to start" arrow links (`link-arrow`, decisions 11/15), contact band.
- `src/pages/404.astro` — `.not-found` (Go home / See projects).
- `src/pages/coming-soon.astro` (new) — `.not-found` (See projects / Go home), permanent fallback per decision 16.

New CSS: `card.css` (`--feature`, `--heavy`, `--panel`, `--link`, `--project`), `row.css` (`--job`, `--story`, `--build`), `stats.css` (`.stats`, `.edu-strip`, `.strengths`, `.outside-work`), `hero.css`, `contact-band.css`, `pagehead.css` (`.page-head`, `.breadcrumb`, `.next-project`, `.not-found`), `section.css` (`.section`, `.eyebrow`, `.lead`, `.actions`, `.logo-strip`), `chip.css` (added `.chip--status`, `.chip--filter`, `.chip-list--tight`, `.filter-bar`). New token `--tick-mask` (mask + `currentColor`, no baked colours, fixes the css-hygiene data-URI issue). On-dark button/focus rules added to `.card--heavy` and `.contact-band`. Card grid last row centred (decision 14). Role line in two lines (decision 19). Hiring card heavy, "Need something built" outlined (decision 28).

Old design deleted after confirming nothing references it: legacy token block in `tokens.css`, `typography.css`, `helpers.css` stripped to `.container`, `bio.css`, `blob.css`, `skills.css`, `contact.css`, `fact-grid.css`, `band.css`, `timeline.css`, `scope.css`, `project-card.css`, `project-detail.css`, `service.css`, `stack.css`; components `FactGrid`, `Band`, `Cta`, `TagList`, `TimelineRole`, `ProjectCard`, `Section`; `tests/stack.test.ts` and `src/lib/stack.ts`; reveal/stack-offset code in `init.ts`.

Checks at completion: `npm run guard` — 0 failures, 29 expected placeholder warnings (28 from `src/content/projects.ts` placeholder copy, 1 from the mockup `placeholder` class in the hero — both expected per decision 48 / guard note); `npm run check` — 0 errors; `npm test` — 46 pass; `npm run build` — 13 pages.

Screenshots: `make screenshots` (built site) and `make screenshots-mockup` taken for home, experience, projects, build-with-me, not-found (+coming-soon on the mockup) at desktop/mobile, light/dark, JS off. Pixel comparison shows overlapping-region differences of roughly 2-21% across views, with page heights differing — attributable to decision-48 content differences and font rendering (mockup uses Google Fonts; the port uses pinned @fontsource). No failed local assets; no horizontal overflow.

## 12. What happens on approval

- New file `docs/design/mockup/tokens.css` (colours as today plus the roles above), and `styles.css` rewritten to use only role classes and tokens.
- Mockup re-screenshotted (`make screenshots-mockup`) and compared against today's build for unintended shifts.
- Obvious fixes (decision 8) and decisions 3-37 are applied in the same pass.
- The Astro port reuses `tokens.css` and the class list.
