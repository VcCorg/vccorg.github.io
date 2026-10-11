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
const customDomain = build({ SITE_URL: "https://keel.example.test", BASE_PATH: "/" });

test("every internal link resolves on GitHub Pages, under the project base path", () => {
  assert.deepEqual(checkSite(closed, { base: "/keelyard-web", site: "https://vccorg.github.io" }), []);
  assert.deepEqual(checkSite(open, { base: "/keelyard-web", site: "https://vccorg.github.io" }), []);
});

test("a link without the base path is caught (it would 404 on a project site)", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "keel-web-bad-"));
  fs.mkdirSync(path.join(dir, "privacy"));
  fs.writeFileSync(path.join(dir, "privacy", "index.html"), "<p>x</p>");
  fs.writeFileSync(path.join(dir, "index.html"), '<a href="/privacy/">p</a><a href="#nope">n</a><script src="https://cdn.example/x.js"></script>');
  const problems = checkSite(dir, { base: "/keelyard-web", site: "https://vccorg.github.io" });
  assert.equal(problems.length, 3, problems.join("\n"));
});

test("a custom-domain build (base /) also resolves", () => {
  assert.deepEqual(checkSite(customDomain, { base: "/", site: "https://keel.example.test" }), []);
  assert.match(read(customDomain, "index.html"), /href="\/privacy\/"/);
});

test("nothing is loaded from another site: no third-party scripts, styles, fonts or images", () => {
  for (const dir of [closed, open]) {
    for (const file of ["index.html", "privacy/index.html", "404.html"]) {
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
  for (const file of ["index.html", "privacy/index.html"]) {
    const html = read(closed, file);
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.match(html, /<meta name="description" content="[^"]+"/);
    assert.match(html, /<link rel="canonical" href="https:\/\/vccorg\.github\.io\/keelyard-web\//);
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
