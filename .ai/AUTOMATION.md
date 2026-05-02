# Automation Triggers

There are two trigger styles.

## 1. Local Hook Commands

Use these when an AI worker or human is operating in the repo.

```bash
npx @iamohmcub/ai-orchestration trigger on_project_init
npx @iamohmcub/ai-orchestration trigger on_phase_start --phase okr
npx @iamohmcub/ai-orchestration trigger on_parallel_lane_start --phase technical-design --mvp mvp-1 --lane engineering-delivery --depends-on ".ai/runtime/handoffs/<handoff>.md"
npx @iamohmcub/ai-orchestration trigger on_impact_detected --title "API contract changed" --phase technical-design
npx @iamohmcub/ai-orchestration trigger on_bug_detected --title "Checkout payment failure" --phase qa-testing --severity P1
npx @iamohmcub/ai-orchestration trigger on_agent_task_done --agent Berners --feature checkout --message "implement checkout form" --evidence ".ai/runtime/logs/<phase-log>.md"
npx @iamohmcub/ai-orchestration commit --agent Berners --feature checkout --message "implement checkout form" --evidence ".ai/runtime/logs/<phase-log>.md"
npx @iamohmcub/ai-orchestration commit-check
```

Hook mapping:

| Hook | Command behavior |
| --- | --- |
| `on_project_init` | Creates runtime folders and optionally updates `.ai/project.yml`. |
| `on_phase_start` | Creates a phase log and loads the owner role for the phase. |
| `on_parallel_lane_start` | Creates a lane-specific phase log for an MVP/work item without moving repo current phase by default. |
| `on_impact_detected` | Creates an impact report in `.ai/runtime/reports`. |
| `on_bug_detected` | Creates an impact report with default severity `P1` unless specified. |
| `on_agent_task_done` | Creates a Git commit using the completed agent position identity. |

Agent commit commands:

| Command | Behavior |
| --- | --- |
| `npx @iamohmcub/ai-orchestration commit` | Creates a Git commit for a done task using one of the 15 agent callsigns and a required feature name. |
| `npx @iamohmcub/ai-orchestration commit-check` | Validates that the latest commit uses agent callsign, stable id, feature, and required AI trailers. |

## 2. GitHub Actions Trigger

This central library repo includes `.github/workflows/ai-workflow.yml` for its own CI. It is not included in the npm package by default.

It runs:

```bash
node scripts/ai-workflow.mjs validate
node scripts/ai-workflow.mjs commit-check
```

Triggers:

- Push to `main`
- Pull request to `main`
- Manual `workflow_dispatch`

This validates that the `.ai` rulebook and project config are still usable after changes.

## Automation Boundary

`.ai` is the portable workflow standard. Commands, plugins, adapters, GitHub
Actions, and local LLM runners are optional engines that prepare, validate, or
enforce evidence.

The current CLI does not call an LLM by itself. Start workers with
`.ai/templates/worker-startup-prompt.md`.

Future plugins or runners should process `.ai/runtime/queue` events with
`.ai/global/event.contract.yml`, route roles with `.ai/global/routing.matrix.yml`,
and keep `.ai` as the source of truth.
