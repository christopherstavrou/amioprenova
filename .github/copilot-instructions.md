# Copilot Instructions — amioprenova

Astro 6 · TypeScript · Tailwind CSS · Content Collections · i18n (EN + BG).

**Docs:** `AGENTS.md` (entry + index) → `docs/ai/standards.md` (hard standards + conventions) → `docs/ai/workflow.md` (PR process) → `docs/brand.md` (brand identity) → `docs/component-library.md` (UI inventory).
Deep per-file rules: `.github/instructions/astro.instructions.md` · `.github/instructions/typescript.instructions.md`.

---

## Code review focus

- When a bug pattern appears in a changed file, check whether the same pattern exists in sibling locale files (`en/` ↔ `bg/`) not included in the diff — flag those explicitly even if they are not part of the PR.
- Prefer concrete, actionable comments with a one-line fix example over general observations.
- Before starting work on an issue, check that no draft or open PR already addresses it — a draft PR is the signal that another agent has it in flight.
- Always target `develop` as the base branch. Flag any PR targeting `main` in the review.
