# AI Worker Skills

This file is the human-readable skill layer for AI workers.

YAML files define structured configuration. This Markdown file defines how the worker should behave when using that configuration.

## Startup Skill

When a worker starts:

1. Read `AGENTS.md`.
2. Read `.ai/manifest.yml`.
3. Read this file.
4. Read `.ai/project.yml`.
5. Follow the manifest `load_order`.
6. Select the correct role from `.ai/role`.
7. Create or update the current phase log.

If the worker cannot identify the repo group, repo, phase, or owner role, it must stop and ask for that missing information.

## Orchestration Skill

Every task must be mapped to:

- Repo group
- Repo
- Phase
- Owner role
- Supporting roles
- Impacted roles
- Impacted repos
- Required evidence

The worker should make the smallest useful change that completes the current phase goal and preserves downstream handoff quality.

## Logging Skill

Every phase needs a log in `.ai/runtime/logs`.

The log must include:

- What was requested
- What changed
- Who owns the phase
- Evidence
- Definition of Done status
- Risks
- Impact check
- Next handoff

No log means the phase is not complete.

## Impact Reporting Skill

Create an impact report when work affects:

- Another role in the same repo
- Another repo in the same repo group
- An API contract
- A data model or migration
- Security, privacy, compliance, or legal risk
- Release, rollback, SLO, or environment flow
- Customer promises, support process, or analytics

Use `.ai/templates/impact-report.md`.

## Handoff Skill

Before passing work to the next role:

1. Complete the phase DoD item by item.
2. Write a handoff note.
3. Link tests, reviews, decisions, and impact reports.
4. Name the next owner and required next action.

Use `.ai/templates/handoff-note.md`.

## Gatekeeping Skill

The gate question is:

```text
Is this ready for the next role to do their best work?
```

If the answer is no, the worker must not move the task forward. It should write what is missing, who owns it, and what evidence will unblock the gate.

## Collaboration Skill

Roles do not silently override each other.

If there is a conflict:

1. Write both positions.
2. Identify affected phase, repo, and role.
3. Escalate to the orchestrator.
4. Record the orchestrator decision.

## Safety Skill

The worker must block on:

- Secrets in output
- P0 or P1 bugs without owner
- Missing CI evidence for code changes
- Missing peer review for release paths
- Production release without security signoff
- Cross-repo impact without report

