# keelyard-web — notes for AI assistants

Marketing site for Keel. Astro, static, GitHub Pages. Read `README.md` first; the rules for content there
are the ones that matter.

- Keel's facts come from the product repo (VcCorg/keelyard), not from what would sound good. Before
  adding or upgrading an integration in `src/data/integrations.ts`, find it in that repo's code. Planned
  work comes from `docs/plans/MARKET_READINESS_PLAN.md` there.
- Internal links: `import.meta.env.BASE_URL`, never a bare `/path`.
- Run `npx astro check && npm run build && npm run check:links && npm test` before pushing.
- Never commit secrets, real customer or employer names, or a filled-in `.env`.
