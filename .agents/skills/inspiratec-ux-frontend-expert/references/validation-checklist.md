# UX/UI validation checklist

## Visual hierarchy
- [ ] One clear primary task/action.
- [ ] Consistent roles for headings, sections, labels, and helper text.
- [ ] No redundant nested cards.
- [ ] Spacing follows the shared scale.
- [ ] Active, hover, focus, disabled, error, success, and loading states differ clearly.

## Layout and scroll
- [ ] Header and content dimensions fit the viewport.
- [ ] Long pages reach the true bottom.
- [ ] No borders, shadows, or buttons protrude.
- [ ] No unintended horizontal overflow.
- [ ] Sidebar scroll does not unexpectedly move the page.
- [ ] Sticky/fixed elements do not cover content/focus.
- [ ] Dialogs and menus layer correctly.

## Forms
- [ ] Visible labels and correct helper/error associations.
- [ ] Required/optional status is clear.
- [ ] Validation and submission behavior preserved.
- [ ] Primary action remains reachable.
- [ ] Long labels/errors do not break layout.

## Responsive/accessibility
- [ ] Mobile, tablet, desktop, and zoomed text checked where possible.
- [ ] Keyboard navigation and focus work.
- [ ] Contrast remains readable over animated backgrounds.
- [ ] Touch targets are usable.
- [ ] Reduced motion is respected.
- [ ] Essential actions are not hover-only.

## Regression
- [ ] Routes and access controls intact.
- [ ] Existing data, handlers, validation, and state preserved.
- [ ] Auth/data/AI behavior not unintentionally changed.
- [ ] Build passes.
- [ ] Rendered screenshots inspected for representative routes.
- [ ] Report distinguishes source inspection, build, and actual browser testing.
