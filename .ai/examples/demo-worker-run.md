# Demo Worker Run

This is an example of how an AI worker should behave after receiving the startup prompt.

## User Request

```text
Create a checkout improvement project that reduces checkout abandonment.
Use the .ai workflow.
```

## Worker Startup

The worker reads:

1. `AGENTS.md`
2. `.ai/manifest.yml`
3. `.ai/SKILLS.md`
4. `.ai/project.yml`
5. `.ai/global/company.skills.yml`
6. `.ai/global/company.hooks.yml`
7. `.ai/global/company.rules.yml`
8. `.ai/global/sdlc.phases.yml`
9. `.ai/repo-group/workspace.yml`
10. `.ai/repo-group/impact-policy.yml`
11. `.ai/role/product-manager.yml`

## Worker Identifies Context

- Repo group: `acme-platform`
- Repo: `checkout-service`
- Phase: `okr`
- Owner role: `product-manager`
- Supporting roles: `data-analyst`, `ux-designer`, `tech-lead`, `security-engineer`
- Impacted repo: `analytics-events`
- Required evidence: phase log, role impact report, decision log, handoff note

## Worker Action

The worker creates:

- `runtime/logs/2026-05-02-okr-checkout-service.md`
- `runtime/reports/role-impact-2026-05-02-checkout-analytics.md`
- `runtime/decisions/2026-05-02-checkout-okr-scope.md`
- `runtime/handoffs/2026-05-02-pm-to-ux-checkout.md`

## Worker Gate Check

Gate question:

```text
Is this ready for the next role to do their best work?
```

Demo answer:

```text
Yes, with one tracked impact. UX can begin user research, but Data Analyst must confirm the checkout abandonment metric and analytics event definitions before Gate 2.
```

