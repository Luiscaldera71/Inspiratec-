# Fields, forms, and reusable components

## Field contract
Every field needs a visible label, appropriate input type, clear focus state, relevant helper text, required/optional indication, inline validation, and disabled/read-only treatment where applicable. Associate labels, errors, and helper text correctly. Prefer native semantic controls unless a custom interaction is genuinely required.

## Button hierarchy
- Primary: one dominant action for the current task.
- Secondary: useful alternative.
- Tertiary: low-emphasis utility/navigation.
- Destructive: distinct and confirmed when appropriate.
Provide visible hover, focus, active, loading, and disabled states. Do not style every button as primary.

## Tables and lists
Preserve sorting, filtering, row actions, permissions, empty/loading/error states, keyboard access, and responsive behavior. Do not remove columns/actions just to fit a screenshot.

## Dialogs
Use a clear title, predictable close/cancel actions, correct focus entry/return, bounded viewport, internal scroll only when needed, and layering above navigation. Explain destructive consequences.

## Shared component contracts
Before refactoring, identify props, events, state ownership, refs, validation, side effects, and call sites. Preserve compatibility or update all call sites intentionally.
