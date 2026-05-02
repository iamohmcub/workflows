# New Project Setup

Use this checklist when creating a new project that should follow this `.ai` orchestration system.

## 1. Copy the System

Copy these into the root of the new project:

- `AGENTS.md`
- `.ai/`

Keep `AGENTS.md` at the repository root so AI coding tools can find it automatically.

## 2. Configure Project Identity

Edit `.ai/project.yml`.

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

Do not remove `orchestrator`.

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
4. Read `.ai/project.yml`.
5. Load global rules, hooks, phases, repo group policy, and role files.
6. Create a phase log.
7. Work only inside the current phase unless the orchestrator changes phase.

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
Follow the .ai load order.
Identify the repo group, repo, current phase, owner role, supporting roles, and impacted roles.
Create a phase log.
Then continue the current phase using the correct role definition.
```

## 8. Demo

To see the full shape before using it in a real repo, read:

- `DEMO.md`
- `.ai/examples/demo-project.yml`
- `.ai/examples/demo-worker-run.md`
- `.ai/examples/runtime/logs/2026-05-02-okr-checkout-service.md`

## 9. Commands and Automation

Command reference:

- `COMMANDS.md`

Automation trigger reference:

- `.ai/AUTOMATION.md`

Most common first commands:

```bash
npm run ai:init -- --repo-id my-service --repo-name "My Service" --phase okr
npm run ai:status
npm run ai:start -- okr
npm run ai:validate
```
