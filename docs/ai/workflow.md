# Claude Development Workflow

This document defines the **mandatory workflow** for all Claude Code sessions working on this repository.

---

## Core Principles

1. **Never commit directly to `main`**
2. **Always branch from `develop`**
3. **Work in small, incremental PRs**
4. **Build must succeed before committing**
5. **Update progress.md after every PR**

---

## Branch Strategy

### Long-Lived Branches

- **`main`**: Production-ready code
  - Protected branch (recommend enabling branch protection on GitHub)
  - Merges only from `develop` via PR
  - Represents what's live or deployable

- **`develop`**: Integration/staging branch
  - Default branch for Claude work
  - All feature branches branch from here
  - All PRs merge back to here
  - Periodically merged to `main` for releases

- **`test`**: QA/experiments branch
  - Optional: For testing risky changes
  - Can be reset or force-pushed
  - Not required for normal workflow

### Feature Branches

All Claude work MUST use feature branches with `claude/` prefix:

```
claude/<short-descriptive-name>
```

**Examples:**
- `claude/blog-search`
- `claude/design-system-rollout`
- `claude/fix-mobile-nav`
- `claude/add-analytics`

**Rules:**
- Branch from `develop`, NOT from `main`
- Keep branches short-lived (1-3 days of work maximum)
- Delete branch after PR is merged
- NEVER push to `claude/*` branches that don't match the session ID pattern (avoid 403 errors)

---

## Step-by-Step Workflow

### 1. Start of Session: Explore

**Before writing any code:**

```bash
git checkout develop
git pull origin develop
```

1. Read `docs/ai/progress.md` to understand current state
2. Read `CLAUDE.md` for quick context
3. Check recent commits: `git log --oneline -n 10`
4. Review what's "In Progress" or "Next"

**Output:** Brief summary of current state and plan.

---

### 2. Plan

Before implementing:

1. List files you'll create/modify
2. Describe the approach
3. Identify potential risks or unknowns
4. Confirm understanding with user if needed

**Output:** Short bulleted plan (3-5 items).

---

### 3. Create Feature Branch

```bash
git checkout -b claude/your-feature-name
```

Branch naming:
- Use kebab-case
- Be descriptive but concise
- Maximum 3-4 words

---

### 4. Implement

**During implementation:**

- Make small, logical commits (not one giant commit)
- Test incrementally (use `npm run dev` frequently)
- Keep changes focused on the current task
- Don't mix unrelated changes in one branch

**Commit messages:**

Use conventional commit format:

```
<type>(<scope>): <subject>

[optional body]
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Formatting, missing semicolons, etc. (not CSS)
- `refactor:` - Code change that neither fixes a bug nor adds a feature
- `test:` - Adding tests
- `chore:` - Maintenance tasks, dependency updates

**Examples:**
```bash
git commit -m "feat(blog): add client-side search with JSON index"
git commit -m "refactor(home): apply design system components"
git commit -m "docs(ai): add workflow documentation"
git commit -m "fix(nav): correct active state highlighting"
```

---

### 5. Verify

**Before committing final changes:**

```bash
# 1. Run build (MUST succeed)
npm run build

# 2. Start dev server and spot-check
npm run dev
# Open browser, navigate to affected pages, verify visually

# 3. Check for uncommitted changes
git status
```

**Build must succeed.** If build fails, fix errors before proceeding.

---

### 6. Commit & Push

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: your change description"

# Push to remote (creates remote branch)
git push -u origin claude/your-feature-name
```

**Note on 403 errors:**
- If push fails with HTTP 403, ensure branch name starts with `claude/` and matches session constraints
- Retry with exponential backoff if network errors occur (2s, 4s, 8s, 16s)

---

### 7. Open Pull Request

Create PR via GitHub CLI or web interface:

```bash
gh pr create --base develop --head claude/your-feature-name --title "Your PR Title" --body "$(cat <<'EOF'
## Summary
Brief description of what changed.

## Changes
- Bullet list of specific changes
- File A: did X
- File B: did Y

## How to Verify
1. Run `npm install` (if dependencies changed)
2. Run `npm run build` (should succeed)
3. Run `npm run dev`
4. Navigate to [specific page]
5. Check [specific functionality]

## Notes
- Any important context or follow-up needed
EOF
)"
```

**PR Requirements:**
- **Title**: Concise, descriptive (50 chars max preferred)
- **Summary**: What problem does this solve? What changed?
- **How to Verify**: Step-by-step instructions for reviewer
- **Base branch**: `develop` (NOT `main`)

---

### 8. Update Documentation

**After PR is created (before marking session complete):**

Update `docs/ai/progress.md`:
- Move completed items from "In Progress" to "Done"
- Add date to "Done" entries if significant milestone
- Update "In Progress" with current work
- Revise "Next" list if priorities changed

**Example:**
```markdown
## ✅ Done
- ✅ Implement blog search functionality (2026-01-15)
- ✅ Refactor Shows page with design system (2026-01-15)

## 🟡 In Progress
- Refactor Blog pages with design system

## ⏭ Next
- Refactor Press pages
- Refactor Contact pages
```

Commit documentation updates:
```bash
git add docs/ai/progress.md
git commit -m "docs(ai): update progress after blog search implementation"
git push
```

---

### 9. End of Session

**Before ending the session:**

1. ✅ Build succeeds
2. ✅ All work committed and pushed
3. ✅ PR created and linked to `develop`
4. ✅ `docs/ai/progress.md` updated
5. ✅ No uncommitted changes: `git status` shows clean

**Output to user:**
- PR link
- Brief summary of what was accomplished
- Clear description of current state
- Suggestion for next task (optional)

---

## PR Best Practices

### Small PRs Are Better

**Good PR:**
- 1-3 files changed
- 50-200 lines of code
- Single focused change
- Clear verification steps

**Bad PR:**
- 10+ files changed
- 500+ lines of code
- Multiple unrelated changes
- Vague description

**Why small PRs?**
- Easier to review
- Faster to merge
- Lower risk of breaking changes
- Easier to revert if needed

---

## Recommended GitHub Branch Protection Settings

*These settings cannot be configured by Claude, but should be enabled by repository owner:*

### For `main` branch:
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Do not allow bypassing the above settings
- ❌ Allow force pushes: **DISABLED**
- ❌ Allow deletions: **DISABLED**

### For `develop` branch:
- ✅ Require pull request reviews (optional, but recommended)
- ✅ Require status checks to pass before merging
- ❌ Allow force pushes: **DISABLED**
- ❌ Allow deletions: **DISABLED**

---

## Common Scenarios

### Scenario: Build Fails

**Problem**: `npm run build` returns errors.

**Solution:**
1. Read the error message carefully
2. Fix the error (TypeScript errors, missing imports, etc.)
3. Run `npm run build` again
4. Repeat until build succeeds
5. **Never commit if build fails**

---

### Scenario: Merge Conflicts

**Problem**: PR has merge conflicts with `develop`.

**Solution:**
```bash
# Update your branch with latest develop
git checkout develop
git pull origin develop

git checkout claude/your-branch
git merge develop

# Resolve conflicts in editor
# After resolving, commit:
git add .
git commit -m "chore: resolve merge conflicts with develop"
git push
```

---

### Scenario: Need to Continue Previous Work

**Problem**: Previous Claude session left work in progress.

**Solution:**
1. Read `docs/ai/progress.md` - check "In Progress" section
2. Find the branch: `git branch -a | grep claude`
3. Check out the branch: `git checkout claude/branch-name`
4. Pull latest: `git pull origin claude/branch-name`
5. Continue work, commit, push, update progress.md

---

### Scenario: Accidentally Committed to Wrong Branch

**Problem**: Committed to `main` or `develop` instead of feature branch.

**Solution:**
```bash
# If you haven't pushed yet:
git reset HEAD~1  # Undo last commit, keep changes
git stash        # Stash your changes
git checkout -b claude/correct-branch
git stash pop    # Restore changes
git add .
git commit -m "your message"
git push -u origin claude/correct-branch
```

---

## Anti-Patterns to Avoid

❌ **Don't**: Commit directly to `main` or `develop`
✅ **Do**: Always use feature branches

❌ **Don't**: Push code that doesn't build
✅ **Do**: Verify `npm run build` succeeds before pushing

❌ **Don't**: Create giant PRs with 20+ file changes
✅ **Do**: Break work into small, focused PRs

❌ **Don't**: Mix unrelated changes in one commit/PR
✅ **Do**: Keep each PR focused on one task

❌ **Don't**: Forget to update `docs/ai/progress.md`
✅ **Do**: Update it after every significant change

❌ **Don't**: Leave work uncommitted at end of session
✅ **Do**: Commit, push, create PR before ending

❌ **Don't**: Skip verification steps
✅ **Do**: Test build, dev server, and visual changes

---

## Workflow Checklist

Copy this checklist for each task:

```
Session Start:
- [ ] Checked out `develop` branch
- [ ] Pulled latest changes
- [ ] Read `docs/ai/progress.md`
- [ ] Created plan

Implementation:
- [ ] Created feature branch `claude/[name]`
- [ ] Made changes
- [ ] Tested changes locally with `npm run dev`
- [ ] Build succeeds: `npm run build`

Completion:
- [ ] All changes committed with clear messages
- [ ] Pushed to remote feature branch
- [ ] PR created targeting `develop`
- [ ] Updated `docs/ai/progress.md`
- [ ] No uncommitted changes
```

---

## Questions?

If workflow is unclear, or if special circumstances arise:
1. Document the situation in a comment or PR description
2. Follow the closest applicable workflow step
3. Prefer safety (smaller changes, more verification) over speed
