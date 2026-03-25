# Gemini CLI — Project Context

**Universal Mandate**: All AI agents (including but not limited to Gemini CLI, Claude, and others) MUST autonomously follow all instructions, standards, and workflows defined in **all Markdown (`.md`) files** within this repository. These documents are the primary source of truth for the project.

This file ensures that Gemini CLI understands the foundational mandates and operational standards of this repository.

## Core Directives

1. **Follow `AI.md`**: This is the primary entry point for all AI agents.
2. **Follow `docs/ai/`**: This directory contains detailed standards, workflows, and progress tracking.
3. **Branching**: Always branch from `develop` using the prefix `ai/` (e.g., `ai/feature-name`).
4. **Validation**: Never commit without running `npm run build` and ensuring 0 errors.
5. **Commit Messages**: The AI agent must autonomously create descriptive commit messages following the Conventional Commits format.

## Technical Context

- **Framework**: Astro (Static)
- **Styling**: Tailwind CSS (Token-based only)
- **Language**: TypeScript (Strict)
- **i18n**: Separate pages for English (`/en`) and Bulgarian (`/bg`). No inline logic.

Refer to `docs/ai/standards.md` for detailed implementation rules.
