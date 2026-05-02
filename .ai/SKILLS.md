# AI Worker Skills

This file is the human-readable skill layer for AI workers.

YAML files define structured configuration. This Markdown file defines how the worker should behave when using that configuration.

## Startup Skill

When a worker starts:

1. Read `AGENTS.md`.
2. Read `.ai/manifest.yml`.
3. Read this file.
4. Read `.ai/project.yml`.
5. Read `.ai/workspace/workspace.yml` and the shared workspace standards.
6. Follow the manifest `load_order`.
7. Select the correct role module from `.ai/role/<role-id>/`.
8. Read the role module in this order: `role.yml`, `interface.yml`, `playbook.md`, `checklist.md`, `workspace.yml`.
9. Create or update the current phase log.
10. For parallel work, read `.ai/global/parallel.delivery.yml` and name the work item, lane, upstream handoff, locked contracts, and dependencies.

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
- MVP, slice, or work item id when work is parallel
- Lane and upstream handoff when another lane has unlocked this work
- Shared stack, style, tools, project structure, and QA standards

The worker should make the smallest useful change that completes the current phase goal and preserves downstream handoff quality.

## Parallel Delivery Skill

Work may move in parallel by MVP, slice, or work item.

Use `.ai/global/parallel.delivery.yml` when:

- Business, product, or design handed work to engineering and wants to continue the next phase or next MVP.
- Engineering, QA, release, monitoring, or measurement is still working on an earlier MVP.
- One lane is blocked but unrelated lanes can continue.
- A handoff contract changed after downstream work started.

Rules:

1. Name the work item/MVP in every log, report, handoff, and commit when work is parallel.
2. Keep a lane-specific phase log.
3. Do not change repo `current_phase` for parallel lane work unless the orchestrator explicitly sets it.
4. Treat handoff as a locked contract for that work item.
5. Create an impact report before changing locked scope, acceptance criteria, design, API, data, or release expectations.
6. Escalate shared dependency conflicts to the orchestrator.

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

## Commit Skill

Every agent position can commit when its assigned task is done.

The worker must:

1. Use one of the 15 agent ids in `.ai/global/agent.positions.yml`.
2. Keep the real Git author account.
3. Prefix the commit subject with the agent id.
4. Include `AI-Agent`, `AI-Role`, `AI-Phase`, `AI-Task-Done`, and `AI-Evidence` trailers.
5. Set `AI-Task-Done: yes` only when the assigned task is complete.
6. Link evidence from the phase log, impact report, handoff note, tests, review, or deployment output.
7. Add `AI-Work-Item` and `AI-Lane` trailers when the commit belongs to parallel MVP/work item delivery.

If the task is not done, do not create a done commit. Create or update a handoff, impact report, or blocker note instead.

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
