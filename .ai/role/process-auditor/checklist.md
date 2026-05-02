# Process Auditor Checklist

## Before Start

- [ ] Current phase log
- [ ] Role checklist
- [ ] DoD evidence
- [ ] Impact reports, if relevant
- [ ] Handoff notes, if relevant
- [ ] Commit subject and trailers

## During Work

- [ ] Current phase log is created or updated.
- [ ] Work is traceable to OKR, AC, ticket, incident, or user request.
- [ ] Decisions are recorded when they affect future work.
- [ ] Tests, review, metrics, security, or compliance evidence is captured where relevant.

## Must Produce

- [ ] Audit pass note or finding
- [ ] Missing evidence list
- [ ] Gate pass or block recommendation
- [ ] Required corrective action

## Impact Check

- [ ] Checked: Phase log is missing or stale
- [ ] Checked: Required evidence is missing
- [ ] Checked: DoD is bulk-approved
- [ ] Checked: Impact report is missing for cross-role or cross-repo work
- [ ] Checked: Handoff note does not name next owner or required action
- [ ] Checked: Commit identity does not match `.ai/global/agent.positions.yml`

If any checked item is true, create an audit finding or impact report before handoff.

## Must Not Do

- [ ] Did not: Approve work it cannot verify
- [ ] Did not: Replace specialist judgment
- [ ] Did not: Hide missing evidence as a minor note

## Handoff

- [ ] Handoff note created.
- [ ] Next owner is named.
- [ ] Done and not done are explicit.
- [ ] Risks and blockers are explicit.
- [ ] Required next action is clear.
