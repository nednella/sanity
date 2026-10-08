---
description: Work issue <n> end to end: branch in a worktree, build, verify, draft PR
argument-hint: <issue number>
---

Work issue #$ARGUMENTS on `nednella/sanity`, start to finish, without waiting for
the owner unless a decision is genuinely theirs. Read `AGENTS.md` first; its hard rules apply.

## 1. Understand

- `gh issue view $ARGUMENTS --comments`. The `## Description` is the owner's; never edit it.
- Read the code the issue touches before planning, and the conventions in `AGENTS.md`.
- If the issue allows more than one reasonable reading, pick the simplest and say so in
  your Agent Review (step 5); do not stop to ask.
- If the task needs a decision only the owner can make (a schema change on live data, a new
  dependency, anything in the hard rules), say so in your Agent Review and stop.

## 2. Branch

Make the worktree as `AGENTS.md` § Worktree says: `trees/issue-$ARGUMENTS` on branch
`issue-$ARGUMENTS` from `origin/main`, env files copied, dependencies installed.
Work only inside it. Never touch the tree the owner is sitting in.

## 3. Build

- Smallest change that closes the issue. Match the code around it. No new
  dependencies without a reason in the PR.
- A server route change regenerates the API types in the same change (`AGENTS.md` § Commands).
- A schema change ships its migration from `db:generate`; never apply it.

## 4. Verify

- Run typecheck, lint, format and build from `AGENTS.md` § Commands. All must pass.
- For anything visible or any route change, run the app on spare ports and check it by
  hand, as `AGENTS.md` § Checking by hand says.
- Never claim something works that you did not run.

## 5. Deliver

- Commits as `AGENTS.md` § Commits says.
- Append to the issue, below the owner's text, a section headed `## Agent Review`: what you
  found, what you changed and why, what you verified and how, anything you chose
  between. Short, plain sentences.
- `git push -u origin issue-$ARGUMENTS`, then
  `gh pr create --draft --assignee @me --title "<subject>" --body "<Description heading, then the summary; Closes #$ARGUMENTS>"`.
- Never `gh pr merge`, never `gh pr ready`, never request reviewers. The owner merges.
- Clean up: stop every process you started, by PID.
- Report in a few lines: the PR link, what you verified, what the owner still has to do
  (for example, apply a migration).
