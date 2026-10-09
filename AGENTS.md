<!-- Set up by agentos: https://github.com/nednella/agentos -->

# AGENTS.md

sanity: website, API and Discord bot for the Sanity OSRS clan. A pnpm workspace, Node 24.

`apps/server` Fastify + Zod + Drizzle on Postgres (`docker-compose.yaml`) · `apps/web` Vite +
React + TanStack Router/Query + daisyUI, deployed to Vercel · `apps/bot` discord.js 14 ·
`packages/api` the typed API client, generated from the server's OpenAPI spec ·
`packages/urls` every URL constant.

## Hard rules

- Never touch the database beyond reading it. A session may write a migration with
  `db:generate`, but never runs `db:migrate`, `db:bootstrap`, `db:port`, any `catalogue:*`,
  `wom:*` or `rank:check` script. The owner applies migrations by hand.
- Never run the bot. It logs in as the real bot and re-registers its commands on the live server.
- Stop only the processes you started, by their PID. Never `pkill`, `killall` or kill by a
  name pattern: one killed the owner's dev server.
- Never use the ports the owner's dev servers hold; use the spare ports below.
- Never `git reset --hard`, never push `main`. Push only your own `issue-<n>` branch.
- Draft PRs only; never merge, mark ready or request reviewers.
- Never edit `BACKLOG.md`, `HANDOFF.md`, `NOTES.md` or `ROADMAP.md`. They are the owner's and untracked.

## Worktree

```
git fetch origin
git worktree add worktrees/issue-<n> -b issue-<n> origin/main
cd worktrees/issue-<n>
for app in bot server web; do cp ../../apps/$app/.env apps/$app/.env; done
pnpm install
```

Branch from `origin/main`, never local `main`. Work only inside the worktree. `worktrees/` is in
`.gitignore`.

## Commands

Run from the worktree root. There are no tests yet; these are the gate.

| What                                      | Command                                                                     |
| ----------------------------------------- | --------------------------------------------------------------------------- |
| Typecheck all projects                    | `pnpm typecheck`                                                            |
| Lint                                      | `pnpm lint`                                                                 |
| Format check                              | `pnpm format` (fix: `pnpm format:fix`)                                      |
| Build the web                             | `pnpm build`                                                                |
| Regenerate API types after a route change | `pnpm --filter @sanity/server openapi && pnpm --filter @sanity/api openapi` |
| Write a migration after a schema change   | `pnpm --filter @sanity/server db:generate`                                  |

## Checking by hand

Run on spare ports; the shell values win over each app's `.env`:

```
PORT=3101 CORS_ORIGIN=http://localhost:5174 pnpm --filter @sanity/server start
VITE_API_URL=http://localhost:3101 pnpm --filter @sanity/web exec vite --port 5174 --strictPort
```

- API: `curl` the route on `http://localhost:3101`. Scalar docs are at `/docs`.
- Web: open `http://localhost:5174` with `agentos browser`, look at the change, and file a
  screenshot with `agentos browser screenshot --caption "..."`.
- Stop both by PID when done.

## Code

- Server: modules under `src/modules/<name>` with `request.ts`, `response.ts`, `router.ts`,
  `repository/`, `service/`. Repositories live in the module that owns the table; services
  only when composing reads. Routes spread the contract definition plus a handler, grouped in
  `src/routes.ts` by caller: public, auth, admin (`/admin`). Default inputs at the schema edge,
  no undefined checks further in.
- Bot: one folder per command under `commands/admin` or `commands/public`, `command.ts` and
  `handler.ts`, via `defineCommand`. Register it in `commands/index.ts`. Stubs wait in `commands/todo`.
- Web: route files name their component `Page` or `Layout`.
- Base URLs go in named constants in `packages/urls`.
- Private declarations first, exports last. Objects with two or more entries span lines.
  Sort register calls, contract keys and similar lists alphabetically.
- No comments, except for a non-obvious why.

## Commits

Conventional, enforced by commitlint: `type(scope): subject`, scope `server`, `web`, `bot`,
`api` or `urls`, none for cross-cutting work. One subject line, no body, then the
`Co-Authored-By` trailer. One logical change per commit. A new server module is exactly
`feat(server): add <name> module`.

## Workflow

Issues on `nednella/sanity` are the queue. One issue → branch `issue-<n>` in
`worktrees/issue-<n>` → one draft PR → the owner merges. Issues follow
`.github/ISSUE_TEMPLATE/issue.md`: a `## Description` written by the owner and never edited by
a session; a session posts its findings as an issue comment headed `## Agent Review`.

A branch takes `main`'s changes by a rebase onto `origin/main`, never a merge of `main`. Push
after a rebase with `--force-with-lease`.
