# inspiratec-immersive-design

A reusable skill for design-led, scroll-driven web experiences.

## Contents
- `SKILL.md`: workflow, scope boundaries, implementation strategy.
- `references/design-system.md`: visual hierarchy and art direction.
- `references/cinematic-scroll.md`: image transitions, video scrub, and continuity.
- `references/react-integration.md`: safe React integration.
- `references/quality-checklist.md`: verification checklist.
- `templates/scene-config.example.js`: illustrative scene data.

## Install into an Antigravity workspace
1. Copy this folder into the workspace's supported skills directory, commonly `.agents/skills/` when enabled by that environment.
2. Confirm `SKILL.md` and all references are present.
3. Reload the IDE/session if the agent does not discover the skill.
4. Ask the agent to list discovered skills and explicitly use this skill for a small read-only audit.
5. Do not claim activation until the agent confirms discovery.

Skill-discovery conventions can vary by Antigravity version. Verify the active environment rather than assuming a folder path guarantees activation.

## Provenance
This is an original set of workflow instructions informed by public concepts in:
- https://github.com/elayadesign/ai-design-skills
- https://github.com/oso95/scroll-world

It does not bundle code from either repository. Consult each source repository's license before copying code or templates. The example scene configuration is original.

## Safety
No provider keys, generated media, external provider scripts, or npm dependencies are included.
