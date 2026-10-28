# Design systems and glass surfaces

## Semantic token roles
Map existing tokens before creating new ones. Suggested roles: brand, active brand, accent, page, surface, elevated surface, dark glass, light glass, text, muted text, text-on-dark, border, focus, success, warning, danger; spacing; typography; radii; shadows; content widths; control heights; motion; and z-index.

## Spacing
A practical scale may use 4, 8, 12, 16, 20, 24, 32, 40, 48 px. Adapt to the product. Keep label-to-field and field-to-helper gaps close, field gaps consistent, section gaps larger, and page gutters stable. Avoid random one-off margins.

## Glassmorphism
- Dark glass for navigation over bright/busy environments.
- Light glass for work surfaces requiring dark text.
- More opaque surfaces for form fields.
- Fine borders and restrained shadows.
- Backdrop blur only when useful and performant.
- Local scrims behind critical text over busy imagery.
- Different opacity levels for different layers.
- Never set `opacity` on an entire panel containing text and controls.
- Provide a readable fallback if blur is unsupported or too expensive.
- Avoid excessive glow, heavy borders, and nested glass panels around every element.

## Typography
Define roles for page title, section heading, body, label, helper, metadata, and button. Use appropriate line-height and readable line lengths. Use size, weight, spacing, and placement together.

## Layer hierarchy
Use as few layers as possible: ambient background, navigation, main work surface, local controls, popovers/dialogs/toasts. Do not add a glass panel around every existing element.
