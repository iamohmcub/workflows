# AGENTS.md

This workspace is orchestrated by the `.ai` folder.

Load `.ai/manifest.yml` first, read `.ai/SKILLS.md`, then follow the manifest load order. The hierarchy is:

1. Repo group: a workspace that can contain many repos or companies.
2. Repo: a company, product, service, or domain that runs the SDLC.
3. Role: a domain expert agent with character, skills, responsibilities, hooks, and rules.

## Operating Protocol

Before starting work:

1. Identify the repo group, repo, phase, owner role, and impacted roles.
2. Read `.ai/project.yml` for this project's identity, lifecycle mode, and active roles.
3. Read `.ai/workspace/workspace.yml` and the shared standards in `.ai/workspace`.
4. Read the relevant files in `.ai/global`, `.ai/repo-group`, and the selected `.ai/role/<role-id>/` module.
5. Read the selected role workspace overlay at `.ai/role/<role-id>/workspace.yml`.
6. Read `.ai/global/worker.contract.yml`, `.ai/global/event.contract.yml`, and `.ai/global/routing.matrix.yml`.
7. Confirm the previous phase gate is complete before beginning the next phase.
8. Create a phase log from `.ai/templates/phase-log.md`.
9. For parallel work, identify the MVP/work item, lane, upstream handoff, locked contracts, and dependencies from `.ai/global/parallel.delivery.yml`.

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

## Parallel Delivery Rule

This workflow supports parallel work by MVP, slice, or work item.

- Product, business, and design roles may continue the next phase or next MVP after they hand off a locked contract to the downstream owner.
- Engineering, QA, release, monitoring, and measurement can continue their own lanes for earlier MVPs at the same time.
- A gate is scoped to the work item by default. A blocked gate for one MVP does not block unrelated MVPs.
- Shared API, data, design system, environment, security, compliance, customer, or repo-group dependencies can block multiple lanes.
- Any change after handoff to locked scope, acceptance criteria, design, API, data, or release expectations requires an impact report.
- Parallel phase logs must name the work item/MVP, lane, upstream handoff, downstream owner, dependencies, and evidence.

## Provider-Neutral Runtime

The `.ai` folder is the portable workflow standard. It must be understandable by any AI worker, human operator, hosted AI, local LLM, CLI, plugin, or future runner.

Always follow:

- `.ai/global/worker.contract.yml` for provider-neutral worker behavior.
- `.ai/global/event.contract.yml` for trigger and event shape.
- `.ai/global/routing.matrix.yml` for accountable, responsible, consulted, and informed roles.
- `.ai/runtime/state.yml` for current runtime context.

Adapters and plugins are optional engines. They may automate dispatch, queue processing, validation, notification, or gate enforcement, but they must not replace `.ai` as the source of truth.

If no adapter or plugin is present, the AI worker still follows the same files manually.

## Hard Rules

- Every phase must finish with a log.
- Every cross-role or cross-repo impact must be reported.
- Every `impact.detected` event blocks the next gate until the impacted owner acknowledges it or the orchestrator accepts the risk.
- Phase ownership does not replace task routing. Use `.ai/global/routing.matrix.yml` to identify responsible, consulted, and informed roles.
- Gates are checked item by item. No bulk approval.
- Code flows DEV -> STAGING -> UAT -> PROD. Never reverse and never skip without emergency policy approval.
- CI, peer review, and secret scanning are required for every code path, including hotfixes.
- P0 and P1 incidents require a post-mortem within 24 hours.

## New Project Setup

When this `.ai` system is copied into a new project:

1. Edit `.ai/project.yml`.
2. Edit `.ai/workspace/workspace.yml`.
3. Set the real repo group, repo id, repo name, product type, workspace profile, environments, and active roles.
4. Keep `AGENTS.md` at the repo root.
5. Start every AI worker with the prompt in `.ai/templates/worker-startup-prompt.md`.
6. Use `.ai/PROJECT_SETUP.md` as the full checklist.

## Agent Commit Rule

Every agent position can commit when its assigned task is done:

1. Agent Jobs (`prompter-agent`)
2. Agent Conway (`orchestrator-agent`)
3. Agent Drucker (`product-manager-agent`)
4. Agent Nightingale (`data-analyst-agent`)
5. Agent Rams (`designer-agent`)
6. Agent Kano (`product-owner-agent`)
7. Agent Turing (`tech-lead-agent`)
8. Agent Berners (`frontend-agent`)
9. Agent Hopper (`backend-agent`)
10. Agent Mitnick (`security-agent`)
11. Agent Brandeis (`legal-agent`)
12. Agent Deming (`qa-agent`)
13. Agent Gene (`devops-agent`)
14. Agent Shewhart (`monitoring-agent`)
15. Agent Holmes (`auditor-agent`)

Commit subject format:

```text
<agent-callsign>: <completed task summary>
```

Required commit trailers:

```text
AI-Agent-Name: <agent-callsign>
AI-Agent: <agent-id>
AI-Role: <role-id>
AI-Phase: <phase-id>
AI-Task-Done: yes
AI-Evidence: <phase log, report, handoff, test, or review link>
```

For parallel MVP/work item commits, also include `AI-Work-Item` and `AI-Lane`.

Keep the real Git author account. Put the agent callsign and stable id in the commit subject and trailers.

## Commands

Use `COMMANDS.md` for the local command reference.

Common commands:

```bash
npx @iamohmcub/ai-orchestration status
npx @iamohmcub/ai-orchestration start okr
npx @iamohmcub/ai-orchestration start technical-design --mvp mvp-1 --lane engineering-delivery --depends-on ".ai/runtime/handoffs/<handoff>.md"
npx @iamohmcub/ai-orchestration trigger on_phase_start --phase okr
npx @iamohmcub/ai-orchestration impact --title "Analytics contract changed" --phase okr
npx @iamohmcub/ai-orchestration handoff --from product-manager --to ux-designer --phase okr
npx @iamohmcub/ai-orchestration validate
```

Automation trigger documentation lives in `.ai/AUTOMATION.md`.

## Role Module Layout

Every role is a folder:

```text
.ai/role/<role-id>/
|-- role.yml
|-- interface.yml
|-- playbook.md
|-- checklist.md
`-- workspace.yml
```

Load all five files before acting as that role. The role `workspace.yml` extends the shared company standards in `.ai/workspace`.
