# Workspace Standards

This folder contains company or repo-group standards shared by every repo.

Use it for decisions that should be consistent across teams:

- Approved stacks
- Code style
- Project structure
- Tooling
- QA process
- Automation expectations

Role modules extend these standards through `.ai/role/<role-id>/workspace.yml`.

## Inheritance

```text
global company rules
-> shared workspace standards
-> role core module
-> role workspace overlay
-> project-specific evidence
```

Shared workspace standards can add constraints to a role. They must not weaken core company rules or role safety rules.
