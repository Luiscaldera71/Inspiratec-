# Repository audit and safe migration

## Route inventory
For each route, record:
- Route, access level, and role requirements.
- Main user task and initial state.
- Data source and key actions.
- Main regions and existing components.
- Behavior-bearing components and presentation-only components.
- Existing design tokens.
- UX, responsive, scroll, and accessibility issues.
- Risk and validation plan.

## Safe migration
1. Read the route and component implementation.
2. Identify behavior-bearing code: hooks, handlers, state, API calls, data transforms, permissions, schemas, and navigation.
3. Identify presentation code: wrappers, classes, CSS, icon placement, typography, surfaces, spacing.
4. Prefer presentation changes first.
5. If JSX structure changes, preserve props, events, refs, keys, conditions, and semantic relationships.
6. Make the smallest cohesive change.
7. Inspect diffs for accidentally removed handlers, state, fields, or conditions.
8. Run build and targeted tests.
9. Inspect rendered output before propagating patterns.

## Risk
- Low: scoped token/spacing adjustment.
- Medium: shared component markup or responsive change.
- High: global CSS, routing, auth, data ownership, state, or behavior-bearing refactor.

High-risk changes need a clear reason, explicit scope, and regression checks.

## CSS traps
Inspect global `body`, `main`, `section`, `form`, `button`, `input`; `!important`; route-sensitive `:has()`; fixed heights; global `overflow: hidden`; broad z-index; parent opacity; inherited low-contrast colors; duplicate selectors.

A route is migrated only after rendered review, core action checks, long-content checks, and consistency with shared tokens. Build success alone is insufficient.
