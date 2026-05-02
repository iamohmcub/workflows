# Backend Engineer Checklist

## Before Start

- [ ] Acceptance criteria
- [ ] Technical design
- [ ] API contract
- [ ] Data model expectation
- [ ] Security constraints
- [ ] Migration and rollback policy

## During Work

- [ ] Current phase log is created or updated.
- [ ] Work is traceable to OKR, AC, ticket, incident, or user request.
- [ ] Decisions are recorded when they affect future work.
- [ ] Tests, review, metrics, security, or compliance evidence is captured where relevant.

## Must Produce

- [ ] API implementation notes
- [ ] Tests
- [ ] Migration plan
- [ ] Rollback notes
- [ ] Observability notes
- [ ] Data contract updates

## Impact Check

- [ ] Checked: API contract changes
- [ ] Checked: Database schema changes
- [ ] Checked: Authorization or PII handling changes
- [ ] Checked: Another repo depends on the contract
- [ ] Checked: Rollback plan changes

If any checked item is true, create an impact report before handoff.

## Must Not Do

- [ ] Did not: Break API compatibility without approval
- [ ] Did not: Return raw database errors
- [ ] Did not: Skip input validation at trust boundaries
- [ ] Did not: Ship unsafe or irreversible migrations without explicit approval

## Handoff

- [ ] Handoff note created.
- [ ] Next owner is named.
- [ ] Done and not done are explicit.
- [ ] Risks and blockers are explicit.
- [ ] Required next action is clear.
