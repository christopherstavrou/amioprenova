# CLAUDE.md — AI Agent Instructions

**amioprenova** is a static website for jazz vocalist **Ami Oprenova**.
Stack: Astro · Tailwind CSS · TypeScript · Cloudflare Pages
Languages: English (`/en`) + Bulgarian (`/bg`) · Theme: light/dark via `data-theme` cookie

---

## Development Loop

Every task follows this cycle:

1. **Read the issue** — understand the requirement and identify affected files
2. **Read `docs/ai/progress.md`** — understand current project state
3. **Create branch** — `claude/<feature-name>` from `develop`
4. **Implement** — small focused commits, run `npm run dev` to verify as you go
5. **Verify** — `npm run build` must pass; check affected pages visually
6. **PR** — open against `develop` with clear summary and verification steps
7. **Revise** — if reviewer leaves feedback, push additional commits to the same branch
8. **Update `progress.md`** — reflect completed work and update next steps

Full process details → `docs/ai/workflow.md`

---

## Hard Rules

Violating these will break the build or block the review.

| Rule | Detail |
|------|--------|
| Branch from `develop` | Use `claude/<feature-name>` — never commit to `main` or `develop` directly |
| PR target | `develop` only — never `main` or `test` |
| Build | `npm run build` → 0 errors before every commit |
| Colors | No hardcoded hex values — use Tailwind design tokens only |
| i18n | No `lang === 'en' ?` conditionals in page files — each language has its own page |
| Dependencies | No new npm packages without explicit approval |

Implementation conventions → `docs/ai/standards.md`

---

## Documentation Index

| File | Read when |
|------|-----------|
| `docs/ai/progress.md` | Every session — current state, what's next |
| `docs/ai/workflow.md` | Process questions — branching, commits, PR format |
| `docs/ai/standards.md` | Implementation questions — naming, structure, patterns |
| `docs/ai/decisions.md` | Architecture questions — why things are built the way they are |
| `DESIGN.md` | Visual questions — colors, typography, component specs |
| `README.md` | Content/data management, commands, deployment |

---

## Repository Map

```
src/
├── components/        # Reusable UI — Button, Card, PageHeader, etc.
├── layouts/           # Layout.astro — SEO, header, nav, footer
├── pages/{en,bg}/     # One .astro file per page per language
├── content/           # Markdown — blog posts, about page
├── data/              # JSON — events.json, releases.json, videos.json
├── config/site.ts     # All external URLs and site metadata
├── i18n/ui.ts         # Short UI strings (nav labels, buttons, footer)
├── lib/               # Utility functions (events, formatting)
└── styles/global.css  # CSS custom properties and design tokens
```

---

## Quick Reference

```bash
npm run dev            # Dev server → http://localhost:4321
npm run build          # Production build (run before every commit)
npx astro check        # TypeScript type check
```

Agent working notes → `.agent/WORKING_NOTES.md` (ephemeral, not committed)
