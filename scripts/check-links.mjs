// Usage: node scripts/check-links.mjs dist   (honours BASE_PATH and SITE_URL like the build)
import { checkSite } from "./site-checks.mjs";

const dist = process.argv[2] || "dist";
const base = process.env.BASE_PATH ?? "/keelyard-web";
const site = process.env.SITE_URL || "https://vccorg.github.io";
const problems = checkSite(dist, { base, site });
if (problems.length) {
  console.error(`${problems.length} problem(s):\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`links ok (${dist}, base ${base})`);
