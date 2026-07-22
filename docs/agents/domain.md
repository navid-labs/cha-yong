# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root, or
- **`CONTEXT-MAP.md`** at the repo root if it exists — it points at one `CONTEXT.md` per context. Read each one relevant to the topic.
- **`docs/adr/`** — read ADRs that touch the area you're about to work in. In multi-context repos, also check `src/<context>/docs/adr/` for context-scoped decisions.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

> As of 2026-07-23 neither `CONTEXT.md` nor `docs/adr/` exists yet. That is the expected starting state — do not create them preemptively.

## Layout: single-context (MVP)

Root `CONTEXT.md` + a single `docs/adr/`.

```
/
├── CONTEXT.md
├── docs/adr/
└── src/
```

Decided 2026-07-23. The rationale, so it doesn't have to be re-derived:

- `package.json` declares no `workspaces`; there is no separate `server/`, `worker/`, `apps/`, or `packages/`.
- Server Components import Prisma directly (`(public)/list`, `(public)/detail/[id]`, `(protected)/chat`, `admin/escrow`, …). There is no physical frontend/backend boundary, so splitting along that line would put a single `page.tsx` in two contexts at once.
- One Prisma schema (12 models / 17 enums) is shared everywhere. `Listing` and `EscrowStatus` mean the same thing in `(public)`, `admin`, and `api` — the ubiquitous language has not forked.

The 11 directories under `src/features/` (admin, chat, payment, blog, capital, …) are **subdomains inside one language**, not separate bounded contexts.

### When to promote to multi-context

Split `CONTEXT.md` and add a root `CONTEXT-MAP.md` once any of these holds:

- The same word starts meaning **different things** in different areas (e.g. a dealer-facing "매물" that is not the consumer-facing "매물").
- A workspace or separate deployment unit appears (settlement worker, dealer-only app).
- The Prisma schema splits into more than one.

Target layout at that point:

```
/
├── CONTEXT-MAP.md
├── docs/adr/                          ← system-wide decisions
└── src/
    ├── <context-a>/
    │   ├── CONTEXT.md
    │   └── docs/adr/                  ← context-specific decisions
    └── <context-b>/
        ├── CONTEXT.md
        └── docs/adr/
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders) — but worth reopening because…_
