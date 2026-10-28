# Design system and art direction

## Start from the existing brand
1. Inspect CSS variables, theme files, fonts, components, and real screens.
2. Reuse existing colors, typography, spacing, radii, shadows, and button patterns.
3. Introduce new tokens only when necessary; scope them to the experience where possible.
4. Never silently restyle the full application during a route-specific task.

## Composition
- One primary visual idea per scene.
- Maintain hierarchy: scene first, supporting copy second, action third.
- Use overlays to support contrast, not to darken every image by default.
- Keep subjects inside safe areas; check `object-position` on desktop and mobile.
- Prefer live HTML text over text baked into images when accessibility and responsiveness matter.

## Type and copy
- Use a short headline, optional concise supporting line, and one clear action where appropriate.
- Respect existing brand fonts and type scale.
- Set readable line lengths and responsive sizes; do not rely on text shadow alone for contrast.
- Keep copy accurate and avoid unsupported promises.

## Motion language
- Use one consistent movement vocabulary across scenes.
- Prefer restrained scale and pan; large scale changes expose cropping and image-quality limits.
- Keep transitions long enough to read but short enough to preserve momentum.
- Avoid competing movement and animation that distracts from the message.

## Accessibility
- Preserve keyboard focus visibility and semantic headings.
- Use descriptive alt text for meaningful images and empty alt text for decorative layers.
- Honor `prefers-reduced-motion` with a coherent non-motion path.
- Do not communicate progress by color alone.
