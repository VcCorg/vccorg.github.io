// Checks over a built site. Pure functions plus a file walk; used by the CLI
// (`npm run check:links`) and by the tests.
import fs from "node:fs";
import path from "node:path";

export function htmlFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFiles(p));
    else if (p.endsWith(".html")) out.push(p);
  }
  return out;
}

/** Every href/src/action value in a page. */
export function references(html) {
  const refs = [];
  const re = /\s(href|src|action)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(html))) refs.push({ attr: m[1], value: m[2] });
  return refs;
}

export function ids(html) {
  return new Set([...html.matchAll(/\sid\s*=\s*"([^"]+)"/g)].map((m) => m[1]));
}

/**
 * Resolve an internal URL path to a file in `dist`, honouring the base path.
 * Returns null when the path is outside the base (which on GitHub Pages is a 404).
 */
export function fileFor(dist, base, urlPath) {
  const b = base.endsWith("/") ? base : `${base}/`;
  if (!(urlPath === b.slice(0, -1) || urlPath.startsWith(b))) return null;
  let rel = decodeURIComponent(urlPath.slice(b.length));
  if (rel === "" || rel.endsWith("/")) rel += "index.html";
  const direct = path.join(dist, rel);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;
  const asDir = path.join(dist, rel, "index.html");
  return fs.existsSync(asDir) ? asDir : null;
}

/**
 * Problems with a built site: internal links that would 404 on the host, in-page
 * anchors with no target, and resources loaded from anywhere but this site.
 */
export function checkSite(dist, { base = "/", site = "" } = {}) {
  const problems = [];
  const origin = site ? new URL(site).origin : "";
  for (const file of htmlFiles(dist)) {
    const html = fs.readFileSync(file, "utf8");
    const page = path.relative(dist, file);
    const pageIds = ids(html);
    for (const { attr, value } of references(html)) {
      if (attr === "action") continue;                    // the form endpoint is external by design
      if (/^(mailto:|tel:)/.test(value)) continue;
      if (value.startsWith("#")) {
        if (value.length > 1 && !pageIds.has(value.slice(1))) problems.push(`${page}: anchor ${value} has no target`);
        continue;
      }
      if (/^https?:\/\//.test(value)) {
        // Only this site's own canonical/og URLs may be absolute; nothing third-party.
        if (!(origin && value.startsWith(origin)) || attr === "src") problems.push(`${page}: external ${attr} ${value}`);
        continue;
      }
      if (value.startsWith("//")) { problems.push(`${page}: protocol-relative ${value}`); continue; }
      const [urlPath, hash] = value.split("#");
      const target = fileFor(dist, base, urlPath);
      if (!target) { problems.push(`${page}: ${attr} ${value} does not resolve under base ${base}`); continue; }
      if (hash && target.endsWith(".html") && !ids(fs.readFileSync(target, "utf8")).has(hash)) {
        problems.push(`${page}: ${value} points at a missing anchor`);
      }
    }
  }
  return problems;
}
