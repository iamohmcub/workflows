# New Project Setup

Use this checklist when creating a new project that should follow this `.ai` orchestration system.

## 1. Copy the System

Copy these into the root of the new project:

- `AGENTS.md`
- `.ai/`

Keep `AGENTS.md` at the repository root so AI coding tools can find it automatically.

## 2. Configure Project Identity

Edit `.ai/project.yml`.

Then edit `.ai/workspace/workspace.yml` for company or repo-group standards.

Minimum fields to change:

- `project.repo_group.id`
- `project.repo_group.name`
- `project.repo.id`
- `project.repo.name`
- `project.repo.type`
- `project.repo.description`
- `project.lifecycle.current_phase`
- `project.roles.active`
- `project.environments.enabled`
- `workspace.id`
- `workspace.name`
- `workspace.profile`

## 3. Choose Active Roles

Keep all roles for a full software development lifecycle.

For a smaller project, you may start with:

- `orchestrator`
- `product-manager`
- `tech-lead`
- `frontend-engineer` or `backend-engineer`
- `qa-sdet`
- `devops-platform`
- `security-engineer`
- `process-auditor`

Do not remove `orchestrator`. Keep `process-auditor` when you need independent gate and evidence verification.

## 4. Start the First Phase

Most new projects begin at `okr` or `prd`.

Use `okr` when the goal is still unclear.

Use `prd` when the business goal is known and you need to define scope, acceptance criteria, and release expectations.

Use `technical-design` only when the product scope and acceptance criteria already exist.

## 5. Start the AI Worker

Use the prompt in `.ai/templates/worker-startup-prompt.md`.

The worker should then:

1. Read `AGENTS.md`.
2. Read `.ai/manifest.yml`.
3. Read `.ai/SKILLS.md`.
4. Read `.ai/global/agent.positions.yml`.
5. Read `.ai/global/parallel.delivery.yml`.
6. Read `.ai/project.yml`.
7. Read `.ai/workspace/workspace.yml` and the shared workspace standards.
8. Load global rules, hooks, phases, repo group policy, and the selected role module.
9. Load the selected role workspace overlay.
10. Create a phase log.
11. Work only inside the current phase unless the orchestrator changes phase.
12. For parallel MVP work, keep lane-specific phase logs and do not move repo current phase unless orchestrator sets it.
13. Commit completed work with the correct agent id when the assigned task is done.

Role modules live at `.ai/role/<role-id>/` and each module contains `role.yml`, `interface.yml`, `playbook.md`, `checklist.md`, and `workspace.yml`.

Useful command:

```bash
npm run ai:status
```

## 6. Evidence Rules

The worker must create:

- Phase logs in `.ai/runtime/logs`
- Impact reports in `.ai/runtime/reports`
- Decision logs in `.ai/runtime/decisions`
- Handoff notes in `.ai/runtime/handoffs`

The phase is not complete until the log and evidence exist.

## 7. Suggested First Worker Message

```text
Read AGENTS.md, .ai/manifest.yml, .ai/SKILLS.md, and .ai/project.yml.
Read .ai/global/agent.positions.yml.
Read .ai/global/parallel.delivery.yml.
Read .ai/workspace/workspace.yml and the shared workspace standards.
Follow the .ai load order.
Identify the repo group, repo, current phase, MVP/work item, lane, owner role, supporting roles, and impacted roles.
Create a phase log.
Then continue the current phase using the correct role definition.
```

## 8. Commands and Automation

Command reference:

- `COMMANDS.md`

Automation trigger reference:

- `.ai/AUTOMATION.md`

Most common first commands:

```bash
npm run ai:init -- --repo-id my-service --repo-name "My Service" --phase okr --workspace-profile web-saas
npm run ai:status
npm run ai:start -- okr
npm run ai:start -- technical-design --mvp mvp-1 --lane engineering-delivery --depends-on ".ai/runtime/handoffs/<handoff>.md"
npm run ai:commit -- --agent orchestrator-agent --message "route initial idea" --evidence ".ai/runtime/logs/<phase-log>.md"
npm run ai:validate
```
