# Role Modules

Each role is a folder, not a single file.

Pattern:

```text
.ai/role/<role-id>/
|-- role.yml       # compact identity and hooks
|-- interface.yml  # machine-readable execution contract
|-- playbook.md    # detailed behavior for AI workers
|-- checklist.md   # DoD, impact, and handoff checks
`-- workspace.yml  # repo/company stack, tools, style, and process overlay
```

Load order for a role:

1. `role.yml`
2. `interface.yml`
3. `playbook.md`
4. `checklist.md`
5. `workspace.yml`

The flat `.ai/role/<role>.yml` layout is deprecated. New projects should use the folder layout.

`workspace.yml` extends the shared standards in `.ai/workspace`. It can add role-specific stack, style, tooling, and process rules, but it must not weaken global company rules or core role rules.
