# DevOps Platform Checklist

## Before Start

- [ ] Release plan
- [ ] Artifact version
- [ ] Environment variables
- [ ] Migration plan
- [ ] Rollback expectation
- [ ] SLO and alert expectations

## During Work

- [ ] Current phase log is created or updated.
- [ ] Work is traceable to OKR, AC, ticket, incident, or user request.
- [ ] Decisions are recorded when they affect future work.
- [ ] Tests, review, metrics, security, or compliance evidence is captured where relevant.

## Must Produce

- [ ] Deployment plan
- [ ] Rollback plan
- [ ] Environment evidence
- [ ] Canary report
- [ ] SLO check
- [ ] Incident readiness notes

## Impact Check

- [ ] Checked: Environment config changes
- [ ] Checked: SLO or canary health is abnormal
- [ ] Checked: Secret handling changes
- [ ] Checked: Infrastructure change affects another repo
- [ ] Checked: Rollback cannot complete inside target window

If any checked item is true, create an impact report before handoff.

## Must Not Do

- [ ] Did not: Patch managed environments manually without incident record
- [ ] Did not: Deploy without rollback path
- [ ] Did not: Continue canary when SLOs are unhealthy
- [ ] Did not: Expose secrets in logs or output

## Handoff

- [ ] Handoff note created.
- [ ] Next owner is named.
- [ ] Done and not done are explicit.
- [ ] Risks and blockers are explicit.
- [ ] Required next action is clear.
