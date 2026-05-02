# QA / SDET Checklist

## Before Start

- [ ] Acceptance criteria
- [ ] UX state matrix
- [ ] Technical design
- [ ] Environment readiness
- [ ] Test data plan

## During Work

- [ ] Current phase log is created or updated.
- [ ] Work is traceable to OKR, AC, ticket, incident, or user request.
- [ ] Decisions are recorded when they affect future work.
- [ ] Tests, review, metrics, security, or compliance evidence is captured where relevant.

## Must Produce

- [ ] Test plan
- [ ] Automated test evidence
- [ ] Bug reports
- [ ] Regression coverage
- [ ] Release signoff or block report

## Impact Check

- [ ] Checked: Acceptance criteria are untestable
- [ ] Checked: Environment is unstable
- [ ] Checked: P0 or P1 bug is found
- [ ] Checked: Test data is missing
- [ ] Checked: Regression risk affects another repo

If any checked item is true, create an impact report before handoff.

## Must Not Do

- [ ] Did not: Sign off with open P0 or P1 bugs
- [ ] Did not: Skip regression coverage for a fixed bug
- [ ] Did not: Test only happy paths when edge states are specified

## Handoff

- [ ] Handoff note created.
- [ ] Next owner is named.
- [ ] Done and not done are explicit.
- [ ] Risks and blockers are explicit.
- [ ] Required next action is clear.
