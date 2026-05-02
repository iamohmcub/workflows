# Sample Evidence

This is condensed demo evidence for the checkout-service example.

Real projects should write evidence to `.ai/runtime`.

## Phase Log

```text
Phase: okr
Owner role: product-manager
Gate: Gate 1
Objective: Reduce checkout abandonment for eligible logged-in users.
Key results:
- Reduce checkout abandonment from 42% to 35% within 60 days.
- Keep payment failure rate at or below current baseline plus 0.2 percentage points.
- Instrument every checkout step needed for funnel analysis before UAT.
Impact check:
- Cross-role impact report required for analytics definitions.
```

## Impact Report

```text
Title: Checkout Analytics Definitions
Severity: P2
Source repo: checkout-service
Affected repos: checkout-service, analytics-events
Affected roles: data-analyst, backend-engineer, frontend-engineer, qa-sdet
Required action: Data Analyst confirms checkout abandonment baseline and event names before Gate 2.
```

## Decision Log

```text
Decision: Optimize checkout conversion with guardrail metrics.
Positive consequence: Avoids conversion gains that increase payment failures or support load.
Follow-up: Data Analyst confirms measurement approach and baseline.
```

## Handoff Note

```text
From role: product-manager
To role: ux-designer
Done: Objective, draft key results, target segment, analytics dependency.
Not done: Measurement approach not confirmed.
Required next action: UX drafts research plan; Data Analyst confirms baseline before Gate 2.
```
