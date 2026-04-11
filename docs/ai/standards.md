# Implementation Standards

This document defines how code is written and structured in this repository.
It is the practical operating manual for implementation — covering conventions,
guardrails, and quality rules for both human contributors and AI agents.

**Read alongside:**
- `docs/ai/workflow.md` — branching, commits, and PR process
- `docs/ai/decisions.md` — why major architectural choices were made
- `DESIGN.md` — visual design system (colors, typography, components)

---

## 1. File Size and Splitting Rules

**Guideline**: Source files should be under 200 lines.
**Threshold**: Files over 300 lines are candidates for splitting.
**Hard limit for AI**: If a single task produces more than 100 lines of diff in one file, stop and consider whether the work should be two separate PRs.

When to split a file:
- A page file contains a section that is repeated across multiple pages → extract to a component
- A layout file has distinct, self-contained regions (header, footer, mobile menu) → extract to components
- A utility file has grown to contain functions across unrelated domains → split by domain

Do not split purely to reduce line count. Split when it improves readability or enables reuse.

---

## 2. Component Conventions

All reusable UI lives in `src/components/`. Follow this structure in every component:

```astro
---
/**
 * ComponentName — one-sentence description of its purpose
 * Reference: DESIGN.md §Section (if applicable)
 */

export interface Props {
  // Required props first, then optional props
  requiredProp: string;
  optionalProp?: 'value-a' | 'value-b';
  class?: string; // Always allow className forwarding
}

const { requiredProp, optionalProp = 'value-a', class: className = '' } = Astro.props;

// Compute derived values here (class strings, variant lookups)
const variantClasses = {
  'value-a': 'some-classes',
  'value-b': 'other-classes',
};
const classes = `${variantClasses[optionalProp]} ${className}`;
---

<!-- Template -->
```

Rules:
- Always define `export interface Props` — even for simple components
- Always accept and forward a `class?: string` prop to support per-use customization
- Compute class strings in the frontmatter using lookup objects, not inline ternaries in the template
- Do not accept layout-level props (margin, padding) — let the caller handle spacing
- **If a component renders user-visible text (button labels, aria-labels, status messages) and is used on both EN and BG pages, add a `labels` prop with English defaults.** BG caller pages must pass Bulgarian strings. If the component's JS updates text at runtime (e.g. `span.textContent = 'Copied!'`), carry the label as a `data-*` attribute on the relevant element so the JS can read the locale-appropriate string without hardcoding it.

**When to create a new component:**
- The same HTML structure (more than ~3 lines) appears in 2 or more places → extract it
- A named, self-contained section of a page grows past ~40 lines → candidate for extraction

**When NOT to create a new component:**
- The structure appears only once and is simple → leave it inline in the page
- The proposed component needs more props than the template has lines → the abstraction is not worth it

---

## 3. Page and Layout Conventions

**Pages** (`src/pages/{en,bg}/*.astro`):
- Must import and use `Layout.astro` as the outermost wrapper
- Must pass `title`, `description`, and `lang` props to `Layout`
- Title format: `"Page Name - amioprenova"`
- Description: 150–160 characters
- Content is in the target language — no language conditionals in page files
- Data loading (JSON imports, utility calls) belongs in the frontmatter, not the template
- **EN and BG pages are structurally identical** — the same conditional guards, the same sections, the same component props. If you change the structure of an EN page (add/remove a conditional block), update the BG sibling in the same commit.

**Layouts** (`src/layouts/`):
- Handle SEO, document structure, global navigation, and footer
- Do not contain page-specific content
- Changes to `Layout.astro` affect every page — test multiple pages after any change

**Separation rule**: If logic is needed on more than one page, it belongs in `src/lib/`. If UI is needed on more than one page, it belongs in `src/components/`. Pages should be thin orchestration layers.

---

## 4. Import Conventions

Order imports in this sequence, with a blank line between each group:

```astro
---
// 1. Framework / Astro builtins
import { getCollection } from 'astro:content';

// 2. Layouts
import Layout from '../../layouts/Layout.astro';

// 3. Components
import Button from '../../components/Button.astro';
import Card from '../../components/Card.astro';

// 4. Library utilities
import { getNextEvents, formatEventDate } from '../../lib/events';

// 5. Data files (JSON)
import releases from '../../data/releases.json';

// 6. Config and i18n
import { siteConfig } from '../../config/site';
---
```

Use relative paths. Do not use path aliases unless they are already configured in `tsconfig.json`.

---

## 5. Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Component files | PascalCase | `SectionHeader.astro` |
| Page files | kebab-case | `about.astro`, `blog.astro` |
| Utility files | camelCase | `events.ts`, `formatDate.ts` |
| CSS custom properties | `--kebab-case` | `--text-primary`, `--accent-primary` |
| Tailwind custom tokens | `kebab-case` | `text-text-primary`, `bg-accent-primary` |
| Data files | kebab-case | `events.json`, `releases.json` |
| Git branches | `ai/kebab-case` | `ai/fix-mobile-nav` |
| Commit scopes | kebab-case matching file scope | `feat(blog):`, `fix(nav):` |

Name components after what they *are*, not what they do. `SectionHeader` not `RenderSectionTitle`.

---

## 6. Styling Conventions

**Absolute rules:**
- Never use hardcoded hex color values in `.astro` or `.ts` files
- All colors must use CSS custom property tokens via Tailwind (e.g., `text-text-primary`, `bg-accent-primary`)
- Never use inline `style` attributes for colors or theme-sensitive values
- Never use Tailwind's default color palette (e.g., `text-red-500`, `bg-gray-100`) — use design system tokens only

**Class construction:**
- Build class strings in the frontmatter, not in template expressions
- Use lookup objects for variant classes (see `Button.astro` as the pattern)
- Avoid long ternaries in the template — extract to a named variable

**Responsive design:**
- Mobile-first: base styles apply to mobile, `md:` and `lg:` override for larger screens
- Tablet breakpoint (`md:`): 768px; Desktop (`lg:`): 1024px

**Dark mode:**
- Do not write `dark:` Tailwind variants in component or page files
- Dark mode is handled entirely by CSS custom properties and the `data-theme` attribute on `<html>`
- If a color doesn't adapt correctly in dark mode, fix the CSS variable definition, not the template

---

## 7. Patterns to Prefer

- **Check `src/components/` first** before writing any new markup — use an existing component if it fits
- **Use `siteConfig`** for all external URLs — never hardcode a URL in a page or component
- **Use `src/lib/` utilities** for any logic used in 2 or more places (date formatting, event filtering, etc.)
- **Use `src/i18n/ui.ts`** for short, repeated UI labels (nav items, button text, footer copy)
- **Inline SVGs** only for icons that need theme-sensitive coloring via `currentColor`
- **Conditional rendering** with `&&` for optional sections (e.g., `{event.ticketUrl && <Button>}`)
- **Astro Content Collections** for long-form content that may be updated independently of code

---

## 8. Patterns to Avoid

- **Inline translation logic** — no `lang === 'en' ? 'Shows' : 'Концерти'` in templates; each language has its own page file
- **Hardcoded colors in style attributes** — no `style="background: #8B1C3B"` in `.astro` files
- **Duplicate SVG markup** — if an icon appears in 2+ places, consider extracting it to a component
- **Abstraction for one use** — do not create a utility, component, or helper for something that exists in only one place
- **Extra props for hypothetical future use** — only add props that are used by current callers
- **Scope creep** — do not improve or refactor code that is adjacent to the task you were asked to do

---

## 9. Dependency Rules

Adding a new npm dependency requires **explicit user approval before installation**. Before requesting approval:
1. Confirm that a native browser API or existing utility cannot do the job
2. Check the package's maintenance status and bundle size impact
3. Confirm it belongs as a `devDependency` if it is only used at build time

Project philosophy: minimal client-side JavaScript. Prefer solutions that:
- Work without a package (native APIs, CSS)
- Are dev-only (Tailwind plugins, Astro integrations)
- Do not add to the client-side bundle

---

## 10. Readability and Maintainability

- **Comments**: Only add where logic is non-obvious. Do not comment self-evident code.
- **Component doc comment**: One-line description in the frontmatter comment block is sufficient
- **Magic values**: Assign any hardcoded number or string to a named constant
- **Nesting depth**: If HTML nesting exceeds 4 levels consistently, the structure is likely too complex
- **Template length**: Scan for extractable sections when a template exceeds ~80 lines

---

## 11. Safe Change Practices

Optimize for **small, reviewable diffs**:

- Change one logical thing per commit
- Change one feature or fix per PR
- Do not mix styling changes with logic changes in the same commit
- Do not modify files outside the stated scope of the task
- Do not clean up or refactor surrounding code while fixing a bug — submit a separate PR

**If a task requires touching more than 5 files**, stop and propose splitting it into smaller tasks with separate PRs.

**Before opening a PR**, verify:
1. Only the files required by the task have changed (`git diff --name-only`)
2. The diff is readable — each changed line has a clear reason
3. No debug code, `console.log`, or commented-out blocks remain

---

## 12. Avoiding Over-Abstraction

Abstraction should be earned, not anticipated. Before creating any new abstraction, apply these tests:

- **Duplication test**: Does this code already exist in at least one other place? If not, keep it inline.
- **Clarity test**: Does the abstraction make the code easier to understand, or just shorter?
- **Naming test**: Can you name it clearly without the words "helper", "util", "misc", or "common"? If not, the purpose isn't clear enough to justify extraction.
- **Prop test**: If a component needs more than 5 props to cover its use cases, it may be trying to do too much.

**AI-specific rule**: Do not create a new abstraction in the same PR as the task that prompted the refactor. If you notice duplication while working on a bug fix, note it in the PR description and treat it as a separate task.

---

## 13. Avoiding Duplication

Before writing any markup, logic, or data:
- Check `src/components/` for an existing component
- Check `src/lib/` for existing utility functions
- Check `src/i18n/ui.ts` for existing translation strings
- Check `src/config/site.ts` for existing URL constants
- Search for the same SVG path string in other files before writing it again

If you discover duplication in existing code, do not fix it silently. Note it in the PR description or create a separate task for it.

---

## 14. Documentation Expectations

When making changes:
- **New component**: Add a one-line frontmatter comment describing its purpose and DESIGN.md reference if applicable
- **New utility function**: Add a JSDoc comment if the function signature is not self-explanatory
- **Architectural change**: Add an entry to `docs/ai/decisions.md`
- **Completed task**: Update `docs/ai/progress.md` (move completed items, update next steps)

Do not add comments to code you did not touch. Do not add docstrings to functions that were already clear without them.

---

## 15. Validation Before Review

Before pushing and opening a PR, complete this checklist:

```
- [ ] npm run build passes with 0 errors
- [ ] npm run dev starts without errors
- [ ] Affected pages load correctly (light mode)
- [ ] Affected pages look correct in dark mode (DevTools > Rendering > prefers-color-scheme: dark)
- [ ] Mobile layout verified (DevTools device toolbar, 375px width)
- [ ] git diff --name-only shows only files relevant to the task
- [ ] No hardcoded hex colors in changed files
- [ ] No inline translation logic in page files
- [ ] No debug code or commented-out blocks remain
- [ ] docs/ai/progress.md updated if task is complete
```

If any item fails, fix it before creating the PR.
