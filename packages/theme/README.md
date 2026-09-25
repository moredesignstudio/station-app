# @getstation/theme

Station's design system: dark design tokens, the react-jss theme object, and the
shared UI components (Button, Input, Modal, Tooltip, Switcher, …).

It used to be published separately; it now lives in the monorepo so the app and
the app store consume it through `workspace:*`. `yarn build` compiles `lib/` to
`dist/` (the app resolves `dist/index.js`).

## Tokens

`lib/tokens.ts` is the single source of truth for colors, radii, shadows and
type. The palette is a warm charcoal in the spirit of Claude Code / Notion dark
mode: neutral surfaces, translucent-white fills for interaction states, hairline
borders and one terracotta accent reserved for primary actions and focus.

| Group     | Keys                                                        |
|-----------|-------------------------------------------------------------|
| `surface` | `base` app bg · `sidebar` dock · `panel` popovers · `elevated` modals · `inset` wells · `scrim` |
| `fill`    | `subtle` · `hover` · `active` · `selected` · `strong` (rgba white) |
| `border`  | `subtle` · `default` · `strong`                             |
| `text`    | `primary` · `secondary` · `tertiary` · `disabled` · `inverse` · `onAccent` |
| `accent`  | `default` · `hover` · `active` · `subtle` · `border` · `text` · `ramp` |
| `status`  | `success` · `warning` · `danger` · `info` · `badge` · `favorite` (+ subtle/border variants) |
| `radius`  | `xs` 3 · `sm` 4 · `md` 6 · `lg` 8 · `xl` 12 · `pill`         |
| `shadow`  | `panel` · `modal` · `tooltip` · `focus` · `focusInset`      |
| `font`    | `sans` · `mono`                                             |

Use them through the react-jss theme (`injectSheet((theme: ThemeTypes) => ({ color: theme.text.primary }))`)
or import them directly (`import { surface, fill, text } from '@getstation/theme'`).
Mixins: `theme.mixins.kbd()`, `theme.mixins.sectionLabel()`, `theme.mixins.scrollbar()`,
`theme.mixins.panel()`, `theme.mixins.focusRing()`, `theme.fontMixin(size, weight)`.

The SCSS in `packages/app/src/theme/scss/common/variables.scss` mirrors these
values; keep both in sync.

## Gradient API

The old time-of-day gradient machinery (`COLORS`, `GradientProvider`,
`withGradient`, `getGradientCSSBackground`) is kept for compatibility, but every
moment of the day resolves to the same flat surface and `withGradient(type)`
injects a flat `linear-gradient(c, c)`:

- `GradientType.normal` → `surface.base`
- `GradientType.withOverlay` → `surface.sidebar`
- `GradientType.withDarkOverlay` → `surface.panel`

## Components

`Button` (`Style.PRIMARY`/`MAIN` accent CTA, `SECONDARY` neutral, `TERTIARY`
ghost, `LINK`, `DANGER`, `OUTLINED`; `Size.XXXSMALL` … `BIG`), `ButtonIcon`,
`Input`, `SearchInput`, `SelectInput`, `Switcher`, `Tooltip`, `Hint`, `Modal`,
`ModalWrapper`, `Chooser`/`ChooserItem`, `Service`, `FloatingActionButton`,
`ButtonFeedback`, `RoundPicture`, `SlideX`, `Icon` (+ `IconSymbol`).
