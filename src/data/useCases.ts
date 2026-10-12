/**
 * Problems Keel solves, told from the side of the person who has them.
 *
 * Each use case lists the capabilities it draws on (ids from capabilities.ts);
 * the tests fail if one names a capability that doesn't exist. Steps describe
 * only what Keel does today: a use case that needs a planned integration
 * doesn't belong here until it ships.
 */
export interface UseCase {
  id: string;
  title: string;
  who: string;
  problem: string;
  steps: string[];
  capabilities: string[];
}

export const USE_CASES: UseCase[] = [
  {
    id: "agents-on-real-codebases",
    title: "Let coding agents work on a codebase they've never seen",
    who: "Engineering leads",
    problem:
      "Agents guess at conventions, miss the decisions written down in tickets and wikis, and nobody can tell what they were given.",
    steps: [
      "Onboard the repository and link its documentation and Jira project into a domain.",
      "Review the instructions Keel extracts; approved ones are stamped with their source.",
      "Hand tasks to Devin or open them in your IDE through one launch point, with that context attached.",
      "Read back what each session was given in the context trace.",
    ],
    capabilities: ["context-lifecycle", "build", "skills", "evaluation"],
  },
  {
    id: "onboard-engineers",
    title: "Get a new teammate shipping sooner",
    who: "Engineering managers",
    problem: "What a new engineer needs to know is scattered, out of date, or in someone's head.",
    steps: [
      "Score the domain's readiness across eight dimensions and see what is missing.",
      "Fill the gaps from the sources Keel points at, reviewed before anyone relies on them.",
      "Generate persona skills so the newcomer's own assistant starts with the domain's conventions.",
    ],
    capabilities: ["context-lifecycle", "knowledge", "skills"],
  },
  {
    id: "keep-instructions-true",
    title: "Keep agent instructions true when the docs change",
    who: "Domain owners",
    problem: "A wiki page is revised and every agent keeps following the old version, because nothing connects the two.",
    steps: [
      "Keel notices the source changed and checks each instruction drawn from it.",
      "Unchanged instructions carry on. Contradicted, reworded or unsupported ones go to the domain's owner.",
      "When one page feeds many domains, the fan-out plan shows where the change lands and whose decision each part is.",
    ],
    capabilities: ["context-lifecycle", "watchers"],
  },
  {
    id: "prove-compliance",
    title: "Show an auditor what an agent was allowed to do",
    who: "Platform and security teams",
    problem: "Rules about agents live in slide decks, every team interprets them differently, and nothing records the exceptions.",
    steps: [
      "Set a governance floor per product; domains inherit it and can only tighten it.",
      "Record any exception in the ledger, with a reason and an expiry.",
      "Check each session against the floor: pass, fail or undetermined, never a pass by default.",
      "Answer questions from the audit history and the context trace.",
    ],
    capabilities: ["governance", "evaluation", "platform"],
  },
  {
    id: "roll-out-skills",
    title: "Roll out agent skills without rolling out risk",
    who: "Developer-experience teams",
    problem: "Teams copy prompts and skills between repositories with no review, and a bad one spreads quietly.",
    steps: [
      "Install skills from the registry, matched to each repository automatically.",
      "Put a new skill through a trial: structure, security scan, policy and a model judge.",
      "Allow or deny skills per persona, and promote a team's improvement back to the registry.",
    ],
    capabilities: ["skills", "governance"],
  },
  {
    id: "build-internal-agent",
    title: "Build an internal agent on your own knowledge",
    who: "AI and platform engineers",
    problem: "Every team builds its own agent scaffolding, its own tool wiring and its own evaluation, or skips the evaluation.",
    steps: [
      "Start from an ADK or LangGraph template and compose tools, models and retrievers on the canvas.",
      "Connect the MCP servers it needs and keep their configuration in sync.",
      "Evaluate it against a dataset with Ragas metrics and a model judge before it is deployed.",
    ],
    capabilities: ["agent-builder", "mcp", "knowledge", "evaluation"],
  },
  {
    id: "automate-pr-review",
    title: "Review pull requests automatically, under your rules",
    who: "Teams on Bitbucket",
    problem: "Reviews queue up, and an automated reviewer that ignores the team's conventions makes more work than it saves.",
    steps: [
      "Build a reviewer from the PR-reviewer template, grounded in the domain's context.",
      "Bind it to the Bitbucket review-requested trigger.",
      "Each review runs through the same governance and tracing as a manual run.",
    ],
    capabilities: ["watchers", "agent-builder", "governance"],
  },
  {
    id: "idea-to-stories",
    title: "Turn an idea into stories that fit the system",
    who: "Business analysts and scrum masters",
    problem: "Stories are written without the constraints the domain already knows, and rework starts in refinement.",
    steps: [
      "Draft stories from an idea, informed by the domain's knowledge.",
      "Review them, then push them to Jira. Pushing needs its own permission.",
    ],
    capabilities: ["requirements", "knowledge"],
  },
  {
    id: "share-knowledge",
    title: "Share one body of knowledge across products",
    who: "Architecture and knowledge owners",
    problem: "Payments knowledge is copied into every product that touches payments, and the copies disagree.",
    steps: [
      "Create a knowledge domain owned by no single product.",
      "Link each product that needs it; every product reads the same source.",
      "See the whole picture on the portfolio map, with shared knowledge counted once.",
    ],
    capabilities: ["knowledge"],
  },
  {
    id: "context-cost",
    title: "Know what your agents' context costs",
    who: "Engineering leadership",
    problem: "Model spend grows and nobody can say which projects drive it, or whether the context was worth it.",
    steps: [
      "Keel counts tokens for every model call, separating building context from serving it.",
      "Price them against your own rate card. Calls with no price are shown as unpriced, not free.",
      "Compare cost against evaluation results to see what the spend bought.",
    ],
    capabilities: ["evaluation"],
  },
];
