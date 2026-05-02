# Role Modules

Each role is a folder, not a single file.

Pattern:

```text
.ai/role/<role-id>/
|-- role.yml       # compact identity and hooks
|-- interface.yml  # machine-readable execution contract
|-- playbook.md    # detailed behavior for AI workers
`-- checklist.md   # DoD, impact, and handoff checks
```

Load order for a role:

1. `role.yml`
2. `interface.yml`
3. `playbook.md`
4. `checklist.md`

The flat `.ai/role/<role>.yml` layout is deprecated. New projects should use the folder layout.
