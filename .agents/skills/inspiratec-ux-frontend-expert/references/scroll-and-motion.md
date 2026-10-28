# Scroll, geometry, layers, and motion

## Choose the scroll owner
Decide between document scrolling, main-content scrolling beneath a fixed shell, independently scrolling navigation, or bounded editor/modal scrolling. Avoid accidental nested scrollbars.

## Height arithmetic
A common defect is `100vh + header + margins + padding > viewport`. Prefer content-driven height. For viewport-bound shells, define one clear height contract. Use `100dvh` only when needed and with appropriate fallback. Check long forms, zoom, short viewports, and mobile browser chrome.

## Debug overflow
1. Inspect computed dimensions.
2. Find the first ancestor exceeding its containing block.
3. Check margin collapse, padding, border-box, min-width, grid/flex intrinsic sizing, and fixed widths.
4. Check sticky/fixed offsets.
5. Check nested scroll owners.
6. Fix the responsible geometry.
7. Clip overflow only when intentional.

Do not hide unexplained overflow globally.

## Stacking
Document z-index layers. Background below content; navigation above background; popovers above triggers; dialogs above ordinary navigation; toasts at the intended top layer. Avoid arbitrary huge z-index values. Decorative layers must not intercept clicks.

## Scroll-driven motion
Use only when it communicates progress, reveals content, or supports intentional storytelling. Keep it stable, reversible, performant (prefer transforms/opacity), resilient to late assets, and compatible with reduced motion. Avoid scroll hijacking and motion that hides essential information.
