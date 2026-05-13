---
name: plan-creator
description: Create structured implementation plans with phased checkboxes, preview, and iterative refinement. Trigger when user mentions "plan", "planear", "crear un plan", "planeación", or similar planning requests.
---

## Workflow

1. **Investigate** — Search `docs/use-cases/` for the relevant feature file. If none exists, ask the user to describe the feature.

2. **Define phases** — Ask the user how many phases (1-4) for implementation. Recommend a number based on complexity:
   - 1 phase: trivial change (single file, no new dependencies)
   - 2 phases: small feature (new component or screen)
   - 3 phases: medium feature (new screen + DB + navigation)
   - 4 phases: large feature (multiple screens, DB, state management, testing)

3. **Draft the plan** — Create the full plan content with this structure:
   - Feature name and summary
   - Each phase with markdown checkboxes (`- [ ]`) per step
   - Brief and specific — no generic advice, no tutorials

4. **Preview & confirm** — Show the full plan to the user. Use the `question` tool to ask: create the file, modify it, or cancel.

5. **Create the file** — Write to `docs/plans/YYYY_MM_DD_nombreDeLaFeature.md` (lowercase, no spaces, use hyphens).

6. **Add ✅ on completion** — Once all phases are implemented, rename the file to `✅YYYY_MM_DD_nombreDeLaFeature.md` (prefix with ✅).

## Plan template

````markdown
# Feature: [name]

## Summary
[1-2 sentences]

## Phases

### Phase 1: [title]
- [ ] Step 1
- [ ] Step 2

### Phase 2: [title]
- [ ] Step 1
- [ ] Step 2

---

## Next step
[Initially: "Comenzar con la implementación de la Fase 1". Update as progress is made.]
````

## Rules
- Always check `docs/use-cases/` files before drafting.
- Keep plans concise — no filler, no tutorials.
- Use the `question` tool for user decisions (phase count, preview approval).
- Plans must be in Spanish for consistency.
