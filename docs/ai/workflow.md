# Development Workflow

The process for shipping work in this repository. The aim is small, reviewable changes that build cleanly — not procedural compliance.

---

## The loop

```
issue → branch from develop → implement → verify build → PR → review → merge → update progress.md
```

Each PR represents one logical change. Keep commits focused and the diff readable; reviewers will tell you if a change should be split.

---

## Issue creation

Create an issue for any non-trivial change — this gives agents and humans a shared reference point and prevents two agents starting the same work independently.

### Agent routing

| Work type | Agent | How to trigger |
|---|---|---|
| Complex reasoning, multi-file, Astro/TS expertise | @claude | Comment `@claude please start` on the issue after creating |
| Clear files, clear pattern, no tradeoffs | Copilot coding agent | Assign the issue via Assignees after creating |
| Investigation or unclear scope | @claude | Always — needs reasoning before committing to an approach |
| Blocked on owner input | None | Leave in [`progress.md`](./progress.md) open questions until resolved |

### Before you create an issue

- Verify no open PR already covers this work — `gh pr list --state open` and scan for matching titles or issue references.
- Check [`docs/ai/tech-debt.md`](./tech-debt.md) — if this is a tracked debt item, reference it in the issue body.
- Assign to **one agent only**. Two agents working the same issue creates duplicate PRs — see [§ Coordinator checklist](#coordinator-checklist) for how to resolve that.

### Issue quality

Every issue must include:
- **Affected files** — explicit list including related files (locale siblings, middleware that intercepts the feature, `tech-debt.md` if resolving a tracked item).
- **Acceptance criteria** — verifiable in the Cloudflare preview URL without code access; not just "build passes".

---

## Branches

| Branch | Purpose | Who merges |
|---|---|---|
| `main` | Production | Owner only (from `test`) |
| `test` | QA staging | Owner only (from `develop`) |
| `develop` | Development staging — all PRs land here | AI-generated PRs |
| `ai/*` | Feature branches from manual work | — |
| `ai-issue-N` / `ai-pull-N` | Branches created by the GitHub Actions Claude workflow (template in [`.github/workflows/claude.yml`](../../.github/workflows/claude.yml)) | — |
| `claude/*` | Branches created by the Claude cloud agent | — |

All three feature-branch prefixes are valid. Branch protection on `develop` accepts all of them. Use `ai/<short-name>` for manual work; the others are produced automatically by the matching tool.

---

## Steps

1. **Check your local branch.** Run `git branch --show-current` before anything else. If you are not on `develop`, switch now: `git checkout develop && git pull origin develop`. Never start work on a leftover feature branch — it carries unrelated history and will create conflicts.
2. **Read the issue.** Understand requirements, identify affected files, note constraints.
3. **Orient.** Read [`progress.md`](./progress.md) for current state.
4. **Branch.** `git checkout -b ai/<short-name>`.
5. **Implement.** Small focused commits; run `npm run dev` as you go.
6. **Verify.** Quick gate before opening the PR — fail any item, fix it before pushing:
   - `npm run build` passes (0 errors).
   - `git diff --name-only` shows only task-relevant files.
   - Spot-check affected pages in the browser, light and dark (DevTools → Rendering → `prefers-color-scheme: dark`).
   - For UI changes: sanity-check at 375 px mobile width (DevTools device toolbar).
   - No debug code, `console.log`, or commented-out blocks remain in the diff.
   - If the task is complete, [`docs/ai/progress.md`](./progress.md) is updated in the same PR.
7. **Pre-flight.** Walk the diff against [`docs/ai/standards.md`](./standards.md) §1 (hard standards). The goal is a clean review pass, not zero comments — reviewers will catch things you missed, and that's fine.
8. **Open a draft PR** against `develop` as soon as you have a first passing commit. Link the issue (`Closes #N`) immediately. This signals to other agents that the work is in flight — a second agent checking open PRs will see it and not start duplicate work. Mark the PR ready for review only when `npm run build` passes and the checklist is complete.
9. **Address review.** Follow the sequence in [§ Review feedback](#review-feedback) below — it covers fixing, replying, tech-debt logging, and re-requesting review.
10. **Update [`progress.md`](./progress.md)** when the PR is approved or merged — move done items, update next steps.

### Commit format

`<type>(<scope>): <subject>` — types: `feat` · `fix` · `docs` · `style` · `refactor` · `chore`.

Examples:
- `feat(blog): add client-side search`
- `fix(nav): correct active state on mobile`
- `docs(brand): update voice and tone section`

---

## PR size

| Good | Avoid |
|---|---|
| 1–3 files | 10+ files |
| 50–200 lines | 500+ lines |
| Single focused change | Multiple unrelated changes |

If a task naturally requires more, propose splitting it. If the work is genuinely indivisible, ship it and explain in the PR description why.

---

## Review feedback

For every comment thread, work through this sequence in order:

1. **Read** all comments before touching any code — understand the full picture first.
2. **Fix** each valid comment in the working tree.
3. **Commit and push** all fixes in one focused commit.
4. **Reply inline** to every thread — what changed and where, or a clear reason why the comment doesn't apply. Do this after pushing so the reply references real code. Never silently close a thread or push fixes without a reply: the reviewer has no way to know what was done.
5. **Post a summary comment** on the PR listing what was addressed and anything intentionally left unchanged with a reason.
6. **Re-request review.**

A comment may identify a real issue that is genuinely out of scope for the current PR. In that case: add an entry to [`docs/ai/tech-debt.md`](./tech-debt.md) and reply to the thread with the entry so the reviewer can see it is tracked. Do not fix out-of-scope issues inline — keep the PR focused.

If a comment is wrong or would worsen the work, say so plainly. Reviewer opinions on aesthetics don't override deliberate decisions, but they do flag inconsistencies worth examining.

The cycle is normal; a clean first round is the goal, not a guarantee.

---

## Coordinator checklist

Run when multiple PRs are in flight — typically after a batch of issues completes, or when the PR queue has stalled:

1. **Scan for duplicates.** `gh pr list --state open` — look for two PRs touching the same files or referencing the same issue. Close the lower-quality one with a comment pointing to the one that continues.
2. **Check base branches.** Every open PR must target `develop`. Retarget any that don't: `gh pr edit NUMBER --base develop`.
3. **Identify merge order.** PRs that all edit the same file (commonly `docs/ai/tech-debt.md`) must merge sequentially — merge the simplest first, then rebase the others. Simultaneous merges guarantee a conflict.
4. **Unblock stalled PRs.** For each PR with unaddressed review comments: comment `@claude` with specific fix instructions (see [§ Review feedback](#review-feedback) for format). Don't leave PRs in a broken state — either unblock them or close with an explanation.
5. **Merge in order.** Verify the Cloudflare preview URL after each merge before moving to the next.
6. **After the batch:** `git pull origin develop` — confirm `develop` is clean and at the expected commit.

The PR quality gate catches the most common mechanical issues automatically. The coordinator checklist covers the coordination that requires judgement.

---

## Troubleshooting

**Build fails.** Read the error, fix the type or import issue, re-run. Don't commit failing builds.

**Merge conflicts.**
```bash
git checkout develop && git pull origin develop
git checkout ai/<branch> && git merge develop
# Resolve, stage resolved files only, commit, push.
```

**Push rejected — fetch first.** Remote has commits you don't (review fix-ups, auto-commits):
```bash
git stash      # if you have unstaged changes
git fetch origin
git rebase origin/<branch>
git stash pop  # if you stashed
git push origin <branch>
```
Never force-push to `develop` or `main` — they are protected.

**Port 4321 in use.** `lsof -ti:4321 | xargs kill -9 && npm run dev`

---

## Anti-patterns

| Don't | Do |
|---|---|
| Commit to `main` or `develop` directly | Use a feature branch |
| Push code that doesn't build | Run `npm run build` first |
| Mix unrelated changes in one PR | Split into focused PRs |
| Improve adjacent code while fixing a bug | Note it in `progress.md`, fix separately |
| Stage `.claude/settings.local.json` | It's gitignored — personal permissions |
| Force-push protected branches | Resolve via merge or rebase + normal push |
| Start a task on a leftover feature branch | Run `git branch --show-current`; switch to `develop` first |
| Two agents open PRs for the same issue | Close the duplicate; comment on it pointing to the PR that continues the work |
| Open a PR without linking the issue | Add `Closes #N` — the quality gate will remind you |
| Start work without opening a draft PR | Open a draft PR on the first commit so other agents see the work is in flight |
