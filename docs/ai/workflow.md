# Development Workflow

The process for shipping work in this repository. The aim is small, reviewable changes that build cleanly — not procedural compliance.

---

## The loop

```
issue → branch from develop → implement → verify build → PR → review → merge → update progress.md
```

Each PR represents one logical change. Keep commits focused and the diff readable; reviewers will tell you if a change should be split.

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

1. **Read the issue.** Understand requirements, identify affected files, note constraints.
2. **Orient.** `git checkout develop && git pull origin develop`. Read [`progress.md`](./progress.md) for current state.
3. **Branch.** `git checkout -b ai/<short-name>`.
4. **Implement.** Small focused commits; run `npm run dev` as you go.
5. **Verify.** Quick gate before opening the PR — fail any item, fix it before pushing:
   - `npm run build` passes (0 errors).
   - `git diff --name-only` shows only task-relevant files.
   - Spot-check affected pages in the browser, light and dark (DevTools → Rendering → `prefers-color-scheme: dark`).
   - For UI changes: sanity-check at 375 px mobile width (DevTools device toolbar).
   - No debug code, `console.log`, or commented-out blocks remain in the diff.
   - If the task is complete, [`docs/ai/progress.md`](./progress.md) is updated in the same PR.
6. **Pre-flight.** Walk the diff against [`docs/ai/standards.md`](./standards.md) §1 (hard standards). The goal is a clean review pass, not zero comments — reviewers will catch things you missed, and that's fine.
7. **Open PR** against `develop`. Use the template — title under 50 chars, summary, changes list, verify steps.
8. **Address review.** Follow the sequence in [§ Review feedback](#review-feedback) below — it covers fixing, replying, tech-debt logging, and re-requesting review.
9. **Update [`progress.md`](./progress.md)** when the PR is approved or merged — move done items, update next steps.

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
