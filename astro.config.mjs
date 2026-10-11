// @ts-check
import { defineConfig } from "astro/config";

// GitHub Pages project site by default (https://vccorg.github.io/keelyard-web/).
// For a custom domain: SITE_URL=https://your.domain BASE_PATH=/
const site = process.env.SITE_URL || "https://vccorg.github.io";
const base = process.env.BASE_PATH ?? "/keelyard-web";

export default defineConfig({
  site,
  base,
  trailingSlash: "ignore",
  build: { format: "directory" },
  // Tests build into separate directories so builds with different settings do not collide.
  outDir: process.env.OUT_DIR || "./dist",
});
