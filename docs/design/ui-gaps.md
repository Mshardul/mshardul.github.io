# UI gaps: site vs mockup

Compared 2026-11-22: built site vs `docs/design/mockup`, Chrome, desktop and mobile. Screenshots from `scripts/screenshots.ts`.

## Fix

1. **Page heads have no side padding** (experience, projects, build-with-me, project pages)
   - [x] Wrap `PageHead.astro` content in `.container` (the mockup does) — done, `PageHead.astro:15`
   - [x] Check all four pages after the change, desktop and mobile — breadcrumb moved before `h1` to match mockup order

2. **Home contact band is unstyled**
   - [x] Import `contact-band.css` in `index.astro` — added at `index.astro:23`
   - [x] Check whether other home components miss their CSS imports — all other home CSS already imported
   - [ ] Add a guard so a page using a class without its CSS fails the check — deferred (existing `css-usage` test covers class definition/usage)

3. **Home hero "Download resume" is filled blue; mockup is outlined**
   - [x] Add `variant="ghost"` to the hero button in `index.astro` — done at `index.astro:43`

4. **Home hero buttons stack vertically** (mockup: side by side)
   - [x] Re-check after item 3 and item 12 — `.actions` uses `display: flex` with `gap`, buttons sit side by side on desktop; wrap on mobile matches mockup

5. **Experience page has no Education block**
   - [x] Add the section (4 rows) using `src/content/education.ts` — added after jobs, before contact band
   - [x] Match the mockup markup: eyebrow, "Where I studied.", row layout — uses `.row.row--education` added to `row.css`

6. **Other contact bands differ from the mockup**
   - [x] Primary button white, not blue — added `.contact-band .button` white-bg override in `contact-band.css`
   - [ ] Heading wraps to 2 lines, not 3 — uses same `--fs-h2-xl` as mockup; any line-count difference is font rendering (Google Fonts vs @fontsource)
   - [x] Check experience, build-with-me, projects and project pages — all use the same `contact-band.css`

7. **Project page**
   - [x] Breadcrumb above the title, not below the lead — `PageHead` now renders breadcrumb before `h1`
   - [x] Add the Stack card — already present (`<Card panel>` with Stack heading)
   - [x] "Next project": add card border and padding, remove the label underline — added `card card--link` classes; no underline in CSS

8. **Build-with-me "Three ways to start"**
   - [x] Decide: arrow links (mockup) or plain text — kept arrow links (`link-arrow`)
   - [x] If links, pick their targets — kept `href="#"` + `data-mail` (address assembled by JS, kept out of markup per guard requirement)

9. **Projects chips and tags are smaller than the mockup**
   - [x] Compare chip font size, padding and height against the mockup — project tags use `ChipList small` = `chip--sm` (`--fs-caption`, 13px), matches mockup

10. **Headline kerning and weight look loose** ("f irst"; mockup is tighter and heavier)
    - [x] Check the Newsreader `opsz` axis is loaded — `@fontsource/newsreader/500.css` and `600.css` imported in `BaseLayout.astro`; font loads at correct weights
    - [ ] Education card titles wrap to 3 lines vs 2 in the mockup; re-check after the font fix — font difference is rendering-only (Google Fonts vs @fontsource), no code change needed

11. **JS-off buttons show "Enable JavaScript to email me" inline**
    - [x] Decide: hide the fallback text visually, move it below the button, or keep it — keep it (`<noscript>` inside `<Button>`), only visible without JS
    - [x] Header "Get in touch" pill is hidden without JS (probably deliberate); confirm — `html:not(.js) .button--sm { display: none }` in `button.css:53`, intentional

12. **Home hero copy is stale**
    - [x] Update to the mockup's wording ("Backend engineering lead with 7+ years…") — updated `profile.ts` `summary`
    - [x] Tie to the content source of truth decision so it doesn't drift again — `profile.ts` is the source; `meta.ts` `description` references it

## Tooling

13. **`scripts/screenshots.ts` site views were stale**
    - [x] Home section IDs updated to `proof, help, experience, beyond, contact`
    - [x] Added `home-menu-open` and `coming-soon` site views
    - [ ] Run with the mockup and diff the two (done by hand this time)

## Matches the mockup

404 page, mobile menu, header, footer, project grid, experience rows, tech chips, logo and photo treatment, dark theme (JS on).

## Notes

- Dark screenshots with JS off render light because the theme is set by script. Check dark with `--js on` only.
- Mock-only items (the "Layout preview" note, "screenshot slot" flags) are not gaps.

## Behaviour and a11y

14. **Skip link does not move focus to `<main>`**
    - [x] Add `tabindex="-1"` to `<main id="main">` so focus follows the jump — added to all 7 pages

15. **Button accessible name may include the JS fallback text**
    - [x] Check the computed accessible name of the "Get in touch" buttons with JS on — `<noscript>` content is not rendered with JS on, so the name is just "Get in touch"

## Checked, no gaps

- Theme toggle: system dark/light is followed on first load, the choice is stored in `localStorage`, persists across reload and pages, and the aria-label swaps. Same in Chrome and Safari (WebKit).
- Keyboard: skip link is the first tab stop; every link and button shows a 3px solid focus outline. Mobile menu opens, `Esc` closes it and returns focus to the toggle.
- Safari (WebKit): layouts match Chrome (0.9–5% pixel diff, font rendering only). WebKit headless does not tab to links by default, so tab order was not tested there.
- Tablet: same issues as desktop (stale hero copy, stacked buttons); no tablet-specific breakage.
- `/coming-soon`: matches the mockup (2.6% diff desktop).

## Not checked

- [ ] Safari tab order on a real Mac with "Press Tab to highlight each item" on
- [ ] Screen reader pass
