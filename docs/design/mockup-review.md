# Mockup design review

- **Date:** 2026-11-21
- **Scope:** design, UI, accessibility, design-system consistency. Content is not reviewed.
- **Target:** `docs/design/mockup/` (6 pages), light and dark themes
- **Method:**
  - Screenshots from `make screenshots-mockup` (132 images: 6 pages x 3 screens x 2 themes x JS on/off, plus home sections)
  - About 15 viewed by eye (desktop home light and dark, all home sections, experience, projects, project, build-with-me, 404, tablet home, mobile home light and dark)
  - Contrast computed from the CSS tokens, structure and rules read from the HTML and CSS
- **Constraint:** palette is frozen. No colour value is changed or proposed. Fixes reuse existing tokens.

## Summary

- Strong, consistent visual language: serif display plus clean sans, one blue accent, navy anchor band.
- Both themes are finished. All text passes AA contrast.
- Page structure and semantics are solid (landmarks, skip links, ARIA states).
- Main problems:
  - Sticky header covers anchored sections.
  - Mobile hero buries the headline and CTA.
  - Focus ring fails contrast on the navy band.
  - Mobile nav unreachable without JS.
  - Design system is loose: no spacing or type scale, cryptic class names.

## What works well

- Headline and body type pairing gives personality without gimmicks.
- Alternating white, grey and navy bands give clear section rhythm.
- Hero: strong headline, photo with an overlapping "Currently" card, clear primary action.
- Two-path cards on home state the audience split directly.
- Experience timeline (date column + role column) scans well.
- Dark theme is a proper design, not an inversion. Buttons flip to a lighter blue with dark text.
- Focus ring is thick (3px, offset 3px) and theme-aware.
- `prefers-reduced-motion` is respected. No scroll-reveal animations, so nothing hides with JS off.

## Priority fixes

1. Add `scroll-margin-top` to anchored sections (header covers headings).
2. Make focus ring visible on the navy contact band.
3. Rework the mobile hero order so headline and CTA sit above the fold.
4. Keep nav reachable with JS off.
5. Consolidate duplicate and inconsistently labelled CTAs.

## Design and UI findings

### High

- **Anchored sections hidden under the sticky header**
  - Seen on `home-proof`, `home-help`, `home-experience`: eyebrow clipped, heading fully covered.
  - Cause: no `scroll-margin-top` or `scroll-padding-top` anywhere in `styles.css`.
  - Fix: `section[id] { scroll-margin-top: calc(header height + 24px) }`.

### Medium

- **Mobile hero pushes headline and CTA below the fold**
  - Photo comes first (about 500px tall at 390px wide). Headline starts near y=610 of 844. CTAs are off-screen.
  - Fix: smaller or cropped photo on mobile, or headline above the photo.
- **Duplicate and inconsistent CTAs**
  - Desktop home shows "Get in touch" twice in one viewport (header and hero).
  - Build-with-me has three: header "Get in touch", hero "Start a project", band "Start a project".
  - Fix: header button secondary or removed on landing pages. Use one label per destination.
- **Inconsistent link affordance on build-with-me**
  - Right column mixes plain project names (look like links, are not) with one real link ("See: experience").
  - Fix: make all of them links or none. Style real links the same way.
- **"Three ways to start" cards have no affordance**
  - Bare rules with text, no link or action.
  - Fix: add a link or CTA per option, or state they are informational.

### Low

- **Projects grid orphan:** 7 cards leave a lone last card at both desktop (3 columns, large gap) and tablet (2 columns). Use a different column count or a featured first card.
- **Navy band blends in dark mode:** the contact and CTA band is only slightly lighter than the page (`#101d33` vs `#0a1424`), so it loses the strong anchor it has in light mode. Seen on experience, projects and build-with-me.
- **Placeholder watermark letters** on project cards are very faint in dark mode (decorative, but nearly invisible).
- **Tablet hero (768px):** single column with a 320px photo leaves the right half empty. Two columns would fit.
- **Dark mode photo:** near-white background is a bright block in the dark hero. Add a subtle border or slight dimming, no palette change.
- **Hero spacing:** availability badge sits about 20px above a very large headline, tighter than other sections. Headline is large enough to pin the location line to the fold at 800px.
- **Stats row:** vertical dividers stop short, labels sit tight to the divider ends, "0 -> live" mixes a numeral with a word.
- **Experience role line:** bold blue line mixes title and achievement, reads like a link or eyebrow, and wraps to 2 or 3 heavy lines on mobile. Split into title plus a muted impact line.
- **Hyphen wraps:** "go-/live", "AI-/written". Use non-breaking hyphens or `text-wrap: pretty`.
- **Tech chips:** the Celery mark (wide gradient bar) does not match the flat monochrome icons. Icons are also very small in the experience chips.
- **Card weight:** dark "Need something built" card out-weighs the light "Hiring" card. Confirm that matches the page priority.
- **Header on home:** no active state on any nav item (other pages have one).

## Accessibility findings (WCAG 2.1 AA)

### Summary

- **Issues:** 8
- **Major:** 2
- **Moderate:** 3
- **Minor:** 3
- **Critical:** 0

### Major

- **Focus ring fails on the navy contact band (2.4.7 / 1.4.11)**
  - Ring uses `--focus` (`#1c4fd8`) on `--navy` (`#0d1f3c`): about 2.47:1, needs 3:1.
  - Applies in light theme. Dark theme uses `#8ba9ff` and passes.
  - Derived from tokens, confirm in a browser.
  - Fix: `.contact :focus-visible { outline-color: var(--on-navy) }`.
- **Control borders below 3:1 (1.4.11)**
  - `--line` on `--bg` is 1.28:1 (light) and 1.36:1 (dark).
  - Used as the only boundary on theme toggle, menu button, filter chips and ghost buttons.
  - Text labels still identify them, so impact is moderate in practice.
  - Fix: use existing `--mute` (5.77:1 light, 6.99:1 dark) for control borders. Keep `--line` for dividers and cards.

### Moderate

- **Nav unreachable without JS (2.1.1)**
  - Below 860px links are `display:none` until JS adds `.open`. With JS off the Menu button does nothing.
  - Confirmed in the JS-off mobile screenshot: the Menu button is visible but inert.
  - Footer repeats the links, so it degrades but is not ideal.
  - Fix: keep links visible by default and hide only when JS is present.
- **Touch targets under 44px**
  - Theme toggle 42px, menu button 42px, small button 42px, filter chips 40px.
  - Strict WCAG 2.1 AA does not require 44px, but it is the common target.
- **Small text**
  - Sizes in use: 11.5px (placeholder tag), 12.5px ("Currently" label), 13px and 13.5px (tags, footer credits).
  - Not a WCAG failure by itself. Raise to a 12 to 13px floor.

### Minor

- **Filter chips** do nothing with JS off. Hide them or render a static list.
- **Check icons** in the light card are low contrast in dark mode (decorative, list text carries the meaning).
- **Profile image** hides itself on load error (`onerror`), leaving no fallback.

### Passing

- All text contrast passes in both themes (table below).
- `lang` and `viewport` on all 6 pages. Unique `<title>` on each.
- Skip link on all 6 pages.
- Landmarks present: `header`, `nav` (labelled), `main`, `footer`. One `h1` per page.
- `aria-pressed` on filter chips, `aria-expanded` plus `aria-controls` on the menu button, theme toggle label updates with state.
- Decorative SVGs are `aria-hidden`. Logos and profile photo have alt text.
- `:focus-visible` defined globally, with `prefers-reduced-motion` handled.

### Contrast check

| Pair | Light | Dark | Required | Result |
|---|---|---|---|---|
| Body text on bg | 12.82 | 11.77 | 4.5 | Pass |
| Muted text on bg | 5.77 | 6.99 | 4.5 | Pass |
| Muted text on soft bg | 5.34 | 6.39 | 4.5 | Pass |
| Blue text on bg | 6.65 | 5.53 | 4.5 | Pass |
| Blue text on soft bg | 6.14 | 5.06 | 4.5 | Pass |
| Button text on blue | 6.65 | 5.58 | 4.5 | Pass |
| White on navy band | 16.43 | n/a | 4.5 | Pass |
| Status dot on bg | 3.35 | 9.59 | 3 | Pass |
| Border (`--line`) on bg | 1.28 | 1.36 | 3 | Fail (controls only) |
| Focus ring on navy band | 2.47 | passes | 3 | Fail (light theme) |

### Not verified

- Live keyboard tab order, screen reader output, 200% zoom.
- Hover and active states.

### Mobile menu (open state)

- Checked at mobile (390px) in light and dark. Tablet (768px) was captured but not viewed.
- **Works well**
  - Clean dropdown: three links with dividers and a full-width primary button.
  - Link rows are about 50px tall, comfortable touch targets.
  - Both themes render correctly.
- **Issues**
  - The button keeps the label "Menu" when open and shows no pressed style. Only `aria-expanded` changes. Consider "Close" or a visible open state.
  - No scrim behind the panel, so the page stays fully visible and tappable around it.
  - No focus handling checked. Confirm Escape closes it (the script handles it) and that focus returns to the button.

## Design system audit

### Tokens

- **Good**
  - Colour tokens defined once in `:root` with a full dark override.
  - Semantic names: `--ink`, `--text`, `--mute`, `--line`, `--blue`, `--on-blue`, `--focus`.
  - Font tokens and a max-width token.
- **Gaps**
  - No spacing scale: about 30 distinct padding, margin and gap pixel values in use.
  - No type scale tokens: roughly 20 distinct font sizes between 13px and 40px, many one-offs.
  - Radius token (`--r`) exists, but 8px, 16px and 99px radii are hardcoded.
  - Hardcoded colours that duplicate tokens: `#fff` (8 times), `#0d1f3c` (4 times, same as `--navy` and `--ink`).
  - `#e8edf7` (2 times) is a hover colour with no token and no dark counterpart.

### Components

- **Buttons**
  - Variants: primary, ghost, small. Hover and focus are defined.
  - No disabled, active or loading states.
  - The contact band overrides the button with hardcoded colours.
- **Chips and tags:** three separate implementations (`.fchip`, `.tags span`, `.tags.kind span`) with slightly different sizes (13px, 13.5px) and padding.
- **Cards:** six card-like boxes (`.pcard`, `.path`, `.stackbox`, `.aiwork`, `.nextp`, `.now`) each with their own radius and padding. A shared card base would cut this.
- **Placeholders:** dashed "layout preview" notices and "screenshot slot" tags are mockup-only. Remember to remove them in the real build.

### Naming and structure

- Class names are terse and cryptic: `.s`, `.xp`, `.er`, `.sr`, `.rw`, `.mk`, `.tg`, `.str`, `.ed`.
- One stylesheet with page-specific blocks appended and media queries scattered at several points.
- Fine for a mockup. Port to named components when building the real site.

## Suggested next steps

1. Fix the sticky-header anchor offset and the navy-band focus ring (two small CSS changes).
2. Reorder the mobile hero.
3. Replace `--line` with `--mute` on control borders (existing token, no new colour).
4. Make nav links visible by default so they work without JS.
5. Decide the CTA pattern (one primary action per page, one label per destination).
6. Introduce spacing and type scales before porting to the real build.
7. Give the open mobile menu a visible state ("Close" label or pressed style).
8. Finish viewing the remaining screenshots (see coverage gaps).

## Coverage gaps

- Viewed by eye: about 26 of the 132 main screenshots, plus the mobile open-menu captures.
  - Every page at desktop in light, and most in dark (home, experience, projects, build-with-me).
  - Mobile: home, experience, projects, project, build-with-me. Tablet: home, projects, experience.
  - One JS-off capture (mobile home).
- Screenshot script now captures `home-menu-open` (mobile and tablet, JS on only).
- Not viewed: dark theme for project and 404, tablet for project, build-with-me and 404, mobile 404, tablet menu-open, and the remaining JS-off captures.
- Contrast and structure findings come from the CSS and HTML, not from the images.
