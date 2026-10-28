# Cinematic scroll and continuity

## Choose the technique honestly
### Static-image sequence
A sticky viewport displays scene images whose opacity and transform respond to scroll progress. This can feel polished, but it remains a sequence of stills, not a continuous camera flight.

### Video scrub
A rendered video or clip chain is sought according to scroll progress. Validate codec support, seeking behavior, buffering, file size, and mobile performance.

### 3D / canvas rendering
Use only when true spatial movement is required and the project can support the implementation and performance budget.

## Scene planning
For each scene document purpose, source asset, focal point, entrance/hold/exit progress, motion, copy/action, transition relationship, mobile crop, and reduced-motion fallback. See `templates/scene-config.example.js` for an illustrative schema.

## Continuity rules
- Preload the next scene before it becomes prominent when feasible.
- Avoid intervals where all scene opacities are near zero or multiple scenes compete equally.
- Make transitions reversible and deterministic.
- Use controlled overlap rather than abrupt index changes.
- Prevent transforms from revealing empty edges or cropping the key subject.
- Synchronize progress indicators with actual scroll progress.
- Test wheel, trackpad, touch, keyboard scrolling, and reverse scrolling when available.

## Performance
- Animate `transform` and `opacity` where possible.
- Avoid React state updates on every raw scroll event if the installed library can map scroll progress directly to styles.
- Clean up listeners, observers, controls, and subscriptions.
- Lazy-load distant content but preload near-future scenes to prevent flashes.
- Measure real asset sizes.

## No-cut claim
A seamless video chain needs compatible neighboring frames and tested joins. Crossfades between unrelated still images do not guarantee spatial continuity. Describe what was implemented rather than promising effects the assets cannot produce.
