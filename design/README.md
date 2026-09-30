# Design review flow

Visual changes to more mail are proposed and reviewed as live HTML screens
first. App code changes only after a proposal has been approved.

```
pull source styling → propose → preview → adjust ⟲ → check → approve → ship → verify in the app
```

## Quick start

```bash
yarn design          # review board on http://localhost:4477
```

In the Claude desktop app, the `design` entry in `.claude/launch.json` opens
the same board in the browser pane, so you and Claude look at the same screens.

## The board

Each screen in `manifest.json` renders live twice: once with the current
tokens, once with the selected proposal. Hover states and scrolling work,
because the screens are real HTML.

| Key | Action |
| --- | --- |
| `C` | Flip between current and proposal (A/B in place) |
| `S` | Side by side |
| `W` | Web content light / dark (what Gmail etc. look like inside the window) |
| `T` | Tweak panel: edit any token live, then **Save** writes `tweaks.css` into the proposal |
| `K` | Contrast checks (current vs proposal) |
| `N` | The proposal's notes: rationale, token mapping, open questions |
| `R` | Replay every screen's animations (each screen also has its own replay) |
| `M` | Motion on / off, for still comparisons |
| `Esc` | Back to all screens after focusing one (click a screen title) |

Proposals can offer **options** (listed in `manifest.json`), shown as dropdowns in
the toolbar: they set `data-<option>` on the screens, so one proposal can carry
several ideas side by side.

The **open 1:1** link on each screen opens it alone at real size, also with
live reload.

## Folder layout

```
design/
  manifest.json           screens and proposals the board shows
  tokens/current.css      GENERATED from packages/theme/lib/tokens.ts (yarn design:tokens)
  shared/app.css          the app's UI rebuilt with tokens only (the screens' styles)
  shared/frame.js         loads current or proposal styles into a screen
  screens/*.html          mock screens: main window, quick switch, settings, …
  proposals/<id>/
    fonts.css             @font-face for fonts the proposal adds
    tokens.css            overrides of tokens/current.css, plus any new tokens
    components.css        structural changes to shared/app.css rules, motion
    structure.js          markup changes + interactions (can be empty)
    tweaks.css            written by the board's Save button
    notes.md              why, token → code mapping, open questions
  scripts/pull-studio.sh  pulls studio styling from GitLab or the VPS
  scripts/tokens.mjs      generate / check / diff
  .studio/                pulled styling and fonts (gitignored)
```

## 1. Pull source styling

When a proposal borrows from another codebase (the studio website), pull its
styling instead of copying values by hand:

```bash
yarn design:pull         # GitLab: moredesign/moredesign-studio-next-js (source of truth)
yarn design:pull vps     # the production checkout on MoredesignVPS (~/web/frontend)
```

This copies the Tailwind config, the global CSS, the base components and the
Freizeit / DetoGrotesk fonts into `design/.studio/`. That folder is gitignored:
the fonts are licensed to the studio and this repository is public.

## 2. Propose

A proposal is a folder in `proposals/` plus an entry in `manifest.json`. It
never touches `shared/app.css` or the app code: it only overrides tokens and,
where the structure changes, component rules. So the board can always compare
it with the current app.

## 3–4. Preview and adjust

Change the proposal in chat ("dock a touch lighter", "badges back to red"),
and the board reloads by itself. Or open the tweak panel, adjust tokens
yourself and **Save**. Claude folds `tweaks.css` into `tokens.css` when the
proposal settles.

## 5. Check

```bash
yarn design:check        # current.css up to date? variables.scss in sync with tokens.ts?
                         # contrast pairs for current and every proposal
yarn design:diff <id>    # exactly which tokens.ts values the proposal changes, and what it adds
```

## 6. Ship

Only after the proposal is approved on the board:

1. Apply `yarn design:diff <id>` to `packages/theme/lib/tokens.ts` and its SCSS
   mirror `packages/app/src/theme/scss/common/variables.scss`.
2. Port `components.css` into the components by hand (notes.md lists where).
3. `yarn design:tokens`: `current.css` now matches the proposal. The
   board's current and proposal views should look the same.
4. `yarn design:check`, `yarn build`, lint.
5. Build and install the app, then compare it with the board screen by screen.
6. Set the proposal's status in `manifest.json` to `shipped`.

## Keeping the screens honest

`shared/app.css` mirrors the real UI (dimensions and states from the
components, colors only via tokens). When a PR changes the app's structure
(new dock button, new settings layout), update the matching screen in the
same PR, so the board keeps showing the real app.
