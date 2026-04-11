# GitHub AI Integration

This document covers how AI agents (Claude Code and GitHub Copilot) are integrated into
this repository — how to trigger them, how to configure custom instructions, and how to
troubleshoot common issues.

---

## How it works

The workflow at `.github/workflows/claude.yml` uses the official
`anthropics/claude-code-action@v1` action. When a permitted user mentions `@claude`
on an issue or pull request, GitHub fires an event, the workflow job starts,
and Claude reads the full issue/PR context, checks out the repo, and responds
directly in the GitHub comment thread.

Claude can:
- Answer questions about the codebase
- Implement features and open pull requests
- Review code and leave comments
- Read CI results and diagnose failures
- Search the web for research

---

## Triggering Claude

Mention `@claude` anywhere in:

| Where | How |
|---|---|
| Issue body (when opening) | Include `@claude` in the description |
| Issue comment | Comment `@claude <your request>` |
| Pull request review comment | Comment `@claude` on a specific line |
| Pull request review | Submit a review with `@claude` in the body |

### Example prompts

```
@claude implement the feature described in this issue and open a PR

@claude review this PR and check for accessibility issues

@claude what does the SectionHeader component do?

@claude the build is failing, can you investigate and fix it?
```

Claude reads `CLAUDE.md` automatically on every run, so project conventions
(branch naming, build requirements, no hardcoded colours, etc.) are always in context.

---

## Security

The `if:` condition in the workflow checks `author_association` before running.
Only users with **OWNER**, **MEMBER**, or **COLLABORATOR** status can trigger Claude.

This means:
- You (the repo owner) can always trigger Claude
- Invited collaborators can trigger Claude
- If the repo is ever made public, random users creating issues or comments **cannot** trigger Claude

This is enforced by GitHub, not by Claude — the workflow job simply won't start for unauthorised users.

---

## Required secrets

| Secret name | How to get it | Status |
|---|---|---|
| `CLAUDE_CODE_OAUTH_TOKEN` | Run `claude setup-token` in your terminal | ⚠️ Must be set — see below |

The `APP_ID` and `APP_PRIVATE_KEY` secrets that were previously in use have been
removed from the workflow. They are no longer needed.

### Setting up CLAUDE_CODE_OAUTH_TOKEN

This token authenticates Claude with your Claude.ai Pro or Max subscription.
It does not require a paid Anthropic API account.

**Steps:**

1. Install the Claude Code CLI if you haven't already:
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```

2. Log in and generate the token:
   ```bash
   claude setup-token
   ```
   Copy the token it outputs.

3. Add it to GitHub:
   - Go to **Settings → Secrets and variables → Actions**
   - Click **New repository secret**
   - Name: `CLAUDE_CODE_OAUTH_TOKEN`
   - Value: paste the token
   - Save

> **Token expiry:** OAuth tokens expire. If Claude stops responding in the future,
> re-run `claude setup-token` and update the secret.

---

## Workflow permissions

The workflow requests these GitHub permissions:

| Permission | Why |
|---|---|
| `contents: write` | Claude can read and write code files |
| `pull-requests: write` | Claude can create PRs and leave review comments |
| `issues: write` | Claude can comment on issues |
| `id-token: write` | Required by the action internals |
| `actions: read` | Claude can read CI results to diagnose build failures |

---

## Troubleshooting

### Claude is not responding

1. **Check the secret** — go to Settings → Secrets and confirm `CLAUDE_CODE_OAUTH_TOKEN` exists and is not empty. If you haven't run `claude setup-token` yet, do that first.

2. **Check the workflow ran** — go to the Actions tab and look for a "Claude Code" run corresponding to your comment. If the run is **skipped**, your `author_association` is not OWNER/MEMBER/COLLABORATOR. If there is **no run at all**, check that the workflow is enabled.

3. **Check the workflow is on the right branch** — the workflow file must be on the branch that `main` points to. If you only pushed to a feature branch, it won't run.

4. **Token expired** — if it was working before and stopped, re-run `claude setup-token` and update the secret.

### Claude starts but immediately fails (exit code 1)

This almost always means the `CLAUDE_CODE_OAUTH_TOKEN` secret is missing, empty, or expired.
Run `claude setup-token` locally and update the secret in GitHub.

### Claude is using `github-actions[bot]` as author

This is expected with the current setup. The action uses the built-in `GITHUB_TOKEN`
for GitHub operations. If you want commits attributed to a custom bot name, a
custom GitHub App with `APP_ID` / `APP_PRIVATE_KEY` and the `github_token` input
can be added back — but it is not required for functionality.

---

## Limitations

- **Token expiry** — the OAuth token from `claude setup-token` expires periodically and must be refreshed manually.
- **No automatic runs** — Claude only runs when explicitly mentioned with `@claude`. It does not run automatically on every new issue or PR unless `@claude` is in the body.
- **Private repo only** (currently) — the `author_association` security filter is especially important if the repo is ever made public.
- **Turn limit** — Claude is limited to 80 turns per run (`--max-turns 80`). Very large tasks may need to be broken into smaller issues.

---

## Issue → branch → review → merge workflow

The intended flow for feature work:

1. **Open a GitHub issue** describing the feature or bug. Include `@claude` in the body to have Claude start immediately, or add it in a comment after.
2. **Claude reads the issue**, checks out the repo, creates a branch (`claude/<feature-name>`), implements the work, and opens a PR against `develop`. Note: the `claude/` prefix is used automatically by the GitHub Actions runner — this is distinct from the `ai/` prefix required for manual AI work per `AGENTS.md`.
3. **Review the PR** — leave comments or a review with `@claude` to ask Claude to revise.
4. **Merge the PR** into `develop`, then promote via the standard `develop` → `test` → `main` path.

Claude follows the conventions in `CLAUDE.md` automatically: branching from `develop`,
running `npm run build` before committing, using Tailwind design tokens, etc.

---

## GitHub Copilot

### Entry point

Copilot reads `.github/copilot-instructions.md` automatically on every PR review and cloud agent task. This is Copilot's equivalent of `CLAUDE.md`.

### Custom instruction files

Three instruction files teach Copilot the repo's conventions:

| File | Scope | Limit |
|------|-------|-------|
| `.github/copilot-instructions.md` | Repo-wide — read on every review | First **4,000 chars** only for code review |
| `.github/instructions/astro.instructions.md` | `*.astro` files — deep Astro patterns | No limit (read in full by cloud agent + chat) |
| `.github/instructions/typescript.instructions.md` | `*.ts` files — Zod, types, patterns | No limit |

When updating hard rules in `AGENTS.md`, update the matching Copilot file too.

### Requesting a Copilot code review

```bash
gh pr edit {PR_NUMBER} --add-reviewer copilot-pull-request-reviewer
```

Or use the GitHub web UI: Reviewers → type "Copilot".

### Responding to Copilot review feedback

See `docs/ai/workflow.md` — the full review response process is documented there. In short:

1. Fetch inline comments: `gh api repos/OWNER/REPO/pulls/PR/comments --jq '...'`
2. Fix every comment — reply inline per thread with `gh api .../comments/ID/replies -X POST -f body="..."`
3. Build, commit, push
4. Post a summary PR comment, then re-request review: `gh pr edit PR --add-reviewer copilot-pull-request-reviewer`

### Reference

- Copilot instructions docs: https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions
- Copilot agents docs: https://docs.github.com/en/copilot/how-tos/use-copilot-agents

---

## Claude Reference

- Official action: https://github.com/anthropics/claude-code-action
- Official docs: https://code.claude.com/docs/en/github-actions
- Workflow file: `.github/workflows/claude.yml`
- Project conventions: `CLAUDE.md` → `AGENTS.md`
