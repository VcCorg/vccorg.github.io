// @ts-check
import { defineConfig } from "astro/config";

// The organisation's GitHub Pages site by default: repository `vccorg.github.io`,
// served at the root, https://vccorg.github.io/ (the Pages quickstart layout).
// Any other repository name is a project site under /<repo>/: BASE_PATH=/<repo>.
// A custom domain: SITE_URL=https://your.domain (BASE_PATH stays /).
const site = process.env.SITE_URL || "https://vccorg.github.io";
const base = process.env.BASE_PATH || "/";

export default defineConfig({
  site,
  base,
  trailingSlash: "ignore",
  build: { format: "directory" },
  // Tests build into separate directories so builds with different settings do not collide.
  outDir: process.env.OUT_DIR || "./dist",
});
