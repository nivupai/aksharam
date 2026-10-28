# Mobile and copy refinement verification

## Implemented

- Removed dashboard hero slogans, decorative header/sidebar/footer text, greeting copy, and poetic headings/feedback. Kept the app name, pronunciation and orthographic facts, progress labels, errors, and study instructions.
- Dashboard: study actions and due reviews precede secondary statistics. Collections remain a responsive grid.
- Flashcards: both 3D card faces occupy one grid cell and determine a shared content height. Long notes can expand the card without clipping or changing height when flipped. Audio is next to navigation; review buttons use two columns on small phones and four from 430px. Glyphs use responsive sizing and a 1.8 line height.
- Added touch swipes with a 60px horizontal threshold and horizontal-to-vertical ratio of 1.5. Vertical/diagonal scroll gestures, multitouch, cancellation, native taps, keyboard controls, and pinch zoom remain available. CSS uses `touch-action: pan-y pinch-zoom`; handlers never call `preventDefault` on touch events.
- Learn/test: short headings, full-width answers below 600px, growing question/feedback panels, wrapped result rows, and accessible retry actions.
- Reference: adaptive letter grids, 16px search input, wrapping 44px filters, a labeled native dialog with viewport-constrained scrolling, and full-width mobile dialog actions.
- Settings: single-column mobile forms with 16px selects and 44px actions. Existing browser-native import/reset confirmations remain unchanged.
- Six bottom navigation links have labels, current-page state, minimum touch areas, safe-area padding, and matching content clearance. Desktop retains the sidebar from 1024px. Inputs and selects use at least 16px to avoid Safari focus zoom. No horizontal-overflow hiding is used to conceal layout defects.
- Reduced-motion rules, visible keyboard focus, standard zoom behavior, and a landscape rule remain enabled.

## Automated verification

- 27 tests pass, including swipe directions, suppressing swipe-generated clicks, vertical/diagonal/short gestures, multitouch, cancellation, Space activation, exposed card faces, six mobile navigation destinations, current Settings state, storage remount, scheduling, scoring and Unicode data.
- Lint, strict TypeScript checking, production static export, and `npm run check:export` pass. The export check validates the viewport meta tag, six direct routes and navigation targets, static assets and client navigation payloads under `/aksharam/`, `.nojekyll`, and absence of SPA fallbacks.
- The five prohibited phrases were searched case-insensitively throughout `src`; no matches remain. A broader audit removed other slogans and decorative copy.
- Alphabet entries, stable IDs, scheduling, persistence key, scoring, Next.js export configuration, and Pages workflows are unchanged. Dataset file changes are limited to collection descriptions displayed in the UI.

## Browser verification limits

Chrome is available as a native application, but no connected DOM browser surface was available. Preview automation timed out; a retry was interrupted by changes in the user's active Chrome window. No mobile screenshots or viewport measurements were obtained. The changes have **not** been visually verified on iPhone Safari or Android Chrome. Browser tests are not replaced by the DOM interaction tests above.

## Manual device/viewport matrix

Run `npm run build && npm start`, then open `http://localhost:3000/aksharam/`. The server serves real exported files without a Next runtime.

Check portrait widths **320, 375, 390, 430, 768, and 1280px**, plus a phone landscape viewport such as **667×375**. Repeat representative phone checks on iPhone Safari and Android Chrome.

For each viewport:

1. Open each of the six routes directly and refresh it. Confirm no horizontal scrolling, cut-off labels, glyphs, or page content under bottom navigation.
2. Check Overview: study actions and due-card count appear before statistics and the collection grid fits the screen.
3. On Flashcards, flip the longest note, enable uncommon forms, and inspect consonants, dependent signs, and conjuncts. Swipe horizontally and vertically. Verify a swipe changes one card and does not flip it; vertical scrolling and pinch zoom still work.
4. Tap every study control, bookmark a letter, rate it, and refresh. Verify progress persists. Use Space, arrows, and 1–4 with the keyboard.
5. Complete a lesson/test with a wrong answer, inspect feedback and results, and retry misses. Ensure full-width phone answers and result buttons remain visible while scrolling.
6. Search and clear Reference, use filters, open letter details, scroll the dialog, close it with its button and Escape, and confirm focus returns to the selected entry.
7. Focus search/typing inputs on Safari and confirm no automatic page zoom. Open native selects and Settings confirmation dialogs; cancel destructive actions during verification.
8. Rotate a phone, reveal/hide browser chrome, enable reduced motion, and test VoiceOver/TalkBack focus order and card pronunciation descriptions.

## Changed files

- `src/app/globals.css`: consolidated responsive rules and retained the existing palette/component classes.
- `src/app/layout.tsx`: functional metadata and zoom-preserving safe-area viewport.
- `src/app/page.tsx`: compact dashboard with study actions before statistics.
- `src/app/flashcards/page.tsx`, `src/app/reference/page.tsx`, `src/app/settings/page.tsx`: functional copy, reference dialog label, search and form layouts.
- `src/components/shell.tsx`, `src/components/ui.tsx`: navigation, removed decorative frame content, optional page subtitles.
- `src/components/card.tsx`, `src/components/flashcards.tsx`: fluid card faces, swipes, audio placement and study instructions.
- `src/components/practice.tsx`, `src/components/quiz-question.tsx`, `src/components/results.tsx`: functional lesson/test setup, feedback and results copy.
- `src/components/audio-button.tsx`, `src/components/deck-selector.tsx`: availability and selector labels.
- `src/data/alphabet.ts`: category descriptions only; letter entries unchanged.
- `tests/interactions.test.tsx`, `tests/mobile-interactions.test.tsx`: updated label assertions and mobile interaction coverage.
- `scripts/check-export.mjs`: viewport and pinch-zoom export checks.
- `README.md`, `docs/MOBILE_REVIEW.md`: current test count and manual verification guidance.
