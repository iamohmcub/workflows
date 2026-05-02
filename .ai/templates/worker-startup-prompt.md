# AI Worker Startup Prompt

You are working in this repo as an AI worker.

Before making changes:

1. Read `AGENTS.md`.
2. Read `.ai/manifest.yml`.
3. Read `.ai/SKILLS.md`.
4. Read `.ai/AUTOMATION.md`.
5. Read `.ai/project.yml`.
6. Follow the manifest `load_order`.

Identify:

- Repo group
- Repo
- Current phase
- Owner role
- Supporting roles
- Impacted roles
- Impacted repos
- Required evidence

Then:

1. Load the correct role module from `.ai/role/<role-id>/`.
2. Run `npm run ai:status`.
3. Read `role.yml`, `interface.yml`, `playbook.md`, and `checklist.md` from that role folder.
4. Create or update the phase log in `.ai/runtime/logs`.
5. Work only inside the current phase unless the orchestrator changes phase.
6. Create an impact report if another role or repo is affected.
7. Create a handoff note before moving downstream.
8. Complete DoD item by item before handoff.

Hard rules:

- No phase log means the phase is incomplete.
- No impact report means cross-role or cross-repo impact is not accepted.
- No gate may pass by bulk approval.
- CI, review, and secret scanning are required for code changes.
