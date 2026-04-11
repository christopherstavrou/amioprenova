# Development Workflow

Mandatory process for all work in this repository.

---

## The Loop

```
issue assigned
  → read issue + project docs
  → create branch
  → implement (small commits)
  → verify build
  → open PR to develop
  → reviewer gives feedback
  → push revisions to same branch
  → merge
  → update progress.md
```

---

## Branch Model

| Branch | Purpose | Who merges |
|--------|---------|-----------|
| `main` | Production — live site | Owner only (from `test`) |
| `test` | QA staging | Owner only (from `develop`) |
| `develop` | Development staging — all PRs land here | AI-generated PRs |
| `ai/*` | Feature branches — deleted after merge | — |

Branch naming: `ai/<short-descriptive-name>` in kebab-case, 2–4 words.

Examples: `ai/blog-search` · `ai/fix-mobile-nav` · `ai/add-press-photos`

---

## Step by Step

### 1. Read the issue

Before writing any code:
- Understand exactly what is being asked
- Identify which files will likely be affected
- Estimate scope — if it requires more than 5 files, propose splitting the work
- Note any constraints or acceptance criteria in the issue

### 2. Orient

```bash
git checkout develop && git pull origin develop
```

Read `docs/ai/progress.md`. Note current state and any relevant in-progress work.

Write a short plan (3–5 bullet points) before starting implementation.

### 3. Create branch

```bash
git checkout -b ai/your-feature-name
```

### 4. Implement

- Make small, focused commits — AI agent creates commit messages autonomously
- Run `npm run dev` to verify changes as you work
- Stay scoped to the issue — do not improve adjacent code

**Commit format:**
```
<type>(<scope>): <subject>
```
Types: `feat` · `fix` · `docs` · `style` · `refactor` · `chore`

Examples:
```bash
git commit -m "feat(blog): add client-side search with JSON index"
git commit -m "fix(nav): correct active state on mobile"
git commit -m "docs(ai): update progress after design system rollout"
```

### 5. Verify

```bash
npm run build          # Must pass with 0 errors
git diff --name-only   # Only task-relevant files should be changed
```

Spot-check affected pages in the browser. Test dark mode: DevTools → Rendering → `prefers-color-scheme: dark`.

### 6. Commit and push

```bash
git add <specific-files>   # Stage specific files, not git add .
git commit -m "feat: description"

# Always fetch before pushing — the remote may have moved since your last pull
git fetch origin
git rebase origin/ai/your-feature-name   # or origin/develop if pushing develop directly
git push -u origin ai/your-feature-name
```

**If you have unstaged changes when rebasing:** `git stash` before the rebase, `git stash pop` after, then push.

### 7. Pre-flight self-review

**Run this before opening the PR.** The goal is to catch every issue that Copilot will catch, so the first review round is already clean. Work through the diff file by file against every rule in `.github/copilot-instructions.md` and `docs/ai/standards.md`.

Check each changed file for:

| Area | What to verify |
|------|---------------|
| **Colours** | No hardcoded hex/rgba — only Tailwind tokens or CSS custom properties |
| **Transitions** | No `duration-300` or other hardcoded durations — use `duration-fast` / `duration-base` tokens |
| **i18n parity** | If an EN page changed, confirm the BG sibling is structurally identical (same conditional guards, same props) |
| **Labels prop** | Any component used on both EN + BG pages accepts a `labels` prop with English defaults; BG callers pass Bulgarian strings; runtime JS reads from `data-*` attributes |
| **Accessibility** | Every `<button>` not a form submit has `type="button"`; disclosure widgets have `aria-expanded` + `aria-controls`; icon-only buttons have `aria-label` |
| **Security** | No `innerHTML` with user-controlled data — use `createElement` + `textContent` |
| **Multi-instance components** | All DOM queries scoped to instance root — no `document.getElementById` with hardcoded IDs |
| **Static generation** | Every `getStaticPaths` that calls `paginate()` has an empty-list fallback |
| **Fetch / async** | `response.ok` checked before `response.json()`; errors caught and DEV-only logged |
| **Dark mode** | No `dark:` Tailwind variants — dark mode is `data-theme="dark"` on `<html>` |
| **Scope** | `git diff --name-only` shows only task-relevant files; no adjacent clean-ups |

Fix any failures before opening the PR. Do not skip this step.

### 8. Open pull request

```bash
gh pr create --base develop --head ai/your-feature-name \
  --title "concise title under 50 chars" \
  --body "$(cat <<'EOF'
## Summary
What changed and why.

## Changes
- file-a: what changed
- file-b: what changed

## How to Verify
1. npm run build
2. npm run dev
3. Navigate to [page]
4. Check [specific behavior]

## Notes
Follow-up tasks or context.
EOF
)"
```

### 9. Handle review feedback

**The AI agent owns the entire review loop.** The user does not need to manually action review feedback — the agent fetches comments, implements fixes, replies inline, and re-requests review autonomously until the PR is approved.

After requesting a Copilot review, immediately post this comment on the PR to encourage exhaustive upfront feedback:

```bash
gh pr comment PR --body "Please give all feedback in this review pass — flag every issue you can see across all files, including style, i18n parity, accessibility, security, and best practices. Don't hold anything back for a follow-up round."
```

**Step-by-step process:**

1. **Fetch inline comments** (filter to comments since the last round if needed):
   ```bash
   gh api repos/OWNER/REPO/pulls/PR/comments \
     --jq '.[] | select(.created_at > "TIMESTAMP") | {id, path, line, body, created_at}'
   ```

2. **Read every affected file** before editing — never guess at current content.

3. **Fix every comment.** Then **reply to each inline thread** individually:
   ```bash
   gh api repos/OWNER/REPO/pulls/PR/comments/COMMENT_ID/replies \
     -X POST -f body="Fixed: [one sentence explaining what changed and why]"
   ```
   A general PR comment alone does not close individual threads — reviewers (including Copilot) expect inline replies per thread to mark them resolved.

4. **Verify**: `npm run build` must pass (0 errors) before committing.

5. **Commit** with a message naming the round:
   ```bash
   git commit -m "fix(review): address [N]th round of [reviewer] comments"
   ```

6. **Push** to the same feature branch.

7. **Leave a summary comment** on the PR listing every item addressed:
   ```bash
   gh pr comment PR --body "## [N]th round addressed\n\n**1 — Issue title**\nWhat was done..."
   ```

8. **Re-request review**:
   ```bash
   # Copilot:
   gh pr edit PR --add-reviewer copilot-pull-request-reviewer
   # Human reviewer: use GitHub web UI or gh pr edit PR --add-reviewer USERNAME
   ```

### 10. Update progress.md

After the PR is merged (or as a final commit before requesting review):

```bash
git add docs/ai/progress.md
git commit -m "docs(ai): update progress after [feature]"
git push
```

Move completed items to Done. Update the Next list. Note any new open questions.

---

## PR Size

| Good PR | Avoid |
|---------|-------|
| 1–3 files changed | 10+ files changed |
| 50–200 lines of diff | 500+ lines of diff |
| Single focused change | Multiple unrelated changes |

If a task requires touching more than 5 files, stop and propose two PRs.

---

## Checklist

```
Before starting:
- [ ] Read the issue — understand requirements
- [ ] On develop, pulled latest
- [ ] Read docs/ai/progress.md
- [ ] Plan written (3–5 bullets)

Before opening PR:
- [ ] npm run build passes (0 errors)
- [ ] git diff --name-only shows only task-relevant files
- [ ] Affected pages verified in browser (light + dark mode)
- [ ] All commits have clear messages
- [ ] Pre-flight self-review completed (Step 7 table — every rule checked against the diff)
- [ ] Exhaustive-feedback comment posted after requesting Copilot review

After PR:
- [ ] docs/ai/progress.md updated
- [ ] No uncommitted changes remaining
```

---

## Troubleshooting

**Build fails** — Read the error. Fix the TypeScript or import issue. Never commit if the build fails.

**Merge conflicts:**
```bash
git checkout develop && git pull origin develop
git checkout ai/your-branch && git merge develop
# Resolve conflicts, then stage only the resolved files — do not use git add .
git add <resolved-files> && git commit -m "chore: resolve merge conflicts" && git push
```

**Wrong branch commit:**
```bash
git reset HEAD~1 && git stash
git checkout -b ai/correct-branch
git stash pop && git add . && git commit -m "your message"
git push -u origin ai/correct-branch
```

**HTTP 403 on push** — Branch must start with `ai/`:
```bash
git branch -m ai/your-feature-name
git push -u origin ai/your-feature-name
```

**Push rejected — "fetch first"** — Remote has commits you don't have locally (Copilot review, auto-commits, another push):
```bash
git stash                          # if you have unstaged changes
git fetch origin
git rebase origin/<branch-name>
git stash pop                      # if you stashed
git push origin <branch-name>
```
Never use `--force` on `develop` or `main` — they are protected.

**Port 4321 in use:**
```bash
lsof -ti:4321 | xargs kill -9 && npm run dev
```

---

## Anti-Patterns

| Don't | Do instead |
|-------|-----------|
| Commit to `main` or `develop` | Use `ai/*` feature branches |
| Push code that doesn't build | Verify `npm run build` first |
| Create a PR touching 10+ files | Split into focused PRs |
| Mix unrelated changes in one commit | One logical change per commit |
| Improve code outside the task scope | Stay focused on what was asked |
| Leave work uncommitted at end of session | Commit, push, open PR |
| Push without fetching first | Always `git fetch origin && git rebase origin/<branch>` before `git push` |
| Stage `.claude/settings.local.json` | It is gitignored — never commit it; it holds personal tool permissions |
