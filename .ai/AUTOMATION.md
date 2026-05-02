# Automation Triggers

There are two trigger styles.

## 1. Local Hook Commands

Use these when an AI worker or human is operating in the repo.

```bash
npm run ai:trigger -- on_project_init
npm run ai:trigger -- on_phase_start --phase okr
npm run ai:trigger -- on_parallel_lane_start --phase technical-design --mvp mvp-1 --lane engineering-delivery --depends-on ".ai/runtime/handoffs/<handoff>.md"
npm run ai:trigger -- on_impact_detected --title "API contract changed" --phase technical-design
npm run ai:trigger -- on_bug_detected --title "Checkout payment failure" --phase qa-testing --severity P1
npm run ai:trigger -- on_agent_task_done --agent frontend-agent --message "implement checkout form" --evidence ".ai/runtime/logs/<phase-log>.md"
npm run ai:commit -- --agent frontend-agent --message "implement checkout form" --evidence ".ai/runtime/logs/<phase-log>.md"
npm run ai:commit-check
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
| `npm run ai:commit` | Creates a Git commit for a done task using one of the 15 agent ids. |
| `npm run ai:commit-check` | Validates that the latest commit uses agent identity and required AI trailers. |

## 2. GitHub Actions Trigger

The repo includes `.github/workflows/ai-workflow.yml`.

It runs:

```bash
npm run ai:validate
npm run ai:commit-check
```

Triggers:

- Push to `main`
- Pull request to `main`
- Manual `workflow_dispatch`

This validates that the `.ai` rulebook and project config are still usable after changes.

## What Automation Does Not Do Yet

The current automation does not call an LLM by itself.

It prepares and validates evidence. An AI worker still needs to be prompted to read:

- `AGENTS.md`
- `.ai/manifest.yml`
- `.ai/SKILLS.md`
- `.ai/project.yml`

Then the worker can run the commands as part of its process.
