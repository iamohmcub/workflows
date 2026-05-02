# Demo: New Project With AI Worker

This demo shows how a new project uses `AGENTS.md` and `.ai`.

Example project:

- Repo group: `acme-platform`
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

Example filled config:

- `.ai/examples/demo-project.yml`

The important fields are:

```yaml
project:
  repo_group:
    id: acme-platform
  repo:
    id: checkout-service
  lifecycle:
    current_phase: okr
```

## 3. Start the AI Worker

Give the worker this prompt:

```text
Read AGENTS.md, .ai/manifest.yml, .ai/SKILLS.md, and .ai/project.yml.
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

## 5. Demo Evidence

These files show the expected output:

- `.ai/examples/runtime/logs/2026-05-02-okr-checkout-service.md`
- `.ai/examples/runtime/reports/role-impact-2026-05-02-checkout-analytics.md`
- `.ai/examples/runtime/decisions/2026-05-02-checkout-okr-scope.md`
- `.ai/examples/runtime/handoffs/2026-05-02-pm-to-ux-checkout.md`

## 6. What This Proves

The `.ai` folder can guide an AI worker when the worker is instructed to read it first.

The worker does not just code. It knows:

- Which phase it is in
- Which role owns the work
- Which rules apply
- What evidence is required
- When to report impact
- When to stop at a gate

