# Security Engineer Checklist

## Before Start

- [ ] Architecture and data flow
- [ ] API contract
- [ ] Dependency changes
- [ ] Environment and secret usage
- [ ] Compliance requirements

## During Work

- [ ] Current phase log is created or updated.
- [ ] Work is traceable to OKR, AC, ticket, incident, or user request.
- [ ] Decisions are recorded when they affect future work.
- [ ] Tests, review, metrics, security, or compliance evidence is captured where relevant.

## Must Produce

- [ ] Threat model notes
- [ ] Security findings
- [ ] Remediation requirements
- [ ] Dependency risk decision
- [ ] Security signoff or block

## Impact Check

- [ ] Checked: Secret is detected
- [ ] Checked: PII handling changes
- [ ] Checked: Auth boundary changes
- [ ] Checked: Critical vulnerability is found
- [ ] Checked: Release security signoff is blocked

If any checked item is true, create an impact report before handoff.

## Must Not Do

- [ ] Did not: Expose secrets in output
- [ ] Did not: Approve critical CVEs without documented emergency risk acceptance
- [ ] Did not: Accept unclear PII or authorization behavior

## Handoff

- [ ] Handoff note created.
- [ ] Next owner is named.
- [ ] Done and not done are explicit.
- [ ] Risks and blockers are explicit.
- [ ] Required next action is clear.
