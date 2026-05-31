# Post-mortem: web-kit extraction (2026-05-31)

How we lifted amioprenova's reusable building blocks into the private **sitekit**
monorepo (`@christopherstavrou/*`), published them to GitHub Packages, and
migrated the site to consume them. Written so the next extraction is faster and
avoids the detours.

## What shipped

Four packages (`@christopherstavrou/* @ 0.1.0`): `theme` (CSS-var tokens +
Tailwind preset), `ui` (11 Astro components), `search` (`mountFacetedSearch`
faceting engine), `events-scraper` (FB scraper CLI). amioprenova consumes them
as versioned deps; net **~2,700 fewer lines** in the site (PR #136). Epic #125.

## What went well

- **Prop-driven components were already portable.** The UI components took
  labels/props and never imported `siteConfig` — so the only real coupling was
  the design-token classes. That made `theme` the natural foundation and the
  rest a near-mechanical move. *Lesson: keep components config-free from day one;
  it's what makes extraction cheap.*
- **Theme-first ordering** (theme → ui → search → scraper) meant each phase built
  on a solid base; nothing had to be redone for a missing dependency.
- **Dogfooding on one integration branch** (`feature/web-kit`) kept the site
  building at every step and produced an honest end-to-end test before any PR.
- **The screenshot verification loop** caught real regressions (see the Tailwind
  gotcha) that a clean `npm run build` happily missed.
- **De-duplication win:** the faceting engine was copy-pasted across 4 search
  pages; extracting `mountFacetedSearch` removed ~180 lines per page.

## What bit us (the useful part)

1. **The git-submodule phase was avoidable churn.** We chose "git submodule +
   `file:` refs now, registry later" to stay private-and-easy. But:
   - npm **cannot install a git subdirectory**, so the submodule was the only
     git option — and it brought a cascade of friction:
   - **stale submodule** → "broken styling" that wasn't a CSS bug at all (a
     `git pull` updates the pointer, not the working tree), and
   - **Cloudflare Pages cannot init a private submodule**, so the preview never
     built on submodule branches.
   - We ended up going to a registry anyway. **Lesson: for an npm consumer,
     skip the submodule — publish to a registry from the start.** The "easy"
     interim was more total work than the "proper" path.

2. **Tailwind `content` must scan the package source.** Package-only utility
   classes (e.g. the dropdown's `h-3.5`) weren't generated until we added the
   package path to `content`, which rendered an icon huge. A clean build hid it;
   only a screenshot caught it. *Lesson: when extracting Tailwind-styled
   components, update the consumer's `content` globs in the same change.*

3. **GitHub Packages scope must match the repo owner.** `@sitekit` couldn't
   publish under the user account; we renamed to `@christopherstavrou` (a
   `sitekit` org would have kept the neutral name). *Lesson: pick the scope to
   match the registry target up front to avoid a rename touching every import.*

4. **Cloudflare keeps separate env vars for Production and Preview.** A
   Production-only `NODE_AUTH_TOKEN` gave a `401` on the Preview build. *Lesson:
   add private-registry tokens to **both** environments.*

5. **Branch protection vs. the bot.** Enabling "require PR (enforce admins)" on
   `develop` broke the weekly scrape workflow's direct push. Fixed by having it
   **open a PR** from a bot branch. *Lesson: when you add protection, audit the
   automations that push to the protected branch.*

6. **Committed `dist/` for the TS package** during git-consumption (no
   build-on-install step). The registry tarball makes this unnecessary — a
   reason the registry path is cleaner.

## If we did it again

- **Go straight to the registry.** Decide scope = registry-owner, set up
  `changesets` + a publish workflow (Actions `GITHUB_TOKEN`), publish `0.x`, and
  consume versioned deps. No submodule, no committed `dist`, Cloudflare works.
- **Document the token once, wire it everywhere** (local, Actions secret,
  Cloudflare Prod + Preview) — it's the single recurring setup cost of private
  packages.
- **Keep the dogfood branch + screenshot loop** — they were the highest-value
  habits.

## References
- Consumption + token setup: `docs/ai/workflow.md` § "Consuming the sitekit web kit"
- Kit repo: https://github.com/christopherstavrou/sitekit (`AGENTS.md`, `docs/ai/`)
- Epic: #125 · PR: #136
