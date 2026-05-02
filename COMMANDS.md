# Commands

Use these commands after copying `AGENTS.md` and `.ai` into a project.

The command layer does not replace the AI worker. It gives the worker and humans a repeatable way to create logs, reports, handoffs, and trigger hook behavior.

## Install

Install the workflow into any repo:

```bash
npx @iamohmcub/ai-orchestration init
```

For only the worker-readable rulebook:

```bash
npx @iamohmcub/ai-orchestration init -- --minimal
```

No runtime npm dependencies are required.

Run commands directly:

```bash
npm run ai -- help
```

Or link the local CLI:

```bash
npm link
ai-workflow help
```

## New Project Init

Configure a new repo:

```bash
npm run ai:init -- \
  --repo-group-id acme-platform \
  --repo-group-name "Acme Platform" \
  --repo-id checkout-service \
  --repo-name "Checkout Service" \
  --type product-service \
  --description "Checkout flow and payment confirmation service" \
  --phase okr \
  --workspace-profile web-saas \
  --frontend-stack nextjs-typescript \
  --backend-stack node-api-typescript \
  --infra-stack netlify-or-container \
  --qa-profile playwright-vitest
```

This updates `.ai/project.yml`, updates `.ai/workspace/workspace.yml`, and creates runtime folders:

```text
.ai/runtime/queue
.ai/runtime/events
.ai/runtime/logs
.ai/runtime/reports
.ai/runtime/decisions
.ai/runtime/handoffs
```

## Status

Show current repo, phase, owner role, and next commands:

```bash
npm run ai:status
```

## Start a Phase

Create a phase log and set `.ai/project.yml` to the current phase:

```bash
npm run ai:start -- okr
```

Equivalent hook trigger:

```bash
npm run ai:trigger -- on_phase_start --phase okr
```

## Start Parallel MVP Work

Create a lane-specific phase log without changing the repo current phase:

```bash
npm run ai:start -- technical-design \
  --mvp mvp-1 \
  --lane engineering-delivery \
  --depends-on ".ai/runtime/handoffs/2026-05-02-mvp-1-designer-agent-to-tech-lead-agent-ux-design.md"
```

Equivalent hook trigger:

```bash
npm run ai:trigger -- on_parallel_lane_start \
  --phase prd \
  --mvp mvp-2 \
  --lane business-discovery
```

Use `--set-current` only when the orchestrator wants the repo-level current phase to move.

## Create an Impact Report

When another role or repo is affected:

```bash
npm run ai:impact -- \
  --title "Analytics contract changed" \
  --phase okr \
  --mvp mvp-1 \
  --lane business-discovery \
  --severity P2 \
  --affected-roles data-analyst,backend-engineer \
  --affected-repos analytics-events
```

Equivalent hook trigger:

```bash
npm run ai:trigger -- on_impact_detected \
  --title "Analytics contract changed" \
  --phase okr \
  --affected-roles data-analyst
```

## Create a Handoff

Before moving work downstream:

```bash
npm run ai:handoff -- \
  --from product-manager \
  --to ux-designer \
  --phase okr \
  --mvp mvp-1 \
  --from-lane business-discovery \
  --to-lane product-design
```

## Commit as an Agent

Every agent position can commit when its assigned task is done:

```bash
npm run ai:commit -- \
  --agent Berners \
  --message "implement checkout form" \
  --phase development \
  --mvp mvp-1 \
  --lane engineering-delivery \
  --evidence ".ai/runtime/logs/2026-05-02-development-checkout-service.md"
```

Valid agent names:

```text
Agent Jobs        prompter-agent
Agent Conway      orchestrator-agent
Agent Drucker     product-manager-agent
Agent Nightingale data-analyst-agent
Agent Rams        designer-agent
Agent Kano        product-owner-agent
Agent Turing      tech-lead-agent
Agent Berners     frontend-agent
Agent Hopper      backend-agent
Agent Mitnick     security-agent
Agent Brandeis    legal-agent
Agent Deming      qa-agent
Agent Gene        devops-agent
Agent Shewhart    monitoring-agent
Agent Holmes      auditor-agent
```

The command accepts the callsign, short name, position, or stable id. It keeps the real Git author and writes the agent callsign plus stable id into the commit subject and trailers.

Check the latest commit:

```bash
npm run ai:commit-check
```

## Validate

Check required files, runtime folders, and current phase config:

```bash
npm run ai:validate
```

Validation also checks the portable worker contract, event contract, routing
matrix, parallel lanes, agent positions, and runtime state file.

## AI Worker Startup

Give the AI worker this before asking it to implement:

```text
Read AGENTS.md, .ai/manifest.yml, .ai/SKILLS.md, .ai/global/worker.contract.yml, .ai/global/event.contract.yml, .ai/global/routing.matrix.yml, .ai/global/agent.positions.yml, .ai/global/parallel.delivery.yml, .ai/runtime/state.yml, and .ai/project.yml.
Follow the .ai load order.
Run npm run ai:status.
Run npm run ai:start -- <current-phase> if no phase log exists.
Use the correct role module from `.ai/role/<role-id>/`.
Read `role.yml`, `interface.yml`, `playbook.md`, `checklist.md`, and `workspace.yml`.
Apply shared standards from `.ai/workspace` before producing code, tests, or infra changes.
Use `.ai/global/routing.matrix.yml` to find responsible, consulted, and informed roles.
Create an impact report if another role, repo, lane, API, data contract, environment, security boundary, or customer commitment is affected.
Create a handoff note before moving to the next phase.
Commit completed work with `npm run ai:commit -- --agent <agent-name-or-id> --message "<summary>" --evidence "<link>"`.
```
