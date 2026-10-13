/**
 * What Keel does, grouped into the capabilities a buyer would recognise.
 *
 * Every feature names its `evidence`: the path in the keelyard repository where
 * it is implemented. That field is not shown on the site (the product repo is
 * not public); it is there so whoever edits this file can check a claim before
 * keeping it, and so the tests can refuse a feature nobody can point at.
 * Roadmap items belong in integrations.ts as "planned", not here.
 *
 * Last checked against keelyard main at a3ff784.
 */
export interface Feature {
  name: string;
  detail: string;
  /** keelyard path that implements it. Not rendered. */
  evidence: string;
}

export interface Capability {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  features: Feature[];
  /** Where a user meets it: CLI command groups and dashboard pages. */
  cli: string[];
  dashboard: string[];
}

export const CAPABILITIES: Capability[] = [
  {
    id: "context-lifecycle",
    name: "Context lifecycle",
    tagline: "Context that is drawn from sources, reviewed by a person, and kept true.",
    summary:
      "A domain's context is built from its repositories, documentation and tickets, reviewed before an agent sees it, scored for readiness, and watched for drift for as long as it is in use.",
    features: [
      { name: "Domain onboarding", detail: "Create a domain, link its repositories and documentation, and generate its context repository in one flow.", evidence: "agentic-cli/src/agentic_cli/commands/domain.py" },
      { name: "Reviewed extraction", detail: "Instructions extracted from sources wait for a person to approve them, and every file records where its content came from.", evidence: "agentic-cli/src/agentic_cli/commands/domain_onboarding.py" },
      { name: "Nothing invented", detail: "Filler is never served as context, and an instruction carrying a name, an email or a credential is held back rather than written down.", evidence: "agentic-cli/src/agentic_cli/commands/domain_onboarding.py" },
      { name: "Readiness score", detail: "Eight dimensions answering one question: could a competent new teammate ship from this domain?", evidence: "agentic-cli/src/agentic_cli/commands/domain_onboarding.py" },
      { name: "Semantic drift", detail: "When a source changes, see whether each approved instruction is unchanged, reworded, contradicted or no longer supported.", evidence: "agentic-cli/src/agentic_cli/commands/domain_onboarding.py" },
      { name: "Fan-out plan and review queue", detail: "One source change, planned across every domain that uses it, with the decisions it needs routed to each domain's recorded owner.", evidence: "agentic-cli/src/agentic_cli/commands/domain_onboarding.py" },
      { name: "Template drift", detail: "Tell a template change from a local edit, and upgrade generated files without losing either.", evidence: "agentic-cli/src/agentic_cli/meta_repo/template_drift.py" },
      { name: "Portable context bundles", detail: "Render a domain's reviewed knowledge into a bundle an agent can take with it.", evidence: "agentic-cli/src/agentic_cli/context/portable.py" },
    ],
    cli: ["keel domain", "keel domain template", "keel context"],
    dashboard: ["Domain onboarding", "Snapshots"],
  },
  {
    id: "knowledge",
    name: "Knowledge management",
    tagline: "One body of knowledge, shared across products and searchable by agents.",
    summary:
      "Ingest documents and code into a knowledge graph, organise it into knowledge domains that several products can draw on, and give agents named search indexes to query.",
    features: [
      { name: "Knowledge graph ingest", detail: "Ingest documents and code in the background and follow progress, with coverage reported per domain.", evidence: "agentic-cli/src/agentic_cli/kg/async_ingest.py" },
      { name: "Knowledge and code graphs", detail: "Browse what the graph knows alongside the structure of the code itself.", evidence: "agentic-cli/src/agentic_cli/kg/graphify_integration.py" },
      { name: "Shared knowledge domains", detail: "Payments or Identity knowledge, owned by no single product and read by every product that needs it.", evidence: "agentic-cli/src/agentic_cli/commands/knowledge_domain.py" },
      { name: "Retrievers", detail: "Named search indexes agents bind to. Full-text indexes build locally with no server.", evidence: "agentic-cli/src/agentic_cli/indexing.py" },
      { name: "Data sources", detail: "Register the systems knowledge comes from and see what has been indexed from each.", evidence: "agentic-cli/src/agentic_cli/commands/data.py" },
      { name: "OKF export", detail: "Export knowledge as Markdown bundles in the Open Knowledge Format, with provenance kept.", evidence: "agentic-cli/src/agentic_cli/kg/okf/exporter.py" },
      { name: "Portfolio map", detail: "Products, the knowledge they draw on, and the delivery scopes and projects under them, with unrecorded links reported rather than guessed.", evidence: "agentic-cli/src/agentic_cli/portfolio.py" },
    ],
    cli: ["keel kg", "keel knowledge-domain", "keel retriever", "keel data", "keel product"],
    dashboard: ["Knowledge", "Graph", "Knowledge domains", "Retrievers", "Data sources", "Portfolio"],
  },
  {
    id: "agent-builder",
    name: "Agent builder",
    tagline: "Build your own agents from templates, tools and your knowledge.",
    summary:
      "Start an agent project from a template, wire in tools, models and retrievers on a canvas, then run, test and deploy it.",
    features: [
      { name: "Templates", detail: "Six starting points on Google ADK and LangGraph: basic, PR reviewer, retrieval (RAG), scrum master, multi-agent and conversational.", evidence: "agentic-cli/src/agentic_cli/templates/scaffolds.py" },
      { name: "Tool library", detail: "Ready-made tools for Jira, Confluence and Slack, file processing, text analysis and calculation.", evidence: "agentic-cli/src/agentic_cli/commands/agent_tool.py" },
      { name: "Project canvas", detail: "Compose agents, models, tools, retrievers and databases visually, and validate the project before it runs.", evidence: "dashboard/frontend/src/pages/ProjectCanvas.tsx" },
      { name: "Run and test", detail: "Start, stop, test and read the logs of agents from the CLI or dashboard.", evidence: "agentic-cli/src/agentic_cli/commands/agent.py" },
      { name: "Deployments", detail: "Track where each agent project is deployed.", evidence: "dashboard/backend/src/api/deployments.py" },
    ],
    cli: ["keel project", "keel agent", "keel agent-template", "keel agent-tool"],
    dashboard: ["Quickstart", "Project canvas", "Agents", "Models", "Tools", "Deployments"],
  },
  {
    id: "skills",
    name: "Skills management",
    tagline: "Give every agent the right instructions, and only the ones you allow.",
    summary:
      "A registry of reusable skills, matched to each repository automatically, generated per role, tried before they are trusted, and governed by policy.",
    features: [
      { name: "Skills registry", detail: "More than sixty packaged skills, matched to a repository by its files and dependencies.", evidence: "skills/registry.json" },
      { name: "Persona skills", detail: "Skills generated for developers, QA, business analysts and scrum masters from the domain's own context.", evidence: "agentic-cli/src/agentic_cli/persona_catalog.py" },
      { name: "Allow and deny policy", detail: "Decide per persona which skills may be installed.", evidence: "agentic-cli/src/agentic_cli/meta_repo/skill_policy.py" },
      { name: "Skill trials", detail: "Check a skill's structure, scan it for security problems, test it against policy, and have it judged before it is published.", evidence: "dashboard/backend/src/services/skill_trial_service.py" },
      { name: "Security scan", detail: "Flag skills that ask an agent to do something risky.", evidence: "agentic-cli/src/agentic_cli/skill_security.py" },
      { name: "Upstream promotion", detail: "Promote a skill a team improved back to the shared registry.", evidence: "agentic-cli/src/agentic_cli/skills_upstream.py" },
    ],
    cli: ["keel skill", "keel skill-registry", "keel skill upstream"],
    dashboard: ["Skills", "Persona skills", "Skill trials"],
  },
  {
    id: "mcp",
    name: "MCP management",
    tagline: "Run and connect the MCP servers your agents use, from one place.",
    summary:
      "Add, start, health-check and sync Model Context Protocol servers, and keep their credentials in step with your environment.",
    features: [
      { name: "Server lifecycle", detail: "Add, import, start, stop, remove and read the logs of MCP servers.", evidence: "agentic-cli/src/agentic_cli/commands/mcp.py" },
      { name: "Health checks", detail: "See which servers are up and answering.", evidence: "agentic-cli/src/agentic_cli/mcp/health.py" },
      { name: "Sync to agents and IDEs", detail: "Write server configuration and environment to the tools that use them.", evidence: "agentic-cli/src/agentic_cli/mcp/sync.py" },
      { name: "Included servers", detail: "Servers for Jira, Confluence, Bitbucket, Glean, the knowledge graph and agent memory, runnable together with Docker Compose.", evidence: "mcp-servers/docker-compose.yml" },
    ],
    cli: ["keel mcp"],
    dashboard: ["MCP servers"],
  },
  {
    id: "governance",
    name: "Governance",
    tagline: "One floor per product. Exceptions on the record. No pass for what can't be shown.",
    summary:
      "Each product sets a governance floor its domains may tighten but not loosen without an exception, and every agent session is checked against it.",
    features: [
      { name: "Governance floor", detail: "Product-level values that every domain inherits and can only tighten.", evidence: "agentic-cli/src/agentic_cli/guard_floor.py" },
      { name: "Exceptions ledger", detail: "A recorded, expiring waiver for a domain that needs to sit below the floor, and why.", evidence: "agentic-cli/src/agentic_cli/meta_repo/governance_promote.py" },
      { name: "Session checks", detail: "Findings about each component, composed into pass, fail or undetermined. Never a pass for what could not be established.", evidence: "agentic-cli/src/agentic_cli/guard_findings.py" },
      { name: "Build governance", detail: "Off, warn or enforce for every agent session, set by policy.", evidence: "agentic-cli/src/agentic_cli/meta_repo/build_governance.py" },
      { name: "Company-data guard", detail: "Keep secrets and site-specific terms out of commits, with the guard list itself kept out of the repository.", evidence: "agentic-cli/src/agentic_cli/guard.py" },
    ],
    cli: ["keel governance", "keel guard"],
    dashboard: ["Portfolio", "Administration"],
  },
  {
    id: "build",
    name: "Governed builds",
    tagline: "Hand work to any coding agent through one governed launch point.",
    summary:
      "Onboard a repository, then send a task to a cloud agent, a local engine or an IDE, with the reviewed context attached and the same governance applied whichever you choose.",
    features: [
      { name: "Repository onboarding", detail: "Analyse a repository, install the skills that match it, and optionally build its code graph.", evidence: "agentic-cli/src/agentic_cli/commands/code.py" },
      { name: "Engine registry", detail: "Devin (cloud and CLI), a local engine and IDE hand-offs, chosen by configuration.", evidence: "agentic-cli/src/agentic_cli/execution/registry.py" },
      { name: "IDE hand-off", detail: "Open a task in VS Code with Copilot, Cursor or Windsurf.", evidence: "agentic-cli/src/agentic_cli/code_assist/tools.py" },
      { name: "Build sessions", detail: "Follow every session an agent runs, and the context it was given.", evidence: "dashboard/frontend/src/pages/BuildSessions.tsx" },
    ],
    cli: ["keel code", "keel execution", "keel devin"],
    dashboard: ["Code onboarding", "Build sessions", "Execution context"],
  },
  {
    id: "watchers",
    name: "Watchers",
    tagline: "Agents that act when something happens, under the same rules as a manual run.",
    summary:
      "Bind a trigger to an agent. Keel polls the source and dispatches through the same governance a manual run goes through.",
    features: [
      { name: "Pull-request reviews", detail: "Start an agent when a Bitbucket pull request asks for review.", evidence: "agentic-cli/src/agentic_cli/watchers/triggers/bitbucket_pr.py" },
      { name: "Drift triggers", detail: "Start an agent when a domain's sources drift.", evidence: "agentic-cli/src/agentic_cli/watchers/triggers/drift.py" },
      { name: "Trigger registry", detail: "New event sources are adapters, not changes to Keel's core.", evidence: "agentic-cli/src/agentic_cli/watchers/registry.py" },
    ],
    cli: [],
    dashboard: ["Watchers"],
  },
  {
    id: "evaluation",
    name: "Evaluation and tracing",
    tagline: "Know what an agent read, what it cost, and whether it was any good.",
    summary:
      "Every context read is recorded, model calls are counted and priced, and agents and skills are scored by datasets, metrics and model judges.",
    features: [
      { name: "Context trace", detail: "A ledger of every read: source, operation, size, latency and outcome. Arguments are digested, never stored.", evidence: "agentic-cli/src/agentic_cli/tracing.py" },
      { name: "Payload store", detail: "Optionally keep what was read, masked and capped. Off until an operator turns it on.", evidence: "agentic-cli/src/agentic_cli/payload_store.py" },
      { name: "Tokens and cost", detail: "Building context and serving it, counted separately, with measured and estimated counts kept apart, against your own rate card. An unpriced call is never counted as free.", evidence: "agentic-cli/src/agentic_cli/pricing.py" },
      { name: "Evaluations", detail: "Datasets, golden sets and metrics, including Ragas and model-as-judge, run against agents and compared.", evidence: "agentic-cli/src/agentic_cli/evaluation/frameworks/ragas_adapter.py" },
      { name: "Context playground", detail: "Try a question against a domain's context and see what would be retrieved.", evidence: "agentic-cli/src/agentic_cli/evaluation/playground.py" },
      { name: "Session feed", detail: "Turn real agent sessions and their outcomes into evaluation data.", evidence: "agentic-cli/src/agentic_cli/evaluation/session_feed.py" },
    ],
    cli: ["keel eval", "keel context trace"],
    dashboard: ["Evaluation", "Context trace"],
  },
  {
    id: "requirements",
    name: "Requirements",
    tagline: "From an idea to stories in Jira, grounded in what the domain already knows.",
    summary:
      "Turn an idea into stories informed by the domain's knowledge, and push them to Jira when someone with permission says so.",
    features: [
      { name: "Ideate", detail: "Draft stories from an idea using the domain's context.", evidence: "dashboard/backend/src/api/ideate.py" },
      { name: "Push to Jira", detail: "Send approved stories to the domain's Jira project, behind its own permission.", evidence: "dashboard/backend/src/api/ideate.py" },
      { name: "Tasks", detail: "Track the work items that come out of it.", evidence: "dashboard/frontend/src/pages/Tasks.tsx" },
    ],
    cli: [],
    dashboard: ["Ideate", "Tasks"],
  },
  {
    id: "platform",
    name: "Platform and administration",
    tagline: "Runs on your machine or your servers, with access control and an audit trail.",
    summary:
      "A desktop app, a command-line tool and a web dashboard over the same core, with roles, single sign-on, audit history and your choice of models.",
    features: [
      { name: "Desktop, CLI and dashboard", detail: "A desktop app for macOS and Windows, or the CLI and dashboard on your own servers.", evidence: "desktop/" },
      { name: "Models your way", detail: "Hosted providers with your own keys, local models, or a test mode with no keys at all.", evidence: "agentic-cli/src/agentic_cli/llm/" },
      { name: "Roles and sign-on", detail: "Viewer, developer, maintainer and admin roles, with single sign-on through your identity proxy.", evidence: "agentic-cli/src/agentic_cli/auth/providers.py" },
      { name: "Audit and activity", detail: "Who did what, and when.", evidence: "dashboard/frontend/src/pages/AuditHistory.tsx" },
      { name: "Administration", detail: "Skill enforcement, build-governance defaults, branding and which parts of the dashboard each team sees.", evidence: "agentic-cli/src/agentic_cli/admin/settings.py" },
      { name: "Health check", detail: "One command that tells you what is set up and what is missing.", evidence: "agentic-cli/src/agentic_cli/doctor.py" },
    ],
    cli: ["keel doctor", "keel admin", "keel auth"],
    dashboard: ["Identity and access", "People", "Audit history", "Activity", "Administration"],
  },
];

export const capabilityById = (id: string) => CAPABILITIES.find((c) => c.id === id);
