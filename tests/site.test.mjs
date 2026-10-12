// Builds the site under different settings and checks what a visitor would get.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { checkSite, references } from "../scripts/site-checks.mjs";

const root = path.resolve(import.meta.dirname, "..");

function build(env) {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "keel-web-"));
  const clean = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith("PUBLIC_")));
  execFileSync(process.execPath, [path.join(root, "node_modules/astro/astro.js"), "build", "--silent"], {
    cwd: root, env: { ...clean, OUT_DIR: out, ...env }, stdio: "pipe",
  });
  return out;
}
const read = (dir, file) => fs.readFileSync(path.join(dir, file), "utf8");

const closed = build({});
const open = build({ PUBLIC_WAITLIST_ENDPOINT: "https://forms.example.test/f/abc", PUBLIC_CONTACT_EMAIL: "hello@example.test" });
const halfOpen = build({ PUBLIC_WAITLIST_ENDPOINT: "https://forms.example.test/f/abc" });
const customDomain = build({ SITE_URL: "https://keel.example.test" });
const projectSite = build({ BASE_PATH: "/keelyard-web" });

test("every internal link resolves on the organisation site, at the root", () => {
  assert.deepEqual(checkSite(closed, { base: "/", site: "https://vccorg.github.io" }), []);
  assert.deepEqual(checkSite(open, { base: "/", site: "https://vccorg.github.io" }), []);
  assert.match(read(closed, "index.html"), /href="\/privacy\/"/);
});

test("built as a project site, every link carries the repository's path", () => {
  assert.deepEqual(checkSite(projectSite, { base: "/keelyard-web", site: "https://vccorg.github.io" }), []);
  assert.match(read(projectSite, "index.html"), /href="\/keelyard-web\/privacy\/"/);
});

test("Jekyll is switched off, so _astro/ is served even if the source is ever set to a branch", () => {
  // GitHub Pages' branch mode runs Jekyll, which drops folders starting with "_".
  assert.ok(fs.existsSync(path.join(closed, ".nojekyll")));
  assert.ok(fs.readdirSync(closed).includes("_astro"));
});

test("a link without the base path is caught (it would 404 on a project site)", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "keel-web-bad-"));
  fs.mkdirSync(path.join(dir, "privacy"));
  fs.writeFileSync(path.join(dir, "privacy", "index.html"), "<p>x</p>");
  fs.writeFileSync(path.join(dir, "index.html"), '<a href="/privacy/">p</a><a href="#nope">n</a><script src="https://cdn.example/x.js"></script>');
  const problems = checkSite(dir, { base: "/keelyard-web", site: "https://vccorg.github.io" });
  assert.equal(problems.length, 3, problems.join("\n"));
});

test("a custom-domain build resolves and points canonical URLs at the domain", () => {
  assert.deepEqual(checkSite(customDomain, { base: "/", site: "https://keel.example.test" }), []);
  assert.match(read(customDomain, "index.html"), /<link rel="canonical" href="https:\/\/keel\.example\.test\/"/);
});

test("nothing is loaded from another site: no third-party scripts, styles, fonts or images", () => {
  for (const dir of [closed, open]) {
    for (const file of ["index.html", "capabilities/index.html", "use-cases/index.html", "privacy/index.html", "404.html"]) {
      const html = read(dir, file);
      for (const { attr, value } of references(html)) {
        if (attr === "src") assert.ok(!/^(https?:)?\/\//.test(value), `${file}: ${value}`);
      }
      assert.ok(!/<link[^>]+rel="stylesheet"[^>]+href="(https?:)?\/\//.test(html), file);
      assert.ok(!/fonts\.googleapis|googletagmanager|google-analytics|plausible|segment/.test(html), file);
    }
  }
});

test("with nothing configured the waitlist says it is opening, and shows no form", () => {
  const html = read(closed, "index.html");
  assert.ok(!html.includes("<form"));
  assert.match(html, /The waitlist opens shortly/);
  assert.match(read(closed, "privacy/index.html"), /collects no personal data/);
});

test("an endpoint without a contact address keeps the waitlist closed", () => {
  // Collecting emails with no address for data requests would make the privacy page untrue.
  assert.ok(!read(halfOpen, "index.html").includes("<form"));
  assert.match(read(halfOpen, "privacy/index.html"), /collects no personal data/);
});

test("fully configured, the form posts to the endpoint with the fields we promise", () => {
  const html = read(open, "index.html");
  assert.match(html, /<form[^>]+method="post"[^>]+action="https:\/\/forms\.example\.test\/f\/abc"/);
  assert.match(html, /name="email"[^>]*required/);
  for (const name of ["role", "team_size", "repo_host", "coding_agent", "design_partner", "_gotcha"]) {
    assert.match(html, new RegExp(`name="${name}"`), name);
  }
  const privacy = read(open, "privacy/index.html");
  assert.match(privacy, /mailto:hello@example\.test/);
  // The privacy page lists exactly what the form asks for.
  for (const thing of ["work email", "role", "team size", "where your code lives", "coding agent", "design partner"]) {
    assert.ok(privacy.toLowerCase().includes(thing), thing);
  }
});

test("every page has a title, a description and a canonical URL on the right host", () => {
  for (const file of ["index.html", "capabilities/index.html", "use-cases/index.html", "privacy/index.html"]) {
    const html = read(closed, file);
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.match(html, /<meta name="description" content="[^"]+"/);
    assert.match(html, /<link rel="canonical" href="https:\/\/vccorg\.github\.io\//);
  }
});

test("the 404 page is not indexed and claims no canonical URL", () => {
  const html = read(closed, "404.html");
  assert.match(html, /<meta name="robots" content="noindex"/);
  assert.ok(!html.includes('rel="canonical"'));
});

test("integrations are labelled, and planned ones are never shown as available", async () => {
  const html = read(closed, "index.html");
  for (const name of ["GitHub", "GitLab", "Claude Code"]) {
    const chip = html.match(new RegExp(`<li class="chip"[^>]*>\\s*${name}\\s*<span class="badge (\\w+)"`));
    assert.ok(chip, name);
    assert.equal(chip[1], "planned", name);
  }
});

// Node strips TypeScript types on import from 22.18, which is why package.json asks for it.
const { CAPABILITIES } = await import("../src/data/capabilities.ts");
const { USE_CASES } = await import("../src/data/useCases.ts");

test("every capability feature names where it lives in keelyard", () => {
  const ids = CAPABILITIES.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length, "capability ids are unique");
  for (const c of CAPABILITIES) {
    assert.ok(c.features.length > 0, c.id);
    for (const f of c.features) {
      // A path, not a promise: something like agentic-cli/src/... or dashboard/...
      assert.match(f.evidence, /^(agentic-cli|dashboard|desktop|skills|mcp-servers|kg-infrastructure)\//, `${c.id}: ${f.name}`);
    }
  }
});

test("the evidence paths are kept out of the published pages", () => {
  // The product repository is private, so a path is meaningless to a visitor and discloses its layout.
  const html = read(closed, "capabilities/index.html");
  for (const c of CAPABILITIES) {
    for (const f of c.features) assert.ok(!html.includes(f.evidence), f.evidence);
  }
});

test("every capability has its own section, and every use case points at real ones", () => {
  const caps = read(closed, "capabilities/index.html");
  for (const c of CAPABILITIES) assert.match(caps, new RegExp(`<section[^>]+id="${c.id}"`), c.id);
  const known = new Set(CAPABILITIES.map((c) => c.id));
  const used = new Set();
  for (const u of USE_CASES) {
    assert.ok(u.capabilities.length > 0 && u.steps.length > 0, u.id);
    for (const id of u.capabilities) {
      assert.ok(known.has(id), `${u.id} names unknown capability ${id}`);
      used.add(id);
    }
  }
  const html = read(closed, "use-cases/index.html");
  assert.match(html, /href="\/capabilities\/#context-lifecycle"/);
  // Every capability is put to work by at least one use case, or it is a feature nobody needs.
  for (const id of known) assert.ok(used.has(id), `no use case uses ${id}`);
});

test("dashboard pages that are still placeholders in keelyard are not advertised", () => {
  for (const file of ["index.html", "capabilities/index.html", "use-cases/index.html"]) {
    const html = read(closed, file);
    // Marketplace is static links in keelyard, not somewhere to browse or install skills.
    for (const name of ["Assignments", "Shared agents", "Shared KG", "Shared Agents", "Marketplace"]) {
      assert.ok(!html.includes(name), `${file}: ${name}`);
    }
  }
});

test("capabilities and use cases are in the main navigation on every page", () => {
  for (const file of ["index.html", "privacy/index.html", "404.html"]) {
    const html = read(projectSite, file);
    assert.match(html, /href="\/keelyard-web\/capabilities\/"/, file);
    assert.match(html, /href="\/keelyard-web\/use-cases\/"/, file);
  }
});
