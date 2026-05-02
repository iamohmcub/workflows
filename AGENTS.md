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
6. Confirm the previous phase gate is complete before beginning the next phase.
7. Create a phase log from `.ai/templates/phase-log.md`.

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

1. `prompter-agent`
2. `orchestrator-agent`
3. `product-manager-agent`
4. `data-analyst-agent`
5. `designer-agent`
6. `product-owner-agent`
7. `tech-lead-agent`
8. `frontend-agent`
9. `backend-agent`
10. `security-agent`
11. `legal-agent`
12. `qa-agent`
13. `devops-agent`
14. `monitoring-agent`
15. `auditor-agent`

Commit subject format:

```text
<agent-id>: <completed task summary>
```

Required commit trailers:

```text
AI-Agent: <agent-id>
AI-Role: <role-id>
AI-Phase: <phase-id>
AI-Task-Done: yes
AI-Evidence: <phase log, report, handoff, test, or review link>
```

Keep the real Git author account. Put the agent identity in the commit subject and trailers.

## Commands

Use `COMMANDS.md` for the local command reference.

Common commands:

```bash
npm run ai:status
npm run ai:start -- okr
npm run ai:trigger -- on_phase_start --phase okr
npm run ai:impact -- --title "Analytics contract changed" --phase okr
npm run ai:handoff -- --from product-manager --to ux-designer --phase okr
npm run ai:validate
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
