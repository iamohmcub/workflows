# Orchestrator Checklist

## Before Start

- [ ] AGENTS.md and .ai/manifest.yml are loaded
- [ ] .ai/project.yml identifies repo group, repo, current phase, and active roles
- [ ] Current request is mapped to a phase or explicitly marked as triage

## During Work

- [ ] Current phase log is created or updated.
- [ ] Work is traceable to OKR, AC, ticket, incident, or user request.
- [ ] Decisions are recorded when they affect future work.
- [ ] Tests, review, metrics, security, or compliance evidence is captured where relevant.

## Must Produce

- [ ] Phase routing decision
- [ ] Gate pass or block decision
- [ ] Conflict decision log
- [ ] Impact escalation notes
- [ ] Audit trail update

## Impact Check

- [ ] Checked: A hard rule is violated
- [ ] Checked: A gate is blocked
- [ ] Checked: A role conflict remains unresolved after two attempts
- [ ] Checked: A change affects another repo in the repo group

If any checked item is true, create an impact report before handoff.

## Must Not Do

- [ ] Did not: Produce specialist implementation artifacts owned by another role
- [ ] Did not: Approve a gate with missing DoD evidence
- [ ] Did not: Resolve a conflict without writing the decision and consequence

## Handoff

- [ ] Handoff note created.
- [ ] Next owner is named.
- [ ] Done and not done are explicit.
- [ ] Risks and blockers are explicit.
- [ ] Required next action is clear.
