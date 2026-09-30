# More Design studio skin

**Status:** shipped (round 2) · **Source:** moredesign.studio (GitLab `moredesign/moredesign-studio-next-js`, pulled with `yarn design:pull`)

The app icon already speaks the studio's language. This carries the website into the app: its palette, Freizeit, the glass menu and pills. Structure follows Slack's frame (not its colors).

## Shipped

Chosen on the board: **today at a glance** in the "where you are" style, **duotone** inactive icons, **no labels**. In the app:

- Top bar (`top-bar/TopBar.tsx`): native traffic lights (`titleBarStyle: 'hidden'`), unread across the rail, the focus switch, "notifications paused", and the loading line.
- Rail (`AppDockIcon.tsx`, `NativeAppDockIcon.tsx`, `DockTopSection.tsx`): brand tile, duotone + color layers, the glow, solid counts, round buttons with the moon for focus.
- Card frame, glass popovers and palette, settings inside the card, pill buttons, lowercase labels, Freizeit (used when installed, not bundled).
- Not in the app yet: the next calendar event in the top bar (needs calendar data), and the hover highlight gliding between popover rows (the rows do slide in).

## Round 3 (after using the app)

- No unread badge on apps for now. If one comes back, it's a small blue "something new" dot; the rail buttons already use one.
- The glow is tighter (6px blur, no spread) and takes the colors of what the icon shows: the profile picture's characteristic color (sampled, weighted by saturation) or the app's own color.
- Unread in the top bar was wrong: pages of one account were added up, and any dot or "99+" turned the total into "new messages". Now it's the highest count per app, added across the rail; clicking it goes to the next app with unread (`top-bar/unread.ts`, tested in `test/jest/top-bar`).

## Round 2 changes (after review)

- **Frame like Slack:** a full-width top bar holds the native macOS traffic lights, the rail sits below it, and the web app is a rounded card with an 8px gutter.
- **Rail:** profile pictures without the tiny app icons, a small lowercase label under each icon, inactive icons in black & white, and the active app in full color with a soft light in its own color. No side strip.
- **Hidden:** search (quick switch stays on ⌘T), recents, back / forward. ⌘[ ⌘] and the three-finger swipe already navigate (`keyboard-shortcuts.ts:246`, `browser-window/main.ts:191`); add the mouse side buttons.
- **Glass:** popovers use the site's `.light-glass` exactly (gray-950 at 80%, 24px blur). Text on glass is one step lighter (gray-300 / gray-400) so it passes contrast over a white page.
- **No gradient on small things:** unread badges are solid `#F04438` counts, like Slack. The gradient only appears as light (top bar idea 4) and in the brand tile.

## Board options

| Option | Choices |
| --- | --- |
| top bar | **open pages pill**: the site's glass menu holding the app's open pages, a milk puck slides to the chosen one · **where you are**: app / account / page, with a quiet loading line instead of the 2px bar · **today at a glance**: unread count, next event, focus switch as the site's outlined pills · **wordmark + ambient light**: the gradient as a slow light behind the bar |
| inactive icons | black & white (high contrast) · duotone (midnight → milk) · 1-bit · soft grey (today's look) |
| rail labels | labels · no labels |

## Motion

Click the rail, the pages pill, toggles and the moon: the screens are live. **replay** (R) runs the entrances again, **motion** (M) turns animation off for still comparisons.

| Interaction | What happens | Timing |
| --- | --- | --- |
| Switch app | the app's light blooms around its icon, the icon pops, the page rises into place | glow 900ms ease-out · icon 420ms spring · page 420ms ease-out |
| Hover a rail icon | color comes back, icon lifts 1px | 420ms ease-out · 240ms spring |
| New message in the background | the icon bleeds into color for a moment, the red count pops with a ripple | 1600ms · 560ms spring (demo plays on the main window) |
| Tabs popover | slides 10px out of the rail through glass, rows follow one by one, a hover highlight glides between rows | 380ms ease-out · 24ms stagger · 240ms |
| Open pages pill | the milk puck slides and resizes to the chosen page | 420ms spring |
| Quick switch | drops in 10px and scales up, rows follow | 420ms ease-out · 22ms stagger |
| Focus mode (moon) | badges turn into quiet rings, the moon tilts and lights up, the bar says "notifications paused" | 240–420ms |
| Toggles, buttons | the knob stretches while travelling, buttons press to 96% | 420ms spring |

Easings: `ease-out` cubic-bezier(0.16, 1, 0.3, 1) for arrivals, `ease-spring` cubic-bezier(0.34, 1.56, 0.64, 1) for touch, `ease-in-out` cubic-bezier(0.65, 0, 0.35, 1) for moves. `prefers-reduced-motion` turns it all off.

## Token mapping

| Token | Now | Proposal | Studio name |
| --- | --- | --- | --- |
| surface.base / sidebar | `#1B1A19` / `#151413` | `#080C13` | black |
| surface.panel | `#232221` | `#1C2029` | more-gray-950 |
| surface.elevated | `#2B2A28` | `#1C1929` | midnight-elevated |
| text.primary | `#ECEAE6` | `#F8F9FA` | more-milk |
| text.secondary | `#A9A69F` | `#ACB5BD` | more-gray-650 |
| accent.default | `#D97757` | `#F8F9FA` | more-milk (primary = milk pill) |
| status.badge | `#E5625B` | `#F04438` | more-error |
| radius.md / xl | 6 / 12 | 9 / 16 | rounded-9px / rounded-2xl |
| font.sans | system | Freizeit | |

`yarn design:diff moredesign-studio` prints the complete list, plus the new tokens (glass, on-glass text, motion, layout).

## Where it lands in code

- `MainWindowManager.ts`: `titleBarStyle: 'hiddenInset'` with `trafficLightPosition` for the native lights; drop `TrafficLights.tsx` from the dock.
- `DockTopSection.tsx`: remove back / forward, search and recents; add the top bar component.
- `AppDockIcon.tsx`: label, image filter, glow; remove the side indicator and the small app icon on accounts. `NativeAppDockIcon.tsx`: round buttons.
- `App.js`, `webview.scss`: the card frame (margin, radius, `overflow: hidden` around `<webview>`).
- Webview preload: mouse buttons 4 / 5 → back / forward.

## Open questions

- **Font license:** Freizeit and DetoGrotesk are licensed for the website; a desktop app usually needs its own license.
- **Glass over web pages:** `<webview>` is composited inside the window, so the blur should work as on the board. Confirm in a build, and watch GPU cost.
- **Card corners:** confirm `overflow: hidden` + radius clips `<webview>` in Electron 43.
- **"Today" idea:** unread comes from badges; the next event would need a Calendar integration.
