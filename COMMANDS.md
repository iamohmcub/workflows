# Commands

Use these commands after copying `AGENTS.md` and `.ai` into a project.

The command layer does not replace the AI worker. It gives the worker and humans a repeatable way to create logs, reports, handoffs, and trigger hook behavior.

## Install

Install the workflow into any repo:

```bash
npx @iamohmcub/ai-orchestration init
```

Default init installs only the worker-readable rulebook:

```bash
npx @iamohmcub/ai-orchestration init
```

To also install this command reference in the target repo:

```bash
npx @iamohmcub/ai-orchestration init --commands
```

No runtime npm dependencies or project `package.json` scripts are required.

Run commands directly:

```bash
npx @iamohmcub/ai-orchestration help
```

Or link the local CLI:

```bash
npm link
ai-workflow help
```

If a project explicitly wants local files and npm scripts, opt in:

```bash
npx @iamohmcub/ai-orchestration init --with-local-cli --with-package-scripts
```

## New Project Init

Configure a new repo:

```bash
npx @iamohmcub/ai-orchestration init \
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
npx @iamohmcub/ai-orchestration status
```

## Start a Phase

Create a phase log and set `.ai/project.yml` to the current phase:

```bash
npx @iamohmcub/ai-orchestration start okr
```

Equivalent hook trigger:

```bash
npx @iamohmcub/ai-orchestration trigger on_phase_start --phase okr
```

## Start Parallel MVP Work

Create a lane-specific phase log without changing the repo current phase:

```bash
npx @iamohmcub/ai-orchestration start technical-design \
  --mvp mvp-1 \
  --lane engineering-delivery \
  --depends-on ".ai/runtime/handoffs/2026-05-02-mvp-1-designer-agent-to-tech-lead-agent-ux-design.md"
```

Equivalent hook trigger:

```bash
npx @iamohmcub/ai-orchestration trigger on_parallel_lane_start \
  --phase prd \
  --mvp mvp-2 \
  --lane business-discovery
```

Use `--set-current` only when the orchestrator wants the repo-level current phase to move.

## Create an Impact Report

When another role or repo is affected:

```bash
npx @iamohmcub/ai-orchestration impact \
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
npx @iamohmcub/ai-orchestration trigger on_impact_detected \
  --title "Analytics contract changed" \
  --phase okr \
  --affected-roles data-analyst
```

## Create a Handoff

Before moving work downstream:

```bash
npx @iamohmcub/ai-orchestration handoff \
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
npx @iamohmcub/ai-orchestration commit \
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
npx @iamohmcub/ai-orchestration commit-check
```

## Validate

Check required files, runtime folders, and current phase config:

```bash
npx @iamohmcub/ai-orchestration validate
```

Validation also checks the portable worker contract, event contract, routing
matrix, parallel lanes, agent positions, and runtime state file.

## AI Worker Startup

Use `.ai/templates/worker-startup-prompt.md` as the single worker startup
prompt. Keep this file focused on commands so the startup contract does not
drift across multiple docs.
