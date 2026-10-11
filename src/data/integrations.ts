/**
 * What Keel connects to, and whether it does today.
 *
 * "available" means it is in the Keel codebase now; "planned" means it is on the
 * roadmap (docs/plans/MARKET_READINESS_PLAN.md in the keelyard repo) and not
 * shipped. Never mark something available that a user couldn't use today: the
 * whole pitch is that Keel doesn't overstate, and the site shouldn't either.
 *
 * Last checked against keelyard main at a3ff784.
 */
export type Status = "available" | "planned";

export interface Integration {
  name: string;
  status: Status;
}

export interface Group {
  title: string;
  blurb: string;
  items: Integration[];
}

export const GROUPS: Group[] = [
  {
    title: "Repository hosts",
    blurb: "Where the code and the pull requests live.",
    items: [
      { name: "Bitbucket", status: "available" },
      { name: "GitHub", status: "planned" },
      { name: "GitLab", status: "planned" },
    ],
  },
  {
    title: "Work and knowledge",
    blurb: "Where requirements, decisions and documentation live.",
    items: [
      { name: "Jira", status: "available" },
      { name: "Confluence", status: "available" },
      { name: "Glean", status: "available" },
    ],
  },
  {
    title: "Coding agents and IDEs",
    blurb: "What does the work, launched through one governed seam.",
    items: [
      { name: "Devin (cloud and CLI)", status: "available" },
      { name: "VS Code with Copilot", status: "available" },
      { name: "Cursor", status: "available" },
      { name: "Windsurf", status: "available" },
      { name: "Claude Code", status: "planned" },
      { name: "Codex", status: "planned" },
      { name: "Gemini CLI", status: "planned" },
    ],
  },
  {
    title: "Models",
    blurb: "Bring your own key, or run locally.",
    items: [
      { name: "Anthropic", status: "available" },
      { name: "OpenAI", status: "available" },
      { name: "Vertex AI", status: "available" },
      { name: "Hugging Face", status: "available" },
      { name: "Local models (Ollama, LM Studio, vLLM, llama.cpp)", status: "available" },
      { name: "Amazon Bedrock", status: "planned" },
      { name: "Azure OpenAI", status: "planned" },
    ],
  },
];
