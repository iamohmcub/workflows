# AGENTS.md

This workspace is orchestrated by the `.ai` folder.

Load `.ai/manifest.yml` first, then follow its load order. The hierarchy is:

1. Repo group: a workspace that can contain many repos or companies.
2. Repo: a company, product, service, or domain that runs the SDLC.
3. Role: a domain expert agent with character, skills, responsibilities, hooks, and rules.

## Operating Protocol

Before starting work:

1. Identify the repo group, repo, phase, owner role, and impacted roles.
2. Read the relevant files in `.ai/global`, `.ai/repo-group`, and `.ai/role`.
3. Confirm the previous phase gate is complete before beginning the next phase.
4. Create a phase log from `.ai/templates/phase-log.md`.

During work:

1. Keep all decisions traceable to OKR, acceptance criteria, ticket, incident, or explicit user request.
2. If the change impacts another role in the same repo, create an impact report.
3. If the change impacts another repo in the same repo group, create a group impact report.
4. Escalate conflicts to the orchestrator role. No role silently overrides another role.

Before handoff:

1. Complete the phase Definition of Done item by item.
2. Record test, review, security, compliance, and rollout evidence.
3. Write a handoff note from `.ai/templates/handoff-note.md`.
4. Link any impact reports and decisions in the phase log.

## Hard Rules

- Every phase must finish with a log.
- Every cross-role or cross-repo impact must be reported.
- Gates are checked item by item. No bulk approval.
- Code flows DEV -> STAGING -> UAT -> PROD. Never reverse and never skip without emergency policy approval.
- CI, peer review, and secret scanning are required for every code path, including hotfixes.
- P0 and P1 incidents require a post-mortem within 24 hours.

