# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo's issue tracker.

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

Identity mapping — the canonical names are used verbatim. All five exist in `navid-labs/cha-yong`: `wontfix` was already there (GitHub's default label, reused as-is), the other four were created on 2026-07-23.

These are a **state** axis. They sit alongside the repo's existing **kind** labels (`bug`, `enhancement`, `documentation`, `question`, …) rather than replacing them — an issue can be both `bug` and `ready-for-agent`.

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

Edit the right-hand column to match whatever vocabulary you actually use.
