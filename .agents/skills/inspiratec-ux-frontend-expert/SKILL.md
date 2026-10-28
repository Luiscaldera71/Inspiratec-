---
name: inspiratec-ux-frontend-expert
description: Expert workflow for auditing, reorganizing, redesigning, implementing, and validating the complete UX/UI frontend of an existing product without breaking business logic. Use for information architecture, design systems, navigation, forms, tables, dashboards, scroll behavior, immersive layouts, glassmorphism, responsive design, accessibility, and visual QA.
---

# INSPIRATEC UX/UI & Frontend Engineering Expert

## Mission
Transform an existing application into a coherent, usable, accessible, maintainable interface by combining UX analysis, information architecture, visual design systems, frontend engineering, interaction design, scroll/layout expertise, and rendered validation.

This skill is for existing applications first. Understand the product and workflows before changing presentation. Never replace real screens with mockups, invent data, or remove working functionality.

## Non-negotiable rules
1. Preserve routes, authentication, permissions, data models, API calls, validation, state, persistence, business rules, and workflows by default.
2. Inspect the repository, route map, shared layouts, tokens, components, and representative screens before broad changes.
3. Design information architecture, not only visual skin. Organize around user tasks, priority, frequency, relationships, and decision order.
4. Build or extend shared tokens and reusable components; do not create a different visual language for every route.
5. Use real labels, long text, actual data states, errors, empty states, and realistic field counts when designing.
6. Rendered evidence is required. Build success alone does not prove visual quality or functional correctness.
7. Never claim tests passed unless they were actually run.
8. Reuse the project's stack. Do not install packages, alter package manifests, add providers, or create media pipelines without authorization.
9. Translate visual references into reusable rules while preserving product identity and real information architecture.
10. Prefer scoped, reversible changes over risky global CSS rewrites.

## INSPIRATEC project constraints
Verify these details in the current repository before relying on them:
- The stack has included React 19, Vite, React Router v7, Zustand, Framer Motion, Firebase Auth, and Firestore.
- Preserve Firebase Auth, private-route protections, roles, redirects, persistence, AI workflows, and existing routes.
- Preserve `FondoPixel` and its original ambient animation where used. The `/animacion` immersive experience is separate; do not globally disable either system.
- Known paths to verify: `src/App.jsx`, `src/index.css`, `src/components/FondoPixel.jsx`, `src/components/RecorridoInmersivo.jsx`, `src/components/RecorridoInmersivo.css`, `public/scroll-images/`.
- A known token has been `--primary-active: #315B54`. Confirm it still exists and is semantically appropriate.
- Preferred direction: premium educational workspace; petroleum green/teal; warm light glass surfaces; restrained borders/shadows; readable forms; visible ambient background; compact navigation and deliberate spacing.
- Do not invent modules, external sign-in options, fake content, or features absent from the product.

## Workflow

### 1. Audit before editing
Map app entry points, routes, layouts, global styles, tokens, shared components, auth gates, and feature components. Inventory each route's task, data source, key actions, and layout. Inspect global selectors, `!important`, `:has()`, fixed heights, overflow, z-index, and CSS conflicts. Identify behavior-bearing code and risks. Read `references/audit-and-migration.md`.

### 2. UX and information architecture
For each screen, define the primary task, next action, primary/secondary/destructive actions, field groups, information priority, and relevant empty/loading/error/success/disabled/permission/long-content states. Remove redundant containers, not useful content or controls. Choose lists, tables, tabs, accordions, and dialogs based on the task and amount of content. Read `references/information-architecture.md`.

### 3. Design system
Extend existing semantic tokens before styling many routes. Define roles for colors, spacing, typography, radii, borders, elevation, content widths, controls, motion, and z-index. Reuse brand tokens when appropriate. Avoid arbitrary one-off values. Glassmorphism is a surface treatment, not information architecture: use different opacity levels for navigation, work surfaces, and fields. Never apply `opacity` to a parent containing text and controls. Keep contrast readable against moving backgrounds. Read `references/design-system-and-glass.md`.

### 4. Layout, fields, and components
Use the smallest reusable system that covers actual needs. Keep visible labels, associated helper/error text, clear focus, consistent spacing, and reachable primary actions. Avoid wrapping every group in a card. Preserve table scanning, sorting, filtering, row actions, responsive behavior, and accessible names. Dialogs need correct focus, close behavior, scrolling, and stacking. Avoid absolute positioning for ordinary layout. Read `references/forms-and-components.md`.

### 5. Scroll, motion, and stacking
Choose deliberately which region scrolls: document, main content, sidebar, or bounded panel. Avoid accidental nested scrollbars. Account for actual header height; do not add `100vh`, header height, margins, and padding blindly. Prefer content-driven height. Check long forms, zoom, short viewport heights, and mobile browser chrome. Define z-index layers. Decorative layers must not intercept input. Use scroll motion only when it supports orientation/storytelling; keep it reversible, performant, and compatible with `prefers-reduced-motion`. Never hide unexplained overflow. Read `references/scroll-and-motion.md`.

### 6. Responsive and accessible behavior
Design for available content width. Check representative widths (e.g. 320, 390, 768, 1024, 1440 CSS px) when possible. Check horizontal overflow, visible actions, form reflow, table behavior, modal bounds, focus, keyboard, zoom, target sizes, semantic labels, contrast, and reduced motion. Aim for WCAG 2.2 AA where practical; do not claim formal conformance without an audit.

### 7. Incremental implementation
Establish tokens; implement shared shell/navigation; migrate one representative screen; validate; refine shared components; migrate remaining routes in small groups. Review diffs for accidental removal of handlers, state, fields, conditions, or route logic. Do not refactor auth, routing, schemas, or AI services for styling convenience.

### 8. Rendered validation
Run the project's build command. Use an authorized browser to inspect actual rendering, route families, interaction states, top/bottom scroll, clipping, overlaps, nested scroll traps, hidden actions, text over busy backgrounds, and z-index. Test core actions without bypassing authentication. Report exactly which routes, sizes, states, and actions were checked. If auth blocks browser access, do not disable guards or pretend visual QA passed.

## Deliverables for large redesigns
- Route/component inventory.
- Design token map.
- Mapping from screens to shared components.
- Files changed and why.
- Build result.
- Routes and viewport sizes actually inspected.
- Core actions actually tested.
- Remaining defects and limitations.
- Screenshots where available.

## Approval gate
A screen is not done merely because it looks attractive in one screenshot. It must be understandable, consistent, usable with real content, responsive, accessible to a reasonable baseline, functionally connected to existing workflows, and rendered/verified when browser access is available. If conditions are not met, identify the gap and continue fixing it.
