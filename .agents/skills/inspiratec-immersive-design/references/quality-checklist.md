# Quality checklist

## Design
- [ ] Each scene has a clear narrative purpose.
- [ ] Typography, spacing, colors, and motion are consistent.
- [ ] Focal points remain visible at common viewport sizes.
- [ ] Text remains readable over imagery.
- [ ] Result feels intentional rather than like a basic slideshow.

## Interaction
- [ ] Scroll progress controls the experience as described.
- [ ] Forward and reverse scrolling work.
- [ ] No blank gaps, flicker, unexpected jumps, or trapped scroll.
- [ ] Progress indicator matches the current scene.
- [ ] Exit/navigation action works.
- [ ] Keyboard and touch remain usable.

## Accessibility
- [ ] Reduced-motion preference provides a coherent alternative.
- [ ] Meaningful images have appropriate alt text.
- [ ] Contrast and focus states are adequate.
- [ ] Essential information is not conveyed only through imagery or motion.

## Performance and responsiveness
- [ ] Images resolve from correct paths; no 404s.
- [ ] Nearby scenes preload appropriately.
- [ ] Mobile crops and layout are checked.
- [ ] No unnecessary dependencies or heavy work on every scroll tick.
- [ ] Listeners and observers are cleaned up.

## Regression and evidence
- [ ] Build command was run and result recorded.
- [ ] Browser checks are marked passed only if actually observed.
- [ ] Authentication and non-target routes remain unchanged.
- [ ] Global styles do not leak into unrelated routes.
- [ ] Changed files and limitations are reported.
