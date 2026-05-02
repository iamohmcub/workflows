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
5. `.ai/workspace/workspace.yml`
6. `.ai/workspace/stacks.yml`
7. `.ai/workspace/code-style.yml`
8. `.ai/workspace/project-structure.yml`
9. `.ai/workspace/tools.yml`
10. `.ai/workspace/qa-process.yml`
11. `.ai/global/company.skills.yml`
12. `.ai/global/company.hooks.yml`
13. `.ai/global/company.rules.yml`
14. `.ai/global/sdlc.phases.yml`
15. `.ai/repo-group/workspace.yml`
16. `.ai/repo-group/impact-policy.yml`
17. `.ai/role/product-manager/role.yml`
18. `.ai/role/product-manager/interface.yml`
19. `.ai/role/product-manager/playbook.md`
20. `.ai/role/product-manager/checklist.md`
21. `.ai/role/product-manager/workspace.yml`

## Worker Identifies Context

- Repo group: `acme-platform`
- Workspace profile: `web-saas`
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

Command equivalent:

```bash
npm run ai:trigger -- on_phase_start --phase okr
npm run ai:trigger -- on_impact_detected --title "Checkout analytics definitions" --phase okr --affected-roles data-analyst --affected-repos analytics-events
npm run ai:handoff -- --from product-manager --to ux-designer --phase okr
```

## Worker Gate Check

Gate question:

```text
Is this ready for the next role to do their best work?
```

Demo answer:

```text
Yes, with one tracked impact. UX can begin user research, but Data Analyst must confirm the checkout abandonment metric and analytics event definitions before Gate 2.
```
