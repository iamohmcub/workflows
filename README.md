# AI Engineering Workflows

Reusable `.ai` workflow system for AI workers, repo groups, repos, roles, logs, impact reports, and handoffs.

## Install Into Any Repo

Use the npm scaffolding CLI from any project, including Node, Go, Python, mobile, infra, or documentation repos:

```bash
npx @iamohmcub/ai-orchestration init -- \
  --repo-group-id acme-platform \
  --repo-group-name "Acme Platform" \
  --repo-id checkout-service \
  --repo-name "Checkout Service" \
  --type product-service \
  --phase okr \
  --workspace-profile web-saas
```

This creates or updates `.ai/`, `AGENTS.md`, `COMMANDS.md`, `scripts/ai-workflow.mjs`, and npm helper scripts. Use `--minimal` if you only want `.ai/`, `AGENTS.md`, and `COMMANDS.md`.

## What This Repo Gives You

Copy this into a project and the AI worker gets:

- `AGENTS.md`: root instruction file.
- `.ai/manifest.yml`: canonical load order.
- `.ai/project.yml`: project identity and current phase.
- `.ai/workspace/`: shared company standards for stack, style, structure, tools, and QA.
- `.ai/role/<role-id>/`: role modules with config, interface, playbook, checklist, and workspace overlay.
- `.ai/global/agent.positions.yml`: 15 agent positions and commit authority.
- `.ai/global/worker.contract.yml`: provider-neutral AI worker contract.
- `.ai/global/event.contract.yml`: portable event trigger contract for humans, AI workers, CLIs, plugins, and local runners.
- `.ai/global/routing.matrix.yml`: RACI-style routing for phase work and impact types.
- `.ai/global/parallel.delivery.yml`: MVP/work item lanes so product, design, engineering, QA, release, and learning can move in parallel.
- `.ai/runtime/state.yml`: project runtime context that can change per repo or sprint.
- `scripts/ai-workflow.mjs`: local CLI for init, status, phase logs, impact reports, handoffs, agent commits, and validation.

## Quick Start

```bash
npx @iamohmcub/ai-orchestration init
npm run ai:init -- \
  --repo-group-id acme-platform \
  --repo-group-name "Acme Platform" \
  --repo-id checkout-service \
  --repo-name "Checkout Service" \
  --type product-service \
  --phase okr \
  --workspace-profile web-saas \
  --frontend-stack nextjs-typescript \
  --backend-stack node-api-typescript \
  --infra-stack netlify-or-container \
  --qa-profile playwright-vitest

npm run ai:status
npm run ai:start -- okr
npm run ai:start -- technical-design --mvp mvp-1 --lane engineering-delivery --depends-on ".ai/runtime/handoffs/<handoff>.md"
npm run ai:commit -- --agent Conway --message "route checkout idea" --evidence ".ai/runtime/logs/<phase-log>.md"
npm run ai:validate
```

## AI Worker Startup

Give this to the worker before implementation:

```text
Read AGENTS.md, .ai/manifest.yml, .ai/SKILLS.md, .ai/global/worker.contract.yml, .ai/global/event.contract.yml, .ai/global/routing.matrix.yml, .ai/global/agent.positions.yml, .ai/global/parallel.delivery.yml, .ai/project.yml, .ai/runtime/state.yml, and .ai/workspace/workspace.yml.
Follow the manifest load order.
Identify repo group, repo, current phase, MVP/work item, lane, owner role, supporting roles, impacted roles, and required evidence.
Load the owner role module from .ai/role/<role-id>/.
Apply shared workspace standards before code, tests, or infra changes.
Create a phase log before work and an impact report if another role or repo is affected.
Commit completed work with the correct agent callsign when the assigned task is done.
```

## Portable Runtime Model

`.ai` is the source of truth. It does not require a specific AI vendor, IDE,
adapter, or hosted model.

```text
.ai policy and runtime files
  -> readable by any AI or human
  -> optionally enforced by CLI, plugin, CI, MCP, or local LLM runner
```

No adapter is required for the workflow to make sense. An adapter only makes
event processing, dispatch, validation, and notifications faster.

## File Type Rule

Use YAML for structured config that tools should parse.

Use Markdown for behavior, explanation, templates, playbooks, and human/AI reading.

File mapping:

- `.yml`: `manifest.yml`, `project.yml`, `workspace.yml`, `interface.yml`, `role.yml`
- `.md`: `AGENTS.md`, `SKILLS.md`, `playbook.md`, `checklist.md`, `COMMANDS.md`

## Main Docs

- [AGENTS.md](AGENTS.md): root worker protocol.
- [COMMANDS.md](COMMANDS.md): command reference.
- [ai-orchestration-map.html](ai-orchestration-map.html): single presentation/overview.
- [.ai/README.md](.ai/README.md): `.ai` folder map.
- [.ai/PROJECT_SETUP.md](.ai/PROJECT_SETUP.md): new project checklist.
