# Runtime Evidence

This folder is where future AI or human-led workflow runs leave evidence.

- `logs/`: phase logs, one per phase execution.
- `reports/`: cross-role, repo, and repo-group impact reports.
- `decisions/`: durable product, design, architecture, release, security, compliance, and incident decisions.
- `handoffs/`: role-to-role handoff notes before a phase moves downstream.

Do not treat a phase as complete until its log is present and linked to required evidence.

When an assigned task is done, the responsible agent position can commit with the agent id, phase, task-done status, and evidence link required by `.ai/global/agent.positions.yml`.
