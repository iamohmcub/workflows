#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const AI_DIR = path.join(ROOT, ".ai");
const PROJECT_FILE = path.join(AI_DIR, "project.yml");
const PHASE_FILE = path.join(AI_DIR, "global", "sdlc.phases.yml");
const AGENT_POSITIONS_FILE = path.join(AI_DIR, "global", "agent.positions.yml");
const PARALLEL_DELIVERY_FILE = path.join(AI_DIR, "global", "parallel.delivery.yml");
const RUNTIME_DIR = path.join(AI_DIR, "runtime");
const WORKSPACE_FILE = path.join(AI_DIR, "workspace", "workspace.yml");

const REQUIRED_FILES = [
  "README.md",
  "AGENTS.md",
  ".ai/manifest.yml",
  ".ai/SKILLS.md",
  ".ai/project.yml",
  ".ai/workspace/workspace.yml",
  ".ai/workspace/stacks.yml",
  ".ai/workspace/code-style.yml",
  ".ai/workspace/project-structure.yml",
  ".ai/workspace/tools.yml",
  ".ai/workspace/qa-process.yml",
  ".ai/global/company.skills.yml",
  ".ai/global/company.hooks.yml",
  ".ai/global/company.rules.yml",
  ".ai/global/agent.positions.yml",
  ".ai/global/parallel.delivery.yml",
  ".ai/global/sdlc.phases.yml"
];

const EVENT_ALIASES = {
  on_project_init: "init",
  on_phase_start: "start-phase",
  on_parallel_lane_start: "start-phase",
  on_impact_detected: "impact",
  on_bug_detected: "impact",
  on_agent_task_done: "commit"
};

const ROLE_MODULE_FILES = ["role.yml", "interface.yml", "playbook.md", "checklist.md", "workspace.yml"];

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
      case "commit":
        commitAsAgent(rest);
        break;
      case "commit-check":
        commitCheck(rest);
        break;
      case "validate":
        validate();
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
  npm run ai:init -- --repo-group-id acme --repo-group-name "Acme Platform" --repo-id checkout-service --repo-name "Checkout Service" --type product-service --phase okr --workspace-profile web-saas --frontend-stack nextjs-typescript --backend-stack node-api-typescript --infra-stack netlify-or-container --qa-profile playwright-vitest
  npm run ai:start -- okr
  npm run ai:start -- technical-design --mvp mvp-1 --lane engineering-delivery --depends-on ".ai/runtime/handoffs/<handoff>.md"
  npm run ai:trigger -- on_phase_start --phase prd
  npm run ai:trigger -- on_parallel_lane_start --phase prd --mvp mvp-2 --lane business-discovery
  npm run ai:trigger -- on_impact_detected --title "Analytics contract changed" --phase prd --affected-roles data-analyst,backend-engineer
  npm run ai:impact -- --title "API contract changed" --phase technical-design --severity P2
  npm run ai:handoff -- --from product-manager --to ux-designer --phase okr
  npm run ai:commit -- --agent Berners --message "implement checkout form" --evidence ".ai/runtime/logs/<phase-log>.md"
  npm run ai:commit-check
  npm run ai:validate

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
Workspace:  ${project.workspaceName} (${project.workspaceId})
Profile:    ${project.workspaceProfile}
Stacks:     frontend=${project.frontendStack}, backend=${project.backendStack}, infra=${project.infraStack}, qa=${project.qaProfile}
Phase:      ${project.currentPhase}${phase ? ` - ${phase.name}` : ""}
Owner:      ${phase?.owner || "unknown"}
Gate:       ${phase?.gate || "unknown"}

Next commands:
  npm run ai:start -- ${project.currentPhase}
  npm run ai:start -- ${project.currentPhase} --mvp <mvp-id> --lane ${defaultLaneForPhase(project.currentPhase)}
  npm run ai:trigger -- on_phase_start --phase ${project.currentPhase}
  npm run ai:commit -- --agent <agent-name-or-id> --message "<summary>" --evidence "<link>"
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

  if (Object.keys(options).length > 0 && fs.existsSync(WORKSPACE_FILE)) {
    let workspaceText = fs.readFileSync(WORKSPACE_FILE, "utf8");
    const workspaceReplacements = [
      [["workspace", "id"], options["workspace-id"] || options["repo-group-id"]],
      [["workspace", "name"], options["workspace-name"] || options["repo-group-name"]],
      [["workspace", "profile"], options["workspace-profile"]],
      [["workspace", "selected_profiles", "frontend"], options["frontend-stack"]],
      [["workspace", "selected_profiles", "backend"], options["backend-stack"]],
      [["workspace", "selected_profiles", "infra"], options["infra-stack"]],
      [["workspace", "selected_profiles", "qa"], options["qa-profile"]]
    ];

    for (const [yamlPath, value] of workspaceReplacements) {
      if (value) workspaceText = setYamlScalar(workspaceText, yamlPath, value);
    }

    fs.writeFileSync(WORKSPACE_FILE, workspaceText);
  }

  console.log(`Project initialized

Runtime folders:
  .ai/runtime/logs
  .ai/runtime/reports
  .ai/runtime/decisions
  .ai/runtime/handoffs

Config:
  .ai/project.yml
  .ai/workspace/workspace.yml

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
  const workItem = options.mvp || options["mvp-id"] || options["work-item"] || options["work-item-id"] || "";
  const lane = options.lane || defaultLaneForPhase(phaseId);
  const dependsOn = options["depends-on"] || options.handoff || "";
  const upstreamHandoff = options["upstream-handoff"] || dependsOn;
  const isParallel = Boolean(workItem || options.parallel || options.lane || dependsOn);

  if (!phase) {
    fail(`Unknown phase: ${phaseId}\nKnown phases: ${phases.map((item) => item.id).join(", ")}`);
  }

  ensureRuntimeDirs();
  if (!isParallel || options["set-current"]) updateCurrentPhase(phase.id);

  const date = today();
  const fileName = [date, workItem, phase.id, lane, project.repoId].filter(Boolean).map(slug).join("-");
  const file = path.join(RUNTIME_DIR, "logs", `${fileName}.md`);

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
Work item / MVP: ${workItem || "single-lane"}
Parallel lane: ${lane}
Upstream handoff: ${upstreamHandoff || "n/a"}
Depends on: ${dependsOn || "n/a"}
Owner role: ${phase.owner}
Supporting roles: ${supporting}
Gate: ${phase.gate}

## Source

- OKR / AC / ticket / incident / request:
- Related decisions:
- Related impact reports:
- Related handoffs:

## Parallel Flow

- [${isParallel ? " " : "x"}] Single-lane work, no parallel flow.
- [${isParallel ? "x" : " "}] Parallel work item/MVP is named.
- [${upstreamHandoff ? "x" : " "}] Upstream handoff is linked.
- [ ] Locked contracts are listed.
- [ ] Shared dependencies are listed.
- [ ] Work can continue without blocking unrelated lanes.

## Locked Contracts

- Scope:
- Acceptance criteria:
- Design:
- API:
- Data:
- Release expectation:

## Worker Boot

- [x] Read AGENTS.md
- [x] Read .ai/manifest.yml
- [x] Read .ai/SKILLS.md
- [x] Read .ai/global/parallel.delivery.yml
- [x] Read .ai/project.yml
- [x] Loaded shared workspace standards: .ai/workspace/
- [x] Loaded role module: .ai/role/${phase.owner}/
- [x] Loaded role config: .ai/role/${phase.owner}/role.yml
- [x] Loaded role interface: .ai/role/${phase.owner}/interface.yml
- [x] Loaded role playbook: .ai/role/${phase.owner}/playbook.md
- [x] Loaded role checklist: .ai/role/${phase.owner}/checklist.md
- [x] Loaded role workspace overlay: .ai/role/${phase.owner}/workspace.yml

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

## Agent Commit

- Agent name:
- Agent id:
- Commit:
- Evidence linked:

## Handoff

- Next owner:
- Next lane:
- Handoff unlocks:
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

Parallel:
  Work item/MVP: ${workItem || "single-lane"}
  Lane: ${lane}
  Repo current phase changed: ${!isParallel || options["set-current"] ? "yes" : "no"}

Next:
  Read .ai/role/${phase.owner}/role.yml
  Read .ai/role/${phase.owner}/interface.yml
  Read .ai/role/${phase.owner}/playbook.md
  Read .ai/role/${phase.owner}/checklist.md
  Read .ai/role/${phase.owner}/workspace.yml
  Complete DoD item by item
  Run npm run ai:impact -- --title "<title>" if another role or repo is affected
  Run npm run ai:commit -- --agent <agent-name-or-id> --message "<summary>" --evidence "<link>" when the task is done
  Keep upstream lanes moving when handoff contracts are locked and dependencies are clear
`);
}

function trigger(argv) {
  const hook = firstPositional(argv);

  if (!hook || hook === "--list") {
    console.log(`Automation triggers

  on_project_init      -> npm run ai:init
  on_phase_start       -> npm run ai:start -- <phase>
  on_parallel_lane_start -> npm run ai:start -- <phase> --mvp <mvp-id> --lane <lane>
  on_impact_detected   -> npm run ai:impact -- --title "<title>"
  on_bug_detected      -> npm run ai:impact -- --title "<bug title>" --severity P1
  on_agent_task_done   -> npm run ai:commit -- --agent <agent-name-or-id> --message "<summary>" --evidence "<link>"

Usage patterns:
  npm run ai:trigger -- on_project_init
  npm run ai:trigger -- on_phase_start --phase okr
  npm run ai:trigger -- on_parallel_lane_start --phase technical-design --mvp mvp-1 --lane engineering-delivery --depends-on ".ai/runtime/handoffs/<handoff>.md"
  npm run ai:trigger -- on_impact_detected --title "Analytics contract changed" --phase okr --affected-roles data-analyst
  npm run ai:trigger -- on_agent_task_done --agent Berners --message "implement checkout form" --evidence ".ai/runtime/logs/<phase-log>.md"
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
  if (command === "commit") commitAsAgent(argv.slice(1));
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
  const workItem = options.mvp || options["mvp-id"] || options["work-item"] || options["work-item-id"] || "TBD";
  const lane = options.lane || defaultLaneForPhase(phaseId);

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
Work item / MVP: ${workItem}
Parallel lane: ${lane}
Severity: ${severity}
Gate blocking: ${gateBlocking}

## Summary

${options.summary || "Describe what changed and why it matters."}

## Affected Scope

- Affected repos: ${affectedRepos}
- Affected roles: ${affectedRoles}
- Affected lanes: ${options["affected-lanes"] || "TBD"}
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
  const workItem = options.mvp || options["mvp-id"] || options["work-item"] || options["work-item-id"] || "";
  const fromLane = options["from-lane"] || options.lane || defaultLaneForPhase(phaseId);
  const toLane = options["to-lane"] || "";

  ensureRuntimeDirs();

  const date = today();
  const fileName = [date, workItem, slug(from), "to", slug(to), phaseId].filter(Boolean).map(slug).join("-");
  const file = path.join(RUNTIME_DIR, "handoffs", `${fileName}.md`);

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
Work item / MVP: ${workItem || "single-lane"}
From lane: ${fromLane}
To lane: ${toLane || "TBD"}

## Locked Contracts

- Scope:
- Acceptance criteria:
- Design:
- API:
- Data:
- Release expectation:

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

## Parallel Continuation

- Upstream role may continue next phase or next MVP: yes | no
- Downstream lane is unlocked: yes | no
- Impact report required for later contract changes: yes
`;

  fs.writeFileSync(file, content);

  console.log(`Created handoff note:
  ${relative(file)}

Next:
  Link it from the phase log before moving to the next phase
`);
}

function commitAsAgent(argv) {
  const options = parseOptions(argv);
  const project = readProject();
  const agents = readAgentPositions();
  const agentInput = options.agent || options["agent-id"];
  const message = options.message;
  const evidence = options.evidence;

  if (!agentInput) fail('Missing --agent <callsign, short name, position, or stable id>');
  if (!message) fail('Missing --message "completed task summary"');
  if (!evidence) fail("Missing --evidence <phase log, report, handoff, test, or review link>");

  const agent = resolveAgent(agents, agentInput);
  if (!agent) {
    fail(`Unknown agent: ${agentInput}

Known agents:
${agents.map((item) => `  ${item.name} (${item.id})`).join("\n")}
`);
  }

  if (!options["dry-run"] && !hasStagedChanges()) {
    fail("No staged changes. Stage the completed task files before running ai:commit.");
  }

  const phase = options.phase || project.currentPhase;
  const role = options.role || agent.mapsToRole;
  const workItem = options.mvp || options["mvp-id"] || options["work-item"] || options["work-item-id"];
  const lane = options.lane || defaultLaneForPhase(phase);
  const summary = stripAgentPrefix(message, agent);
  const subject = `${agent.name}: ${summary}`;
  const author = agentAuthor(agent);
  const body = [
    `AI-Agent-Name: ${agent.name}`,
    `AI-Agent: ${agent.id}`,
    `AI-Role: ${role}`,
    `AI-Phase: ${phase}`,
    workItem ? `AI-Work-Item: ${workItem}` : "",
    lane ? `AI-Lane: ${lane}` : "",
    "AI-Task-Done: yes",
    `AI-Evidence: ${evidence}`
  ].filter(Boolean).join("\n");

  if (options["dry-run"]) {
    console.log(`Author: ${author}
Subject: ${subject}

${body}
`);
    return;
  }

  execFileSync("git", ["commit", "--author", author, "-m", subject, "-m", body], { cwd: ROOT, stdio: "inherit" });
}

function commitCheck(argv) {
  const options = parseOptions(argv);
  const agents = readAgentPositions();
  const isSynthetic = Boolean(options.subject || options.body);
  const subject = options.subject || gitOutput(["log", "-1", "--pretty=%s"]);
  const body = options.body || gitOutput(["log", "-1", "--pretty=%b"]);
  const author = options.author || (isSynthetic ? "" : gitOutput(["log", "-1", "--pretty=%an <%ae>"]));
  const subjectAgent = subject.split(":")[0].trim();
  const agent = resolveAgent(agents, subjectAgent);
  const errors = [];

  if (!agent) {
    errors.push(`Commit subject must start with a known agent callsign, like "Agent Berners: ...". Found: ${subject}`);
  }

  const trailers = parseTrailers(body);
  const required = ["AI-Agent-Name", "AI-Agent", "AI-Role", "AI-Phase", "AI-Task-Done", "AI-Evidence"];

  for (const key of required) {
    if (!trailers[key]) errors.push(`Missing commit trailer: ${key}`);
  }

  if (agent && trailers["AI-Agent"] && trailers["AI-Agent"] !== agent.id) {
    errors.push(`AI-Agent trailer must match the subject agent stable id. Subject=${agent.name}, expected=${agent.id}, trailer=${trailers["AI-Agent"]}`);
  }

  if (agent && trailers["AI-Agent-Name"] && trailers["AI-Agent-Name"] !== agent.name) {
    errors.push(`AI-Agent-Name trailer must match the subject agent callsign. Subject=${agent.name}, trailer=${trailers["AI-Agent-Name"]}`);
  }

  if (agent && author) {
    const expectedAuthor = agentAuthor(agent);
    if (author !== expectedAuthor) {
      errors.push(`Git author must be the agent author. Expected=${expectedAuthor}, actual=${author}`);
    }
  }

  if (trailers["AI-Task-Done"] && trailers["AI-Task-Done"].toLowerCase() !== "yes") {
    errors.push('AI-Task-Done must be "yes" for agent done commits.');
  }

  if (["tbd", "todo", "none", "n/a"].includes(String(trailers["AI-Evidence"] || "").toLowerCase())) {
    errors.push("AI-Evidence must link real evidence, not a placeholder.");
  }

  if (errors.length) {
    console.error(`Agent commit check failed

${errors.map((item) => `- ${item}`).join("\n")}
`);
    process.exitCode = 1;
    return;
  }

  console.log(`Agent commit check passed

Agent: ${agent.name} (${agent.id})
Author: ${author || agentAuthor(agent)}
Role:  ${trailers["AI-Role"]}
Phase: ${trailers["AI-Phase"]}
`);
}

function validate() {
  const errors = [];

  for (const file of REQUIRED_FILES) {
    if (!fs.existsSync(path.join(ROOT, file))) errors.push(`Missing required file: ${file}`);
  }

  ensureFile(PROJECT_FILE, "Missing .ai/project.yml");
  ensureFile(PHASE_FILE, "Missing .ai/global/sdlc.phases.yml");
  ensureFile(PARALLEL_DELIVERY_FILE, "Missing .ai/global/parallel.delivery.yml");
  ensureFile(WORKSPACE_FILE, "Missing .ai/workspace/workspace.yml");

  const project = readProject();
  const phases = readPhases();
  const phase = phaseById(phases, project.currentPhase);

  if (!project.repoGroupId) errors.push("project.repo_group.id is empty");
  if (!project.repoId) errors.push("project.repo.id is empty");
  if (!project.workspaceId) errors.push("workspace.id is empty");
  if (!project.workspaceProfile) errors.push("workspace.profile is empty");
  if (!project.frontendStack) errors.push("workspace.selected_profiles.frontend is empty");
  if (!project.backendStack) errors.push("workspace.selected_profiles.backend is empty");
  if (!project.infraStack) errors.push("workspace.selected_profiles.infra is empty");
  if (!project.qaProfile) errors.push("workspace.selected_profiles.qa is empty");
  if (!project.currentPhase) errors.push("project.lifecycle.current_phase is empty");
  if (!phase) errors.push(`Current phase is not defined in sdlc.phases.yml: ${project.currentPhase}`);

  const rolesToValidate = unique(["orchestrator", ...project.activeRoles, phase?.owner].filter(Boolean));
  for (const role of rolesToValidate) {
    for (const file of ROLE_MODULE_FILES) {
      const roleFile = path.join(AI_DIR, "role", role, file);
      if (!fs.existsSync(roleFile)) {
        errors.push(`Missing role module file: .ai/role/${role}/${file}`);
      }
    }
  }

  for (const dir of ["logs", "reports", "decisions", "handoffs"]) {
    const full = path.join(RUNTIME_DIR, dir);
    if (!fs.existsSync(full)) errors.push(`Missing runtime folder: .ai/runtime/${dir}`);
  }

  const agents = readAgentPositions();
  const expectedAgents = [
    "prompter-agent",
    "orchestrator-agent",
    "product-manager-agent",
    "data-analyst-agent",
    "designer-agent",
    "product-owner-agent",
    "tech-lead-agent",
    "frontend-agent",
    "backend-agent",
    "security-agent",
    "legal-agent",
    "qa-agent",
    "devops-agent",
    "monitoring-agent",
    "auditor-agent"
  ];

  if (agents.length !== expectedAgents.length) {
    errors.push(`Expected ${expectedAgents.length} agent positions, found ${agents.length}`);
  }

  for (const agentId of expectedAgents) {
    if (!agents.some((agent) => agent.id === agentId)) errors.push(`Missing agent position: ${agentId}`);
  }

  for (const agent of agents) {
    if (!agent.mapsToRole) errors.push(`Agent position is missing maps_to_role: ${agent.id}`);
    if (!agent.name?.startsWith("Agent ")) errors.push(`Agent position is missing callsign name: ${agent.id}`);
    if (!agent.shortName) errors.push(`Agent position is missing short_name: ${agent.id}`);
    if (!agent.position) errors.push(`Agent position is missing position: ${agent.id}`);
    if (!agent.authorEmail) errors.push(`Agent position is missing git_author_email: ${agent.id}`);
  }

  const parallelText = fs.readFileSync(PARALLEL_DELIVERY_FILE, "utf8");
  for (const lane of ["business-discovery", "product-design", "engineering-delivery", "quality-release", "operations-learning"]) {
    if (!parallelText.includes(`${lane}:`)) errors.push(`Missing parallel delivery lane: ${lane}`);
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
Role module: .ai/role/${phase.owner}/
Workspace: ${project.workspaceProfile}
Known phases: ${phases.length}
`);
}

function readAgentPositions() {
  ensureFile(AGENT_POSITIONS_FILE, "Missing .ai/global/agent.positions.yml");
  const lines = fs.readFileSync(AGENT_POSITIONS_FILE, "utf8").split(/\r?\n/);
  const agents = [];
  let current = null;

  for (const line of lines) {
    if (/^  - number:\s*/.test(line)) {
      if (current) agents.push(current);
      current = {};
      continue;
    }

    if (!current) continue;

    const field = line.match(/^    ([a-zA-Z0-9_-]+):\s*(.*?)\s*$/);
    if (!field) continue;

    const key = field[1];
    const value = clean(field[2]);
    if (key === "id") current.id = value;
    if (key === "name") current.name = value;
    if (key === "short_name") current.shortName = value;
    if (key === "git_author_email") current.authorEmail = value;
    if (key === "position") current.position = value;
    if (key === "maps_to_role") current.mapsToRole = value;
  }

  if (current) agents.push(current);
  return agents.filter((agent) => agent.id);
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
    activeRoles: getYamlList(text, ["project", "roles", "active"]),
    ...readWorkspace()
  };
}

function readWorkspace() {
  if (!fs.existsSync(WORKSPACE_FILE)) {
    return {
      workspaceId: "",
      workspaceName: "",
      workspaceProfile: "",
      frontendStack: "",
      backendStack: "",
      infraStack: "",
      qaProfile: ""
    };
  }

  const text = fs.readFileSync(WORKSPACE_FILE, "utf8");
  return {
    workspaceId: getYamlScalar(text, ["workspace", "id"]),
    workspaceName: getYamlScalar(text, ["workspace", "name"]),
    workspaceProfile: getYamlScalar(text, ["workspace", "profile"]),
    frontendStack: getYamlScalar(text, ["workspace", "selected_profiles", "frontend"]),
    backendStack: getYamlScalar(text, ["workspace", "selected_profiles", "backend"]),
    infraStack: getYamlScalar(text, ["workspace", "selected_profiles", "infra"]),
    qaProfile: getYamlScalar(text, ["workspace", "selected_profiles", "qa"])
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

function defaultLaneForPhase(phaseId) {
  const lanes = {
    okr: "business-discovery",
    "user-research": "product-design",
    prd: "business-discovery",
    "ux-design": "product-design",
    "technical-design": "engineering-delivery",
    development: "engineering-delivery",
    "qa-testing": "quality-release",
    "release-deployment": "quality-release",
    monitoring: "operations-learning",
    "measure-iterate": "operations-learning"
  };
  return lanes[phaseId] || "business-discovery";
}

function resolveAgent(agents, value) {
  const normalized = normalizeAgentKey(value);
  return agents.find((agent) => {
    const keys = [agent.id, agent.name, agent.shortName, agent.position].filter(Boolean);
    return keys.some((key) => normalizeAgentKey(key) === normalized);
  });
}

function stripAgentPrefix(message, agent) {
  let summary = String(message || "").trim();
  for (const prefix of [agent.name, agent.id, agent.shortName].filter(Boolean)) {
    const token = `${prefix}:`;
    if (summary.toLowerCase().startsWith(token.toLowerCase())) {
      summary = summary.slice(token.length).trim();
      break;
    }
  }
  return summary;
}

function normalizeAgentKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^agent\s+/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function agentAuthor(agent) {
  return `${agent.name} <${agent.authorEmail || `${slug(agent.id)}@ai.local`}>`;
}

function gitOutput(args) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
}

function hasStagedChanges() {
  try {
    execFileSync("git", ["diff", "--cached", "--quiet"], { cwd: ROOT, stdio: "ignore" });
    return false;
  } catch (error) {
    if (error.status === 1) return true;
    throw error;
  }
}

function parseTrailers(text) {
  const trailers = {};
  for (const line of String(text || "").split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9-]+):\s*(.*?)\s*$/);
    if (match) trailers[match[1]] = match[2];
  }
  return trailers;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
