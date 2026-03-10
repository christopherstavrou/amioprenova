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
| `develop` | Development staging — all PRs land here | Claude PRs |
| `claude/*` | Feature branches — deleted after merge | — |

Branch naming: `claude/<short-descriptive-name>` in kebab-case, 2–4 words.

Examples: `claude/blog-search` · `claude/fix-mobile-nav` · `claude/add-press-photos`

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
git checkout -b claude/your-feature-name
```

### 4. Implement

- Make small, focused commits — not one large commit at the end
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
git push -u origin claude/your-feature-name
```

### 7. Open pull request

```bash
gh pr create --base develop --head claude/your-feature-name \
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

### 8. Handle review feedback

If the reviewer requests changes:
- Push additional commits to the **same branch** — do not open a new PR
- Address each point of feedback directly
- Add a comment on the PR explaining what was changed and why if not obvious
- Re-verify: `npm run build` must still pass

### 9. Update progress.md

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
git checkout claude/your-branch && git merge develop
# Resolve conflicts
git add . && git commit -m "chore: resolve merge conflicts" && git push
```

**Wrong branch commit:**
```bash
git reset HEAD~1 && git stash
git checkout -b claude/correct-branch
git stash pop && git add . && git commit -m "your message"
git push -u origin claude/correct-branch
```

**HTTP 403 on push** — Branch must start with `claude/`:
```bash
git branch -m claude/your-feature-name
git push -u origin claude/your-feature-name
```

**Port 4321 in use:**
```bash
lsof -ti:4321 | xargs kill -9 && npm run dev
```

---

## Anti-Patterns

| Don't | Do instead |
|-------|-----------|
| Commit to `main` or `develop` | Use `claude/*` feature branches |
| Push code that doesn't build | Verify `npm run build` first |
| Create a PR touching 10+ files | Split into focused PRs |
| Mix unrelated changes in one commit | One logical change per commit |
| Improve code outside the task scope | Stay focused on what was asked |
| Leave work uncommitted at end of session | Commit, push, open PR |
