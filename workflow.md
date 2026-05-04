# DEV WORKFLOW
> Version: 1.0 · Production-ready · Last Updated: 2026-05-02

---

## Overview

This document is the **single source of truth** for how our team builds software — from the moment business hands over a signed design, through every environment gate, all the way to production go-live and continuous monitoring.

**Core principle:** Every role has a clear scope. Every gate is enforced. Every failure has a defined response path. Nothing moves forward without meeting the exit criteria.

**Where this file lives:**
```
repo-root/
├── DEV_WORKFLOW.md        ← THIS FILE
├── CLAUDE.md              ← AI agent instructions
├── README.md
├── SETUP.md
├── fragile-files.json
├── .claude/rules/
│   ├── tech-stack.md
│   ├── coding-standards.md
│   └── security-rules.md
└── product/_tracker/
    ├── session-log.md
    ├── work-streams.md
    ├── problem-tracker.md
    └── decision-log.md
```

---

## Roles

| Symbol | Role | Owns |
|--------|------|------|
| 🧩 SA | System Analyst | Spec, acceptance criteria, change requests |
| 🍎 iOS | iOS Developer | Native iOS code, unit tests |
| 🤖 AND | Android Developer | Native Android code, unit tests |
| ⚙️ BE | Backend Developer | APIs, DB migrations, async jobs |
| 🌐 WEB | Web Developer | Frontend components, E2E tests |
| 🧪 QA | QA Automation | Test strategy, automation, defect tracking |
| 🏛️ PE | Principal Engineer | Architecture, standards, cross-team sign-offs |
| 🚀 DO | DevOps | CI/CD, infrastructure, deployments |
| 🔥 SRE | Site Reliability | SLOs, monitoring, incident response |

---

## Environment Pipeline

```
LOCAL → DEV → SIT → UAT → STAGING → PRODUCTION → MONITOR
```

| Environment | Purpose | Deploy trigger | Owner |
|-------------|---------|----------------|-------|
| LOCAL | Developer's machine | Manual | Developer |
| DEV | CI integration on every PR merge | Auto — PR merge to `develop` | CI/CD |
| SIT | System integration testing | Auto — develop merge | DevOps |
| UAT | Business acceptance testing | Manual — promote from SIT | DevOps |
| STAGING | Production mirror, final validation | Manual — after UAT sign-off | DevOps + SRE |
| PRODUCTION | Live system | Manual — PM + PE dual approval | DevOps + SRE |
| MONITOR | Continuous reliability | Always on | SRE |

---

## Gate System

Gates are the enforcement layer between environments. **Non-negotiable** — no exceptions without a written Principal Engineer override logged in `decision-log.md`.

| Gate | Triggered | Enforces |
|------|-----------|----------|
| **G-0** Anti-Regression | Every commit push | No fragile file edits without approval · No secrets in code |
| **G-1** Code Review | Every PR | Security · Performance · Architecture · Logic correctness |
| **G-2** Test Coverage | Every PR | All new code paths have tests · Coverage ≥ 85% |
| **G-3** Integration | SIT deploy | API contracts match spec · DB migrations are clean and reversible |
| **G-4** Full Test Suite | SIT + Staging | Unit + integration + E2E all green · No flaky tests ignored |
| **G-5** Acceptance | UAT exit | All acceptance criteria verified · Business owner signed form |
| **G-6** Production Readiness | Staging exit | Load test passed · SAST/DAST clean · PE written sign-off · SRE runbook ready |
| **G-7** Canary | Prod deploy | 5% traffic · error rate < 0.1% · p99 < SLO · hold 10 min |

**Gate failure response:**

| Result | Action |
|--------|--------|
| CRITICAL | Stop. Fix in current stage. Re-run gate before proceeding. |
| WARNING | Document override in commit message. Get PE approval. Proceed. |
| FLAKY TEST | Quarantine test. Fix within same sprint. Do not ignore. |

---

## Stage 1 — Requirement Handoff

**Trigger:** Business + Design phase complete and signed off by PM.
**Owner:** 🧩 SA + 🏛️ PE

### What SA does

```bash
/readytodev        # Package entire spec → brief all dev roles
/writeuserstory    # Write stories in format: As [user] I want [goal] so that [benefit]
/writeapicontract  # Define all API endpoints: method, schema, errors, auth, rate limits
/writedatamodel    # Define DB schema, field types, relationships, indexes
/writeflowdiagram  # Draw happy path + error paths + edge cases
/refinestory       # Run refinement session with devs → set story points + sub-tasks
/sprintplan        # Finalize sprint backlog, assign stories by role
/signoffdesign     # SA written sign-off → officially unblocks dev
```

### What PE does

```bash
/archreview        # Review system design before any code is written
/impactanalysis    # Identify blast radius of new feature on existing systems
/writeglossary     # Align domain vocabulary across all roles
```

### Exit criteria (required before any dev starts)

- [ ] User stories with AC in Jira/Linear
- [ ] API contract document (OpenAPI format)
- [ ] Data model / ER diagram
- [ ] User + system flow diagram
- [ ] Sprint backlog with story point estimates
- [ ] SA written sign-off
- [ ] PE architecture review complete

### Change Request (CR)

Any scope change — at any stage — must go through this process:

```
Scope change identified
  → /cr  (SA raises CR with: affected stories, effort delta, risk level)
  → PM reviews business value
  → PE reviews technical impact
  → Both approve → stories updated → back to Stage 2
  → Either rejects → change logged, not implemented in this sprint
```

> **Rule:** No undocumented scope changes. A dev silently implementing something outside the spec is a CR violation.

---

## Stage 2 — Development

**Trigger:** Sprint starts. Stories are assigned and spec is signed off.
**Owner:** 🍎 iOS · 🤖 AND · ⚙️ BE · 🌐 WEB

### Session start (every day, 5 min)

```bash
git pull origin main
/plan
# Reviews: session-log.md · work-streams.md · problem-tracker.md
# Output: assigned stories · blockers · suggested first task
```

### Core dev commands

```bash
/impact-analysis <file>   # ALWAYS run before editing any shared file
/build <story-id>         # Implement feature — reads PRD + design + plan
/generatetestcase         # AI writes unit tests alongside your code
/featureflag <name>       # Gate any unfinished code behind a flag before committing
/quick-fix "<description>"# Fast triage + fix for a known bug
```

### Role-specific commands

```bash
# Backend
/writeapi                 # Implement endpoint per API contract
/dbmigration              # Write migration — always test up + down
/seeddata                 # Create realistic test data for dev/SIT env
/asyncjob                 # Implement background job with retry + DLQ
/cachesetup               # Add caching layer with TTL + invalidation strategy

# iOS
/iossetup                 # Init project — bundle IDs, schemes, provisioning
/memorycheck              # Profile retain cycles and memory leaks
/accessibilitycheck       # VoiceOver labels, traits, ordering

# Android
/androidsetup             # Init project — build flavors, signing, ProGuard
/backpresstest            # Verify back stack + deep link behavior
/darkmodereview           # Check all colors use themed attributes

# Web
/storybook                # Add/update component stories for all states
/pixelcheck               # Compare UI to Figma — spacing, typography, color
/a11ycheck                # Run axe-core — fix all critical violations
/bundleanalyze            # Check JS bundle size — remove unused packages
```

### Pre-push (every time before opening a PR)

```bash
/wrap-up
# Runs in sequence:
# G-0: Anti-regression check — fragile files, secrets scan
# G-1: Code review agents — Security + Performance + Architecture
# G-2: Test coverage — new code paths must have tests, coverage ≥ 85%
# G-4: Full test suite — unit + integration
# On pass: formats commit message, pushes to origin
```

### Commit message standard

```
<type>(<scope>): <short description>

G-0: PASSED — no fragile files, no secrets
G-1: PASSED — security ✅  performance ✅  architecture ✅
G-2: PASSED — X new tests, Y% coverage
G-4: PASSED — N tests pass, 0 fail

Implements: <story-id>
Constraint: <any constraint respected>
Confidence: HIGH | MEDIUM | LOW
```

### CI pipeline (auto on every push to any branch)

```
push → lint + format → unit tests (must be 100% green) → G-0 anti-regression → SAST scan
```

> If any CI step fails: **do not open the PR**. Fix locally, repush.

### Exit criteria (before opening PR)

- [ ] `/wrap-up` passed all gates with no CRITICAL findings
- [ ] Feature flag wraps any code not ready for production
- [ ] No TODO comments left in changed files without an issue link
- [ ] Local smoke test on the feature manually verified

---

## Stage 3 — Code Review

**Trigger:** PR opened against `develop` branch.
**Owner:** Peer developers + 🏛️ PE (for architecture changes)

### Commands

```bash
/codereview               # Peer review — logic, style, test quality
/team-review              # 3 parallel AI agents → Opus consolidation
                          #   Security: auth, injection, secrets, data exposure
                          #   Performance: latency, memory, query efficiency
                          #   Architecture: patterns, coupling, maintainability
/cr                       # If scope has drifted — pause PR, raise CR immediately
```

### Review checklist

- [ ] Logic is correct and fully satisfies the AC
- [ ] No hardcoded secrets, credentials, or environment-specific values
- [ ] All error paths handled — no silent failures
- [ ] Tests cover the change — happy path, error path, edge cases
- [ ] No performance regression introduced
- [ ] Code follows standards in `.claude/rules/coding-standards.md`
- [ ] API changes are backwards-compatible or version-bumped

### Merge decision

| Verdict | Meaning | Action |
|---------|---------|--------|
| **APPROVE** | No issues | Merge immediately |
| **APPROVE WITH COMMENTS** | Minor non-blocking suggestions | Author decides, then merge |
| **REQUEST CHANGES** | Blocking issues found | Author must fix, request re-review |
| **ESCALATE** | Architecture-level concern | PE must review before proceeding |

> **Rule:** A PR that has been open for > 2 business days without review must be flagged in standup.

---

## Stage 4 — SIT (System Integration Test)

**Trigger:** PR merged to `develop` → CI/CD auto-deploys to SIT environment.
**Owner:** 🚀 DevOps (deploy) · 🧪 QA (testing)

### What DevOps does (automated pipeline)

```
merge to develop
  → Docker image built (tagged: <commit-sha>)
  → Image pushed to registry
  → Deploy to SIT cluster
  → DB migrations applied
  → Health check passes
  → G-3 check: API contracts validated against spec
  → Smoke test suite triggered automatically
  → Slack notification: deploy success / fail
```

### What QA does

```bash
/smoketest                # Critical path smoke — login, core flows, payments
/regressiontest           # Full automated regression suite
/apitestcollection        # All API endpoints: auth, schema, error codes
/exploratorytest          # Manual session — new features, edge cases, UX
/performancetest          # Basic load: ramp to expected peak, check p99
/bugreport "<description>"# Log defect: steps, expected, actual, severity, screenshot
```

### Defect triage at SIT

| Severity | Definition | Response |
|----------|-----------|----------|
| **CRITICAL** | Blocks core user flow or data corruption | Fix now → new PR → re-deploy SIT → re-test |
| **MAJOR** | Feature broken but workaround exists | Fix in current sprint before UAT promote |
| **MINOR** | Cosmetic or low-impact issue | Log in Jira → schedule next sprint → does not block |

### Exit criteria

- [ ] G-3: API contracts pass
- [ ] G-4: Full test suite green (0 failures)
- [ ] Smoke test 100% pass
- [ ] Zero open CRITICAL defects
- [ ] Zero open MAJOR defects
- [ ] QA lead signs SIT completion report

---

## Stage 5 — UAT (User Acceptance Test)

**Trigger:** SIT exit criteria met → DevOps promotes build to UAT.
**Owner:** 🧩 SA · 🧪 QA · Business team

### Commands

```bash
/deployuat                # DevOps: promote SIT image → UAT cluster
/uat-prep                 # QA: seed test data, create business team accounts, write test scripts
/acceptancereview         # SA: verify every AC per story — pass / fail with evidence
/bugreport "<description>"# QA: log defect found during UAT
/cr                       # SA: if business requests scope change during UAT
```

### UAT flow

```
1. DevOps deploys UAT build (same image that passed SIT)
2. QA runs /uat-prep → business team has accounts + test data + scripts
3. Business team executes test scenarios
4. SA runs /acceptancereview per story → each AC marked pass/fail with screenshots
5. Defects triaged (same severity model as SIT)
6. G-5: All AC pass → business owner signs UAT acceptance form
```

### Defect handling

| Type | Response |
|------|----------|
| CRITICAL defect | → Stage 2 fix → SIT → re-promote UAT |
| MAJOR defect | → Stage 2 fix → SIT → re-promote UAT |
| MINOR defect | → Log for next sprint · does not block |
| Scope change | → `/cr` → PM + PE approve → Stage 2 · does not skip SIT |

### Exit criteria

- [ ] G-5: All acceptance criteria verified and signed off by SA
- [ ] Business owner UAT acceptance form signed
- [ ] Zero open CRITICAL or MAJOR defects
- [ ] All CRs resolved (approved for next sprint or rejected)

---

## Stage 6 — Staging

**Trigger:** UAT exit criteria met → DevOps promotes to Staging.
**Owner:** 🚀 DevOps · 🧪 QA · 🔥 SRE · 🏛️ PE

### Commands

```bash
# DevOps
/deploystaging            # Deploy same UAT-approved image to prod-mirror env
/secretrotate             # Rotate all secrets before prod — verify in staging first
/infraascode              # Apply any Terraform changes for this release

# QA
/regressiontest           # Full suite on staging
/loadtest                 # Load test at 2× expected peak traffic
/securityscan             # SAST + DAST — zero critical/high findings allowed
/testclosereport          # Formal test closure report covering SIT + UAT + Staging

# Mobile
/submittestflight         # iOS: upload to TestFlight, notify QA team
/playconsoleupload        # Android: upload AAB to internal track, notify QA team
/perfaudit                # Web: Lighthouse — LCP < 2.5s, CLS < 0.1, FID < 100ms

# SRE
/slodefinition            # Confirm/update SLO targets for new feature metrics
/runbook                  # Write or update runbook for new alert types
/chaostest                # Optional: inject failure to verify recovery behavior

# Principal
/securityreview           # Architecture-level security review
/platformreview           # Cross-platform standards alignment check
```

### Pre-production checklist (all required)

- [ ] Feature flags are correctly configured for production
- [ ] Secrets rotated and verified in staging environment
- [ ] DB migration dry-run succeeded — up and down both tested
- [ ] Rollback procedure documented, tested, and on-call team briefed
- [ ] Monitoring alerts configured for new feature metrics
- [ ] On-call schedule confirmed for release window
- [ ] Load test passed at 2× expected peak (p99 < SLO)
- [ ] SAST + DAST scan: zero critical or high findings
- [ ] QA test closure report submitted
- [ ] SRE runbook reviewed and ready
- [ ] Mobile builds approved on TestFlight and Play Console internal track
- [ ] **Principal Engineer written sign-off logged in decision-log.md**

### Exit criteria

- [ ] G-4: All tests green on staging
- [ ] G-6: Load test + security scan + PE sign-off + SRE runbook
- [ ] Test closure report accepted by QA lead and PE

---

## Stage 7 — Production Go Live

**Trigger:** Staging exit criteria met + **PM + PE dual approval** in pipeline.
**Owner:** 🚀 DevOps · 🔥 SRE

### Pre-deploy confirmation (synchronous check)

```
[ DevOps ] Confirm: staging image SHA matches → ✅
[ SRE    ] Confirm: monitoring dashboards are live → ✅
[ SRE    ] Confirm: runbook is open and ready → ✅
[ PE     ] Confirm: sign-off in decision-log.md → ✅
[ PM     ] Confirm: stakeholders notified, support team briefed → ✅
```

### Commands

```bash
/deployprod               # Trigger prod pipeline (blocked until dual approval)
/smoketest                # QA: run smoke test in production immediately after deploy
/rollback                 # SRE/DevOps: redeploy previous stable image — target < 5 min
```

### Canary rollout strategy

```
Phase 1: 5% traffic → hold 10 min → watch error rate + latency
Phase 2: 25% traffic → hold 5 min → confirm metrics stable
Phase 3: 100% traffic → standard monitoring

At each phase: if error rate > 0.1% → STOP → investigate before promoting
```

### Auto-rollback triggers

| Condition | Action |
|-----------|--------|
| Error rate > 1% at any canary phase | Immediate rollback — no discussion |
| p99 latency > 2× pre-deploy baseline | Pause canary — SRE investigates |
| Any P1 alert firing post-deploy | SRE decides: rollback or mitigation |
| Smoke test failure in prod | Rollback — fix — re-run full cycle |

### Mobile release (after API confirmed stable in prod)

```
iOS:     App Store Connect → release TestFlight → submit for App Store review
Android: Play Console → promote internal → production track (staged rollout 10% → 100%)
```

### Communication protocol

```
T-0  Deploy starts → notify #eng-deploy channel + status page "Deploying"
T+10 Canary phase 1 stable → update channel
T+30 Full rollout complete → notify PM + stakeholders + update status page "Operational"
Any rollback → immediate notification to PM + stakeholders + status page "Investigating"
```

---

## Stage 8 — Monitor

**Trigger:** Always on. Starts from the moment a service is deployed.
**Owner:** 🔥 SRE · 🚀 DevOps

### Commands

```bash
/incidentresponse         # Open bridge, page team, triage severity, execute runbook
/metricsreview            # Weekly: availability, error rate, latency, on-call burden
/errorbudget              # Check monthly error budget consumption and burn rate
/alerttuning              # Review false positives — adjust thresholds, add deduplication
/runbook                  # Update runbooks from incident learnings
/postmortem               # Blameless post-mortem within 48h of any P1 or P2
/oncallhandoff            # Written + verbal handoff — open incidents, known issues, noisy alerts
/dbbackupverify           # Restore from latest backup to test env — verify data integrity
/costaudit                # Monthly: identify cloud waste, idle resources, over-provisioning
/scalingtest              # Test horizontal scaling — verify traffic distribution is correct
```

### SLO targets

| Signal | SLO | P2 Alert | P1 Alert |
|--------|-----|----------|----------|
| Availability | 99.9% | < 99.7% | < 99.0% |
| Latency p99 | < 1000ms | > 1500ms | > 2000ms |
| Error rate (5xx) | < 0.1% | > 0.1% | > 1.0% |
| CPU utilization | < 70% | > 80% | > 90% |
| Memory | < 75% | > 85% | > 95% |
| DB connection pool | < 60% | > 75% | > 90% |
| Queue depth | baseline | > 500 jobs | > 2000 jobs |
| Mobile crash-free | > 99.9% | < 99.7% | < 99.0% |
| Error budget burn | — | > 5× in 1h | > 14.4× in 1h |

### Incident severity

| Level | Condition | Page | Response SLA |
|-------|-----------|------|-------------|
| **P1 — Critical** | System down or data loss risk | Immediate + escalate | 15 min acknowledge |
| **P2 — High** | Major feature broken or SLO breach | On-call page | 30 min acknowledge |
| **P3 — Medium** | Degraded performance, no data loss | Slack notify | Next business hour |
| **P4 — Low** | Cosmetic issue or informational | Ticket only | Next sprint |

### Incident response flow

```
1. Alert fires (PagerDuty / automated)
2. On-call SRE acknowledges within SLA
3. /incidentresponse → open bridge → assess severity
4. Execute runbook for known issue type
5. Mitigate first: rollback · feature flag off · scale up · rate limit
6. Communicate: status page + stakeholder Slack every 15 min during P1
7. Resolve: confirm metrics return to baseline
8. Close: update status page "Resolved"
9. /postmortem within 48h (P1/P2 only)
10. Action items → Jira stories → assigned owner + due date → next sprint
11. /runbook updated with learnings
12. /alerttuning if the alert was noisy or late
```

---

## Feedback Loops

These are the defined paths when something goes wrong. Every failure has exactly one correct response path.

### Loop A — Test Failure (any environment)

```
Automated test fails (SIT / Staging / CI)
  → Identify: flaky vs real failure
  → Flaky: quarantine + fix within same sprint (do not ignore)
  → Real failure: /bugreport → severity triage → defect loop
```

### Loop B — Defect Loop

```
/bugreport filed (QA at SIT, UAT, or Staging)
  → Severity assigned: CRITICAL / MAJOR / MINOR
  → CRITICAL or MAJOR → back to Stage 2 → fix → PR → SIT → promote back up
  → MINOR → logged in Jira → scheduled next sprint → no block on current environment
```

### Loop C — Change Request Loop

```
Scope change identified (any stage, any role)
  → /cr raised by SA → impact doc: affected stories + effort + risk
  → PM approves business value
  → PE approves technical impact
  → Both approve → stories updated → back to Stage 2 (skips nothing)
  → Either rejects → logged as "not implemented" in decision-log.md
```

### Loop D — Production Incident Loop

```
P1/P2 alert fires in production
  → /incidentresponse → mitigate (rollback or flag off)
  → Communicate to stakeholders (every 15 min during P1)
  → Resolve → confirm metrics stable
  → /postmortem within 48h
  → Action items → Jira stories → fix deployed through full Stage 2–7 cycle
  → /runbook updated · /alerttuning if needed
```

---

## Weekly Cadence

| Cadence | Activity | Owner |
|---------|---------|-------|
| **Daily** | `/plan` — context sync, blocker check | All devs |
| **Daily** | `/wrap-up` — gates + push at session end | All devs |
| **Weekly Mon** | `/sprintplan` + `/backlog-prioritize` — sprint kickoff | SA + PM |
| **Weekly Fri** | `/status-report` — velocity, blockers, metrics | SA + PM |
| **Weekly** | `/metricsreview` + `/errorbudget` — reliability review | SRE |
| **Monthly** | `/costaudit` + `/dbbackupverify` | DevOps |
| **Per release** | `/oncallhandoff` — before every production deploy | SRE |

---

## Quick Command Reference

| Situation | Command | Who | Stage |
|-----------|---------|-----|-------|
| Design handed off | `/readytodev` | SA | 1 |
| Start dev session | `/plan` | All devs | 2 |
| Before touching shared file | `/impact-analysis` | All devs | 2 |
| Implement story | `/build` | All devs | 2 |
| Write tests | `/generatetestcase` | All devs / AI | 2 |
| Gate incomplete feature | `/featureflag` | All devs | 2 |
| Fix known bug fast | `/quick-fix` | Developer | 2 |
| End session / before PR | `/wrap-up` | All devs | 2 |
| Open PR | `/team-review` | Peer + PE | 3 |
| Scope changes | `/cr` | SA | Any |
| Deploy to SIT | `/deploysit` | DevOps | 4 |
| Post-SIT-deploy checks | `/smoketest` + `/regressiontest` | QA | 4 |
| Deploy to UAT | `/deployuat` | DevOps | 5 |
| Prepare business team | `/uat-prep` | QA | 5 |
| Verify AC | `/acceptancereview` | SA | 5 |
| Deploy to Staging | `/deploystaging` | DevOps | 6 |
| Load + security validate | `/loadtest` + `/securityscan` | QA + DevOps | 6 |
| Write pre-prod runbook | `/runbook` | SRE | 6 |
| Go live | `/deployprod` | DevOps + SRE | 7 |
| Verify prod | `/smoketest` | QA | 7 |
| Emergency rollback | `/rollback` | SRE | 7 |
| Production incident | `/incidentresponse` | SRE | 8 |
| Debug production issue | `/fix` | Developer + PE | 8 |
| Post-incident analysis | `/postmortem` | PE + SRE | 8 |
| Weekly reliability check | `/metricsreview` | SRE | 8 |

---

## Regulations — Non-Negotiable

No exceptions without a **written Principal Engineer override in `decision-log.md`**.

| # | Rule |
|---|------|
| 1 | **No merge without gate passage.** G-0, G-1, G-2 must pass on every PR. |
| 2 | **No secrets in code.** G-0 hard-blocks any commit with credentials, keys, or tokens. |
| 3 | **No prod deploy without dual approval.** PM + PE must both approve the pipeline trigger. |
| 4 | **No UAT skip.** Every user-facing change must go through business sign-off. |
| 5 | **No undocumented CRs.** Every scope change goes through `/cr` with impact analysis. |
| 6 | **No silent rollbacks.** Every rollback triggers stakeholder notification + mandatory post-mortem. |
| 7 | **No deploy during release freeze.** SRE declares freeze via `/releasefreeze` — all pipelines block. |
| 8 | **No un-postmortemed P1/P2.** Post-mortem due within 48h — no exceptions. |
| 9 | **No coverage regression.** Coverage dropping below 85% hard-fails G-4. |
| 10 | **No unreviewed fragile file edits.** Files in `fragile-files.json` require PE approval before merge. |
| 11 | **No flaky test tolerance.** Flaky tests are quarantined and fixed same sprint — never ignored. |
| 12 | **No feature in prod without a feature flag.** Incomplete features must be flagged before merging. |

---

## File Placement Guide

```
repo-root/
├── DEV_WORKFLOW.md                 ← This file — team reads before every sprint
├── CLAUDE.md                       ← AI agent rules + context
├── README.md                       ← Project overview + local setup
├── SETUP.md                        ← Dev environment setup steps
├── fragile-files.json              ← Files that need PE approval before editing
│
├── .claude/
│   └── rules/
│       ├── tech-stack.md           ← Approved libraries, versions, patterns
│       ├── coding-standards.md     ← Language-specific style rules + examples
│       └── security-rules.md      ← Security do/don't list (auth, secrets, input)
│
└── product/
    ├── _tracker/
    │   ├── session-log.md          ← Last 10 sessions — auto-updated by /wrap-up
    │   ├── work-streams.md         ← Sprint board: 🔲 pending · 🟡 in-progress · ✅ done
    │   ├── problem-tracker.md      ← Known issues + root cause + prevention pattern
    │   └── decision-log.md         ← Architectural decisions + PE overrides log
    │
    └── features/
        ├── _archive/shipped/       ← Move here after release
        └── <feature-slug>/
            ├── 01-requirements/
            │   └── PRD.md          ← Created by /idea or SA
            ├── 02-design/
            │   ├── data-model.md
            │   ├── api-contract.md
            │   └── flow-diagram.md
            └── 03-development/
                └── implementation-plan.md
```

---

*Maintained by: Principal Engineer*
*Review cadence: Every major release or when a regulation is overridden*
*Based on: S.U.R.F v4.0 + Google SRE practices + internal AI-assisted workflow design*
