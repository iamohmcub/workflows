#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const AI_DIR = path.join(ROOT, ".ai");
const PROJECT_FILE = path.join(AI_DIR, "project.yml");
const PHASE_FILE = path.join(AI_DIR, "global", "sdlc.phases.yml");
const RUNTIME_DIR = path.join(AI_DIR, "runtime");

const REQUIRED_FILES = [
  "AGENTS.md",
  ".ai/manifest.yml",
  ".ai/SKILLS.md",
  ".ai/project.yml",
  ".ai/global/company.skills.yml",
  ".ai/global/company.hooks.yml",
  ".ai/global/company.rules.yml",
  ".ai/global/sdlc.phases.yml"
];

const EVENT_ALIASES = {
  on_project_init: "init",
  on_phase_start: "start-phase",
  on_impact_detected: "impact",
  on_bug_detected: "impact"
};

main(process.argv.slice(2));

function main(argv) {
  const command = argv[0] || "help";
  const rest = argv.slice(1);

  try {
    switch (command) {
      case "help":
      case "--help":
      case "-h":
        printHelp();
        break;
      case "status":
        status();
        break;
      case "init":
        init(rest);
        break;
      case "start-phase":
      case "start":
        startPhase(rest);
        break;
      case "trigger":
        trigger(rest);
        break;
      case "impact":
        impact(rest);
        break;
      case "handoff":
        handoff(rest);
        break;
      case "validate":
        validate();
        break;
      case "demo":
        demo();
        break;
      default:
        fail(`Unknown command: ${command}\nRun: npm run ai -- help`);
    }
  } catch (error) {
    fail(error.message);
  }
}

function printHelp() {
  console.log(`AI workflow commands

Usage:
  npm run ai -- help
  npm run ai:status
  npm run ai:init -- --repo-group-id acme --repo-group-name "Acme Platform" --repo-id checkout-service --repo-name "Checkout Service" --type product-service --phase okr
  npm run ai:start -- okr
  npm run ai:trigger -- on_phase_start --phase prd
  npm run ai:trigger -- on_impact_detected --title "Analytics contract changed" --phase prd --affected-roles data-analyst,backend-engineer
  npm run ai:impact -- --title "API contract changed" --phase technical-design --severity P2
  npm run ai:handoff -- --from product-manager --to ux-designer --phase okr
  npm run ai:validate
  npm run ai:demo

Core idea:
  AGENTS.md + .ai define the rules.
  This CLI creates the logs, reports, and handoffs that prove the rules were followed.
`);
}

function status() {
  const project = readProject();
  const phases = readPhases();
  const phase = phaseById(phases, project.currentPhase);

  console.log(`AI workflow status

Repo group: ${project.repoGroupName} (${project.repoGroupId})
Repo:       ${project.repoName} (${project.repoId})
Type:       ${project.repoType}
Phase:      ${project.currentPhase}${phase ? ` - ${phase.name}` : ""}
Owner:      ${phase?.owner || "unknown"}
Gate:       ${phase?.gate || "unknown"}

Next commands:
  npm run ai:start -- ${project.currentPhase}
  npm run ai:trigger -- on_phase_start --phase ${project.currentPhase}
  npm run ai:validate
`);
}

function init(argv) {
  const options = parseOptions(argv);
  ensureRuntimeDirs();

  if (Object.keys(options).length > 0) {
    ensureFile(PROJECT_FILE, "Missing .ai/project.yml");
    let text = fs.readFileSync(PROJECT_FILE, "utf8");

    const replacements = [
      [["project", "repo_group", "id"], options["repo-group-id"]],
      [["project", "repo_group", "name"], options["repo-group-name"]],
      [["project", "repo_group", "description"], options["repo-group-description"]],
      [["project", "repo", "id"], options["repo-id"]],
      [["project", "repo", "name"], options["repo-name"]],
      [["project", "repo", "type"], options.type],
      [["project", "repo", "description"], options.description],
      [["project", "lifecycle", "current_phase"], options.phase]
    ];

    for (const [yamlPath, value] of replacements) {
      if (value) text = setYamlScalar(text, yamlPath, value);
    }

    fs.writeFileSync(PROJECT_FILE, text);
  }

  console.log(`Project initialized

Runtime folders:
  .ai/runtime/logs
  .ai/runtime/reports
  .ai/runtime/decisions
  .ai/runtime/handoffs

Config:
  .ai/project.yml

Next:
  npm run ai:status
  npm run ai:start -- ${options.phase || readProject().currentPhase}
`);
}

function startPhase(argv) {
  const options = parseOptions(argv);
  const phaseId = options.phase || firstPositional(argv) || readProject().currentPhase;
  const project = readProject();
  const phases = readPhases();
  const phase = phaseById(phases, phaseId);

  if (!phase) {
    fail(`Unknown phase: ${phaseId}\nKnown phases: ${phases.map((item) => item.id).join(", ")}`);
  }

  ensureRuntimeDirs();
  updateCurrentPhase(phase.id);

  const date = today();
  const file = path.join(RUNTIME_DIR, "logs", `${date}-${phase.id}-${slug(project.repoId)}.md`);

  if (fs.existsSync(file) && !options.force) {
    console.log(`Phase log already exists: ${relative(file)}

Use --force to overwrite, or continue editing the existing log.
`);
    return;
  }

  const dod = phase.dod.map((item) => `- [ ] ${item}`).join("\n");
  const supporting = unique(["orchestrator", ...project.activeRoles.filter((role) => role !== phase.owner)]).join(", ");

  const content = `# Phase Log: ${phase.name}

Date: ${date}
Repo group: ${project.repoGroupName}
Repo: ${project.repoName}
Phase: ${phase.id}
Owner role: ${phase.owner}
Supporting roles: ${supporting}
Gate: ${phase.gate}

## Source

- OKR / AC / ticket / incident / request:
- Related decisions:
- Related impact reports:

## Worker Boot

- [x] Read AGENTS.md
- [x] Read .ai/manifest.yml
- [x] Read .ai/SKILLS.md
- [x] Read .ai/project.yml
- [x] Loaded role: .ai/role/${phase.owner}.yml

## Work Completed

-

## Evidence

- Tests:
- Review:
- Security:
- Compliance:
- Environment:
- Metrics:

## Definition of Done

${dod}

## Risks and Open Questions

-

## Impact Check

- [ ] No impact outside owner role.
- [ ] Cross-role impact report created.
- [ ] Cross-repo impact report created.
- [ ] Affected owners acknowledged.

## Gate Question

Is this ready for the next role to do their best work?

Answer:

## Handoff

- Next owner:
- Done:
- Not done:
- Risks:
- Required action:
`;

  fs.writeFileSync(file, content);

  console.log(`Started phase: ${phase.id} - ${phase.name}

Owner role:
  ${phase.owner}

Created phase log:
  ${relative(file)}

Next:
  Read .ai/role/${phase.owner}.yml
  Complete DoD item by item
  Run npm run ai:impact -- --title "<title>" if another role or repo is affected
`);
}

function trigger(argv) {
  const hook = firstPositional(argv);

  if (!hook || hook === "--list") {
    console.log(`Automation triggers

  on_project_init      -> npm run ai:init
  on_phase_start       -> npm run ai:start -- <phase>
  on_impact_detected   -> npm run ai:impact -- --title "<title>"
  on_bug_detected      -> npm run ai:impact -- --title "<bug title>" --severity P1

Examples:
  npm run ai:trigger -- on_project_init
  npm run ai:trigger -- on_phase_start --phase okr
  npm run ai:trigger -- on_impact_detected --title "Analytics contract changed" --phase okr --affected-roles data-analyst
`);
    return;
  }

  const command = EVENT_ALIASES[hook];
  if (!command) {
    fail(`No command is mapped for hook: ${hook}\nRun: npm run ai:trigger -- --list`);
  }

  const options = parseOptions(argv.slice(1));
  console.log(`Trigger: ${hook}`);

  if (command === "init") init(argv.slice(1));
  if (command === "start-phase") startPhase(argv.slice(1));
  if (command === "impact") {
    const forwarded = argv.slice(1);
    if (hook === "on_bug_detected" && !options.severity) forwarded.push("--severity", "P1");
    impact(forwarded);
  }
}

function impact(argv) {
  const options = parseOptions(argv);
  const project = readProject();
  const phases = readPhases();
  const phaseId = options.phase || project.currentPhase;
  const phase = phaseById(phases, phaseId);
  const title = options.title || firstPositional(argv) || "Untitled Impact";
  const severity = options.severity || "P2";
  const level = options.level || (options["affected-repos"] ? "group" : "role");
  const sourceRole = options["source-role"] || phase?.owner || "unknown";
  const affectedRoles = options["affected-roles"] || "TBD";
  const affectedRepos = options["affected-repos"] || project.repoId;
  const gateBlocking = options["gate-blocking"] || "yes";

  ensureRuntimeDirs();

  const date = today();
  const file = path.join(RUNTIME_DIR, "reports", `${level}-impact-${date}-${slug(title)}.md`);

  if (fs.existsSync(file) && !options.force) {
    console.log(`Impact report already exists: ${relative(file)}

Use --force to overwrite, or continue editing the existing report.
`);
    return;
  }

  const content = `# Impact Report: ${title}

Date: ${date}
Repo group: ${project.repoGroupName}
Source repo: ${project.repoId}
Source role: ${sourceRole}
Phase: ${phaseId}
Severity: ${severity}
Gate blocking: ${gateBlocking}

## Summary

${options.summary || "Describe what changed and why it matters."}

## Affected Scope

- Affected repos: ${affectedRepos}
- Affected roles: ${affectedRoles}
- Affected environments: ${options.environments || "TBD"}
- Affected APIs or data contracts: ${options.contracts || "TBD"}
- Affected customers or commitments: ${options.customers || "TBD"}

## Required Action

- Owner: ${options.owner || "TBD"}
- Due date: ${options["due-date"] || "TBD"}
- Action required: ${options.action || "TBD"}
- Decision required: ${options.decision || "TBD"}

## Evidence

- Links:
- Tests:
- Logs:
- Screenshots:
- Metrics:

## Acknowledgement

- [ ] Product acknowledged.
- [ ] Engineering acknowledged.
- [ ] QA acknowledged.
- [ ] DevOps acknowledged.
- [ ] Security acknowledged.
- [ ] Data or compliance acknowledged, if relevant.

## Orchestrator Decision

Decision:
Owner:
Date:
`;

  fs.writeFileSync(file, content);

  console.log(`Created impact report:
  ${relative(file)}

Gate blocking:
  ${gateBlocking}

Next:
  Notify affected roles/repos
  Link this report from the current phase log
`);
}

function handoff(argv) {
  const options = parseOptions(argv);
  const project = readProject();
  const phaseId = options.phase || project.currentPhase;
  const from = options.from || "TBD";
  const to = options.to || "TBD";

  ensureRuntimeDirs();

  const date = today();
  const file = path.join(RUNTIME_DIR, "handoffs", `${date}-${slug(from)}-to-${slug(to)}-${slug(phaseId)}.md`);

  if (fs.existsSync(file) && !options.force) {
    console.log(`Handoff note already exists: ${relative(file)}

Use --force to overwrite, or continue editing the existing note.
`);
    return;
  }

  const content = `# Handoff Note

Date: ${date}
From role: ${from}
To role: ${to}
Repo: ${project.repoId}
Phase: ${phaseId}

## Done

-

## Not Done

-

## Risks

-

## Evidence

-

## DoD Status

- [ ] Complete
- [ ] Incomplete, blocked by:

## Required Next Action

-
`;

  fs.writeFileSync(file, content);

  console.log(`Created handoff note:
  ${relative(file)}

Next:
  Link it from the phase log before moving to the next phase
`);
}

function validate() {
  const errors = [];

  for (const file of REQUIRED_FILES) {
    if (!fs.existsSync(path.join(ROOT, file))) errors.push(`Missing required file: ${file}`);
  }

  ensureFile(PROJECT_FILE, "Missing .ai/project.yml");
  ensureFile(PHASE_FILE, "Missing .ai/global/sdlc.phases.yml");

  const project = readProject();
  const phases = readPhases();
  const phase = phaseById(phases, project.currentPhase);

  if (!project.repoGroupId) errors.push("project.repo_group.id is empty");
  if (!project.repoId) errors.push("project.repo.id is empty");
  if (!project.currentPhase) errors.push("project.lifecycle.current_phase is empty");
  if (!phase) errors.push(`Current phase is not defined in sdlc.phases.yml: ${project.currentPhase}`);

  for (const dir of ["logs", "reports", "decisions", "handoffs"]) {
    const full = path.join(RUNTIME_DIR, dir);
    if (!fs.existsSync(full)) errors.push(`Missing runtime folder: .ai/runtime/${dir}`);
  }

  if (errors.length) {
    console.error(`AI workflow validation failed

${errors.map((item) => `- ${item}`).join("\n")}
`);
    process.exitCode = 1;
    return;
  }

  console.log(`AI workflow validation passed

Repo: ${project.repoId}
Current phase: ${project.currentPhase}
Owner role: ${phase.owner}
Known phases: ${phases.length}
`);
}

function demo() {
  console.log(`Demo path

Read:
  DEMO.md
  .ai/examples/demo-project.yml
  .ai/examples/demo-worker-run.md

Try:
  npm run ai:status
  npm run ai:start -- okr
  npm run ai:impact -- --title "Analytics contract changed" --phase okr --affected-roles data-analyst
  npm run ai:handoff -- --from product-manager --to ux-designer --phase okr
`);
}

function readProject() {
  ensureFile(PROJECT_FILE, "Missing .ai/project.yml");
  const text = fs.readFileSync(PROJECT_FILE, "utf8");
  return {
    repoGroupId: getYamlScalar(text, ["project", "repo_group", "id"]),
    repoGroupName: getYamlScalar(text, ["project", "repo_group", "name"]),
    repoId: getYamlScalar(text, ["project", "repo", "id"]),
    repoName: getYamlScalar(text, ["project", "repo", "name"]),
    repoType: getYamlScalar(text, ["project", "repo", "type"]),
    currentPhase: getYamlScalar(text, ["project", "lifecycle", "current_phase"]),
    activeRoles: getYamlList(text, ["project", "roles", "active"])
  };
}

function readPhases() {
  ensureFile(PHASE_FILE, "Missing .ai/global/sdlc.phases.yml");
  const lines = fs.readFileSync(PHASE_FILE, "utf8").split(/\r?\n/);
  const phases = [];
  let current = null;
  let inDod = false;

  for (const line of lines) {
    const start = line.match(/^  - id:\s*(.+?)\s*$/);
    if (start) {
      current = { id: clean(start[1]), dod: [] };
      phases.push(current);
      inDod = false;
      continue;
    }

    if (!current) continue;

    const field = line.match(/^    ([a-zA-Z0-9_-]+):\s*(.*?)\s*$/);
    if (field) {
      const key = field[1];
      const value = clean(field[2]);
      if (key === "dod") {
        inDod = true;
      } else {
        current[key] = value;
        inDod = false;
      }
      continue;
    }

    const dod = line.match(/^      -\s*(.+?)\s*$/);
    if (inDod && dod) current.dod.push(clean(dod[1]));
  }

  return phases;
}

function phaseById(phases, id) {
  return phases.find((phase) => phase.id === id);
}

function updateCurrentPhase(phaseId) {
  const text = fs.readFileSync(PROJECT_FILE, "utf8");
  fs.writeFileSync(PROJECT_FILE, setYamlScalar(text, ["project", "lifecycle", "current_phase"], phaseId));
}

function ensureRuntimeDirs() {
  for (const dir of ["logs", "reports", "decisions", "handoffs"]) {
    fs.mkdirSync(path.join(RUNTIME_DIR, dir), { recursive: true });
  }
}

function parseOptions(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      options[key] = true;
    } else {
      options[key] = next;
      index += 1;
    }
  }
  return options;
}

function firstPositional(argv) {
  return argv.find((item) => !item.startsWith("--"));
}

function getYamlScalar(text, targetPath) {
  const lines = text.split(/\r?\n/);
  const stack = [];

  for (const line of lines) {
    const match = line.match(/^(\s*)([A-Za-z0-9_-]+):(?:\s*(.*?))?\s*$/);
    if (!match) continue;

    const indent = match[1].length;
    const depth = Math.floor(indent / 2);
    const key = match[2];
    const value = match[3] ?? "";
    stack.length = depth;
    stack[depth] = key;

    if (samePath(stack.slice(0, depth + 1), targetPath)) {
      return clean(value);
    }
  }

  return "";
}

function getYamlList(text, targetPath) {
  const lines = text.split(/\r?\n/);
  const stack = [];
  let listIndent = null;
  const values = [];

  for (const line of lines) {
    const keyMatch = line.match(/^(\s*)([A-Za-z0-9_-]+):(?:\s*(.*?))?\s*$/);
    if (keyMatch) {
      const indent = keyMatch[1].length;
      const depth = Math.floor(indent / 2);
      const key = keyMatch[2];
      stack.length = depth;
      stack[depth] = key;

      if (samePath(stack.slice(0, depth + 1), targetPath)) {
        listIndent = indent + 2;
        continue;
      }

      if (listIndent !== null && indent <= listIndent - 2) break;
    }

    if (listIndent !== null) {
      const item = line.match(new RegExp(`^\\s{${listIndent}}-\\s*(.+?)\\s*$`));
      if (item) values.push(clean(item[1]));
    }
  }

  return values;
}

function setYamlScalar(text, targetPath, value) {
  const lines = text.split(/\r?\n/);
  const stack = [];
  let changed = false;

  const output = lines.map((line) => {
    const match = line.match(/^(\s*)([A-Za-z0-9_-]+):(?:\s*(.*?))?\s*$/);
    if (!match) return line;

    const indent = match[1].length;
    const depth = Math.floor(indent / 2);
    const key = match[2];
    stack.length = depth;
    stack[depth] = key;

    if (samePath(stack.slice(0, depth + 1), targetPath)) {
      changed = true;
      return `${match[1]}${key}: ${formatYamlValue(value)}`;
    }

    return line;
  });

  if (!changed) {
    fail(`Could not update YAML path: ${targetPath.join(".")}`);
  }

  return output.join("\n");
}

function samePath(left, right) {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

function clean(value) {
  const trimmed = String(value || "").trim();
  if (trimmed === "null") return "";
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function formatYamlValue(value) {
  const string = String(value);
  if (!string) return '""';
  if (/[:#\[\]{}]|^\s|\s$/.test(string)) return JSON.stringify(string);
  return string;
}

function ensureFile(file, message) {
  if (!fs.existsSync(file)) fail(message);
}

function slug(value) {
  return String(value || "untitled")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "untitled";
}

function today() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function relative(file) {
  return path.relative(ROOT, file);
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
