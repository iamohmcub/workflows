# AI Worker Startup Prompt

You are working in this repo as an AI worker.

Before making changes:

1. Read `AGENTS.md`.
2. Read `.ai/manifest.yml`.
3. Read `.ai/SKILLS.md`.
4. Read `.ai/AUTOMATION.md`.
5. Read `.ai/project.yml`.
6. Read `.ai/runtime/state.yml`.
7. Read `.ai/global/worker.contract.yml`.
8. Read `.ai/global/event.contract.yml`.
9. Read `.ai/global/trigger.words.yml`.
10. Read `.ai/global/routing.matrix.yml`.
11. Read `.ai/global/agent.positions.yml`.
12. Read `.ai/global/parallel.delivery.yml`.
13. Read `.ai/workspace/workspace.yml`.
14. Read `.ai/workspace/stacks.yml`, `.ai/workspace/code-style.yml`, `.ai/workspace/project-structure.yml`, `.ai/workspace/tools.yml`, and `.ai/workspace/qa-process.yml`.
15. Follow the manifest `load_order`.

Identify:

- Repo group
- Repo
- Current phase
- MVP / work item
- Parallel lane
- Upstream handoff
- Owner role
- Supporting roles
- Impacted roles
- Impacted repos
- Required evidence

Then:

1. Load the correct role module from `.ai/role/<role-id>/`.
2. Map natural-language user requests with `.ai/global/trigger.words.yml` before asking the user to run a command.
3. Run `npx @iamohmcub/ai-orchestration status` when command output helps.
4. Read `role.yml`, `interface.yml`, `playbook.md`, `checklist.md`, and `workspace.yml` from that role folder.
5. Apply shared workspace standards unless the orchestrator approved a stricter exception.
6. Create or update the phase log in `.ai/runtime/logs`.
7. Work only inside the current phase unless the orchestrator changes phase.
8. For parallel MVP work, keep a lane-specific phase log and do not move repo current phase unless the orchestrator sets it.
9. Use `.ai/global/routing.matrix.yml` to identify responsible, consulted, and informed roles.
10. Create an impact report if another role, repo, lane, API, data contract, environment, security boundary, or customer commitment is affected.
11. Create a handoff note before moving downstream.
12. Complete DoD item by item before handoff.
13. Commit completed work with the correct agent callsign from `.ai/global/agent.positions.yml`.

Hard rules:

- No phase log means the phase is incomplete.
- No impact report means cross-role or cross-repo impact is not accepted.
- No gate may pass by bulk approval.
- CI, review, and secret scanning are required for code changes.
- Agent commits must use `<agent-callsign>: <completed task summary>` and include required AI commit trailers.
- Parallel work must name MVP/work item, lane, upstream handoff, locked contracts, and dependencies.
- Natural-language trigger words are enough. Commands are internal tools and fallback, not the main user experience.
- `.ai` is provider-neutral. Adapters and plugins are optional engines, not the source of truth.
