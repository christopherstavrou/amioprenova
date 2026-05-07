# AGENTS.md — AI Agent Instructions

**Universal Mandate**: All AI agents (including but not limited to Claude, Gemini, Cursor, and others) follow the standards and workflows in this file and the documents it indexes. These docs are the operating manual for automated and semi-automated work on this project.

**amioprenova** is a static website for jazz vocalist **Ami Oprenova**.
Stack: Astro 6 · Tailwind CSS · TypeScript · Cloudflare Pages
Languages: English (`/en`) + Bulgarian (`/bg`) · Theme: light/dark via `data-theme` cookie

---

## Documentation index

The docs are organised by audience and volatility. Read the file that matches what you need.

| File | Read when |
|---|---|
| [`docs/ai/progress.md`](./docs/ai/progress.md) | Every session — current state, what's next |
| [`docs/ai/standards.md`](./docs/ai/standards.md) | Implementation questions — hard standards, conventions, patterns |
| [`docs/ai/workflow.md`](./docs/ai/workflow.md) | Process questions — branching, commits, PRs, review |
| [`docs/ai/decisions.md`](./docs/ai/decisions.md) | Architecture questions — why things are built this way |
| [`docs/ai/tech-debt.md`](./docs/ai/tech-debt.md) | Spotting a deferred refactor or pre-existing gap during a PR |
| [`docs/ai/event-enrichment.md`](./docs/ai/event-enrichment.md) | Working on events / show entries / scraper output |
| [`docs/ai/github-integration.md`](./docs/ai/github-integration.md) | GitHub Actions / Claude / Copilot setup and triggering |
| [`docs/brand.md`](./docs/brand.md) | Brand identity — palette concept, voice, photography |
| [`docs/component-library.md`](./docs/component-library.md) | What components exist; when to use each |
| [`README.md`](./README.md) | Content management, commands, deployment |

Source-of-truth files (read the code directly, not a doc about it):

- **Design tokens** — top of [`src/styles/global.css`](./src/styles/global.css)
- **Component specs** — frontmatter docstring of each [`src/components/*.astro`](./src/components/)
- **External URLs and config** — [`src/config/site.ts`](./src/config/site.ts)
- **UI strings** — [`src/i18n/ui.ts`](./src/i18n/ui.ts)

---

## Hard standards (the short list)

The full enforceable standard list is in [`docs/ai/standards.md`](./docs/ai/standards.md) §1. The non-negotiables in one paragraph:

`npm run build` must pass with zero errors. No hardcoded hex/rgba/duration values — use design tokens. No `lang === 'en' ?…` ternaries in pages — EN and BG pages are sibling files with matching structure. No `dark:` Tailwind variants — dark mode is `data-theme` on `<html>`. No `innerHTML` with user-controlled data. Every non-submit `<button>` has `type="button"`. Icon-only buttons have `aria-label` from the i18n dictionary. Never duplicate something the [component library](./docs/component-library.md) already covers — extend it instead.

Beyond that, exercise judgement. The conventions in `standards.md` §2 are defaults to follow when there's no reason not to.

---

## Repository map

```
src/
├── components/        # Reusable UI — see docs/component-library.md
├── layouts/           # Layout.astro — SEO, header, nav, footer
├── pages/{en,bg}/     # One .astro file per page per language
├── content/           # Markdown blog + page entries; JSON show entries
├── data/              # JSON — releases, videos, cake-and-jazz
├── config/site.ts     # External URLs and site metadata
├── i18n/ui.ts         # Short UI strings (nav labels, buttons, footer)
├── lib/               # Utilities (events, schemas)
├── scripts/           # Client-side scripts (inline-video, list-search)
└── styles/global.css  # Design tokens and base styles
```

---

## Copilot mirror files

GitHub Copilot reads its own instruction files (see [`docs/ai/github-integration.md`](./docs/ai/github-integration.md)). Keep them in sync when the hard standards change:

| File | Scope |
|---|---|
| [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | Repo-wide rules read on every PR review (≤ 4,000 chars) |
| [`.github/instructions/astro.instructions.md`](./.github/instructions/astro.instructions.md) | Deep guidance for `*.astro` files |
| [`.github/instructions/typescript.instructions.md`](./.github/instructions/typescript.instructions.md) | TypeScript rules for `*.ts` files |

---

## Quick reference

```bash
npm run dev            # Dev server → http://localhost:4321
npm run build          # Production build (run before every commit)
npx astro check        # TypeScript type check
```
