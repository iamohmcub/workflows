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

Role modules live at `.ai/role/<role-id>/` and each module contains `role.yml`, `interface.yml`, `playbook.md`, `checklist.md`, and `workspace.yml`.

Useful command:

```bash
npx @iamohmcub/ai-orchestration status
```

## 6. Evidence Rules

The worker must create:

- Phase logs in `.ai/runtime/logs`
- Pending events in `.ai/runtime/queue`
- Completed events in `.ai/runtime/events`
- Impact reports in `.ai/runtime/reports`
- Decision logs in `.ai/runtime/decisions`
- Handoff notes in `.ai/runtime/handoffs`

The phase is not complete until the log and evidence exist.

## 7. Suggested First Worker Message

```text
Use .ai/templates/worker-startup-prompt.md, then continue the current phase using the correct role definition.
```

## 8. Commands and Automation

Optional command reference:

- `COMMANDS.md` when installed with `--commands`

Automation trigger reference:

- `.ai/AUTOMATION.md`

Most common first commands:

```bash
npx @iamohmcub/ai-orchestration init --repo-id my-service --repo-name "My Service" --phase okr --workspace-profile web-saas
npx @iamohmcub/ai-orchestration status
npx @iamohmcub/ai-orchestration start okr
npx @iamohmcub/ai-orchestration start technical-design --mvp mvp-1 --lane engineering-delivery --depends-on ".ai/runtime/handoffs/<handoff>.md"
npx @iamohmcub/ai-orchestration commit --agent Conway --message "route initial idea" --evidence ".ai/runtime/logs/<phase-log>.md"
npx @iamohmcub/ai-orchestration validate
```
