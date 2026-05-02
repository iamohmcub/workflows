# Commands

Use these commands after copying `AGENTS.md` and `.ai` into a project.

The command layer does not replace the AI worker. It gives the worker and humans a repeatable way to create logs, reports, handoffs, and trigger hook behavior.

## Install

No npm packages are required.

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

## Create an Impact Report

When another role or repo is affected:

```bash
npm run ai:impact -- \
  --title "Analytics contract changed" \
  --phase okr \
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
  --phase okr
```

## Validate

Check required files, runtime folders, and current phase config:

```bash
npm run ai:validate
```

## Demo

Show demo files and suggested commands:

```bash
npm run ai:demo
```

## AI Worker Startup

Give the AI worker this before asking it to implement:

```text
Read AGENTS.md, .ai/manifest.yml, .ai/SKILLS.md, and .ai/project.yml.
Follow the .ai load order.
Run npm run ai:status.
Run npm run ai:start -- <current-phase> if no phase log exists.
Use the correct role module from `.ai/role/<role-id>/`.
Read `role.yml`, `interface.yml`, `playbook.md`, `checklist.md`, and `workspace.yml`.
Apply shared standards from `.ai/workspace` before producing code, tests, or infra changes.
Create an impact report if another role or repo is affected.
Create a handoff note before moving to the next phase.
```
