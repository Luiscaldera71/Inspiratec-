# React integration and scope control

## Before changes
- Inspect the actual router and authentication boundary.
- Find the route component, global layout, overlays, and backgrounds.
- Confirm installed versions in `package.json` and the lockfile.
- Check asset paths and public URL conventions.
- Determine app start/build commands.

## Route isolation
- Render the immersive component only on the intended route.
- Keep authentication and authorization at their existing boundary.
- Do not move routes outside protected layouts without explicit requirements.
- Hide global elements using a route-scoped condition or wrapper.
- Avoid broad selectors such as `body:has(...)` when a route-scoped class can solve the issue. If retained, test that the selector cannot leak across navigation.
- Keep the exit control and test its destination.

## Animation
- Prefer an installed library if it meets the need.
- Verify Framer Motion's installed API/version rather than assuming hook signatures.
- Avoid adding a dependency for a small transform or opacity effect.
- Separate scene configuration from rendering logic where useful.
- Call hooks unconditionally and clean up subscriptions.

## Regression protection
- Inspect diffs before completion.
- Do not edit unrelated screens, Firebase flows, APIs, data schemas, or global pixel-art components unnecessarily.
- Run the production build and relevant tests.
- Browser checks count as passed only if actually observed.
- Report exact commands and results; never claim an unrun test passed.
