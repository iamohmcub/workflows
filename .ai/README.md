# .ai Folder Map

The `.ai` folder is the worker-readable rulebook.

Hierarchy:

```text
repo group -> repo -> role
```

Canonical load order lives in `.ai/manifest.yml`.

## Folders

- `global/`: company-wide skills, hooks, rules, agent positions, worker contract, event contract, trigger words, routing matrix, parallel delivery, and SDLC phases.
- `workspace/`: shared stack, code style, project structure, tools, and QA standards.
- `repo-group/`: workspace/group policy and impact rules.
- `role/`: role modules.
- `templates/`: phase log, impact report, decision, handoff, and startup prompt templates.
- `runtime/`: real execution evidence.

## Role Module

Each role folder has five files:

```text
role.yml       # compact identity and hooks
interface.yml  # machine-readable execution contract
playbook.md    # detailed worker behavior
checklist.md   # DoD, impact, and handoff checks
workspace.yml  # role-specific stack/tool/process overlay
```

## File Type Rule

Use `.yml` for structured config and contracts that tools should parse.

Use `.md` for instructions, playbooks, checklists, templates, and human/AI explanations.

## Required Runtime Evidence

- Runtime state: `.ai/runtime/state.yml`
- Pending events: `.ai/runtime/queue`
- Event history: `.ai/runtime/events`
- Phase logs: `.ai/runtime/logs`
- Impact reports: `.ai/runtime/reports`
- Decision logs: `.ai/runtime/decisions`
- Handoff notes: `.ai/runtime/handoffs`

## Portable Runtime

The `.ai` folder must be usable without a provider-specific adapter. Any AI
worker should be able to read `AGENTS.md`, `.ai/manifest.yml`, and the files in
the manifest load order, then continue the workflow.

Optional plugins, runners, CI jobs, or local LLM adapters may automate events
and gates, but they must follow `.ai/global/worker.contract.yml`,
`.ai/global/event.contract.yml`, `.ai/global/trigger.words.yml`, and
`.ai/global/routing.matrix.yml`.
