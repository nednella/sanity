---
# Set up by agentos: https://github.com/nednella/agentos
description: "Work issue <n> end to end: branch in a worktree, build, verify, draft PR"
argument-hint: <issue number>
---

Work issue #$ARGUMENTS start to finish, without waiting for the owner unless a decision is genuinely theirs. Read `AGENTS.md` first; its hard rules apply.

## 1. Understand

- `gh issue view $ARGUMENTS --comments` and read every comment. The issue body is the owner's; never edit it.
- Read the code the issue touches before planning.
- If the issue allows more than one reasonable reading, pick the simplest and say so in your Agent Review (step 5); do not stop to ask.

## 2. Branch

Make a worktree on branch `issue-$ARGUMENTS` from the default branch on origin, where and with the set-up `AGENTS.md` names. Work only inside it.

## 3. Build

- Smallest change that closes the issue. Match the code around it. No new dependencies without a reason in the PR.
- Tests beside the code they cover.

## 4. Verify

- Run the tests, linters and build that `AGENTS.md` names, and check the change by hand as it says.
- Never claim something works that you did not run.

## 5. Deliver

- Commit in the style `AGENTS.md` names, one logical change each.
- Post a comment on the issue headed `## Agent Review`, with `gh issue comment $ARGUMENTS --body-file -`: what you found, what you changed and why, what you verified and how, anything you chose between. Short, plain sentences.
- `git push -u origin issue-$ARGUMENTS`, then `gh pr create --draft --assignee @me --title "<subject>" --body "<summary; Closes #$ARGUMENTS>"`.
- Never `gh pr merge`, never `gh pr ready`, never request reviewers. The owner merges.
- Report in a few lines: the PR link, what you verified, what is left to the owner.
