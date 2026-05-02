# AI Engineering Orchestration

This folder defines how a repo group, repo, and role-based AI team work together across the software development lifecycle.

The model:

```text
repo group -> repo -> role
```

- A repo group is a workspace that can contain many companies, repos, products, or services.
- A repo is treated as a company or domain unit that follows the SDLC.
- A role is a domain expert agent that owns part of the SDLC.

Every role follows the same global rules, but each role has its own character, skills, responsibilities, hooks, and rules.

## Load Order

1. `.ai/SKILLS.md`
2. `.ai/AUTOMATION.md`
3. `.ai/project.yml`
4. `.ai/global/company.skills.yml`
5. `.ai/global/company.hooks.yml`
6. `.ai/global/company.rules.yml`
7. `.ai/global/sdlc.phases.yml`
8. `.ai/repo-group/workspace.yml`
9. `.ai/repo-group/impact-policy.yml`
10. `.ai/repo-group/repo.template.yml`
11. `.ai/role/*.yml`

## Required Outputs

Every phase creates a phase log in `.ai/runtime/logs`.

Every cross-role or cross-repo impact creates an impact report in `.ai/runtime/reports`.

Every architectural or governance decision creates a decision log in `.ai/runtime/decisions`.

## Visual Map

Open `ai-orchestration-map.html` in the repo root to see the orchestration layers, SDLC phases, role ownership, and impact reporting flow.

## New Project Setup

For a new project, copy `AGENTS.md` and `.ai` into the repo, then edit `.ai/project.yml`.

Use `.ai/PROJECT_SETUP.md` as the checklist and `.ai/templates/worker-startup-prompt.md` as the first message for AI workers.

Use `COMMANDS.md` for command usage.

Use `.ai/AUTOMATION.md` for hook triggers and GitHub Actions behavior.

## Demo

Read `DEMO.md` from the repo root, then inspect `.ai/examples`.

The demo shows a checkout-service project moving through the first OKR phase with a phase log, impact report, decision log, and handoff note.
