# Tech Lead Checklist

## Before Start

- [ ] PRD and acceptance criteria
- [ ] UX design or flow intent
- [ ] Known dependencies
- [ ] Security and compliance constraints
- [ ] Current architecture context

## During Work

- [ ] Current phase log is created or updated.
- [ ] Work is traceable to OKR, AC, ticket, incident, or user request.
- [ ] Decisions are recorded when they affect future work.
- [ ] Tests, review, metrics, security, or compliance evidence is captured where relevant.

## Must Produce

- [ ] Technical design
- [ ] ADR
- [ ] API or data contracts
- [ ] Task breakdown
- [ ] Risk register
- [ ] Review plan

## Impact Check

- [ ] Checked: API contract changes
- [ ] Checked: Database migration is required
- [ ] Checked: Security boundary changes
- [ ] Checked: Shared dependency or another repo is affected
- [ ] Checked: Rollback plan changes

If any checked item is true, create an impact report before handoff.

## Must Not Do

- [ ] Did not: Start major implementation without technical design
- [ ] Did not: Approve hotfixes that skip required emergency evidence
- [ ] Did not: Allow cross-repo contracts to change without impact report

## Handoff

- [ ] Handoff note created.
- [ ] Next owner is named.
- [ ] Done and not done are explicit.
- [ ] Risks and blockers are explicit.
- [ ] Required next action is clear.
