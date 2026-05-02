# Demo: New Project With AI Worker

This demo shows how a new project uses `AGENTS.md` and `.ai`.

Example project:

- Repo group: `acme-platform`
- Workspace profile: `web-saas`
- Repo: `checkout-service`
- Current phase: `okr`
- Owner role: `product-manager`
- Supporting roles: `data-analyst`, `tech-lead`, `security-engineer`

## 1. Copy the System

Copy these files into the new project root:

- `AGENTS.md`
- `.ai/`

## 2. Configure the New Project

Start from:

- `.ai/project.yml`
- `.ai/workspace/workspace.yml`

Example filled config:

- `.ai/examples/demo-project.yml`
- `.ai/examples/demo-workspace.yml`

The important fields are:

```yaml
project:
  repo_group:
    id: acme-platform
  repo:
    id: checkout-service
  lifecycle:
    current_phase: okr
workspace:
  profile: web-saas
```

## 3. Start the AI Worker

Optional command check:

```bash
npm run ai:status
```

Give the worker this prompt:

```text
Read AGENTS.md, .ai/manifest.yml, .ai/SKILLS.md, .ai/project.yml, and .ai/workspace/workspace.yml.
Follow the .ai load order.
Identify the repo group, repo, current phase, owner role, supporting roles, and impacted roles.
Create a phase log.
Then continue the current phase using the correct role definition.
```

## 4. Expected Worker Behavior

The worker should:

1. Read `AGENTS.md`.
2. Load `.ai/manifest.yml`.
3. Read `.ai/SKILLS.md`.
4. Read `.ai/project.yml`.
5. Select the owner role for the current phase.
6. Create a phase log.
7. Check whether another role or repo is affected.
8. Create an impact report if needed.
9. Complete the DoD item by item.
10. Write a handoff note before the next phase.

Equivalent command flow:

```bash
npm run ai:trigger -- on_phase_start --phase okr
npm run ai:trigger -- on_impact_detected --title "Checkout analytics definitions" --phase okr --affected-roles data-analyst --affected-repos analytics-events
npm run ai:handoff -- --from product-manager --to ux-designer --phase okr
npm run ai:validate
```

## 5. Demo Evidence

Read `.ai/examples/sample-evidence.md` for condensed examples of the expected phase log, impact report, decision log, and handoff note.

## 6. What This Proves

The `.ai` folder can guide an AI worker when the worker is instructed to read it first.

The worker does not just code. It knows:

- Which phase it is in
- Which role owns the work
- Which rules apply
- What evidence is required
- When to report impact
- When to stop at a gate
