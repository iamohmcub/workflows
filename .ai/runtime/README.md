# Runtime Evidence

This folder is where future AI or human-led workflow runs leave evidence.

- `state.yml`: current runtime context for phase, lane, work item, queue, and evidence roots.
- `queue/`: pending provider-neutral event files.
- `events/`: completed or archived provider-neutral event files.
- `logs/`: phase logs, one per phase execution.
- `reports/`: cross-role, repo, and repo-group impact reports.
- `decisions/`: durable product, design, architecture, release, security, compliance, and incident decisions.
- `handoffs/`: role-to-role handoff notes before a phase moves downstream.

Do not treat a phase as complete until its log is present and linked to required evidence.

When an assigned task is done, the responsible agent position can commit with the agent callsign, stable id, phase, task-done status, and evidence link required by `.ai/global/agent.positions.yml`.

For parallel MVP or work item delivery, include the work item id, lane, upstream handoff, locked contracts, and dependencies in the phase log and handoff note.

Events use `.ai/global/event.contract.yml`. If a runner exists, it can move records from `queue/` to `events/` after required outputs are created. If no runner exists, the AI worker still reads the event file and follows the same contract manually.
