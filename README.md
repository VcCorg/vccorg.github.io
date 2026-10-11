# keelyard-web

The marketing site for **Keel**, the governed context layer for coding agents.
The product itself lives in [VcCorg/keelyard](https://github.com/VcCorg/keelyard).

Static [Astro](https://astro.build) site, published to GitHub Pages at
<https://vccorg.github.io/keelyard-web/>.

## Work on it

```bash
npm ci
npm run dev          # http://localhost:4321/keelyard-web/
npm run build        # -> dist/
npm test             # builds the site several ways and checks what a visitor gets
npm run check:links  # every link resolves under the base path
```

Node 22.12 or newer (`.nvmrc`).

## Publishing

Every push to `main` builds and deploys (`.github/workflows/deploy.yml`). Pull requests run the same
checks without deploying (`ci.yml`).

One-time repository setup:

1. **Settings → Pages → Source: GitHub Actions.**
2. Optional **variables** (Settings → Secrets and variables → Actions → Variables):

| Variable | Effect |
|---|---|
| `WAITLIST_ENDPOINT` | Where the waitlist form posts (any service that accepts a plain HTML form POST). |
| `CONTACT_EMAIL` | Address for data requests, shown on the privacy page. |
| `SITE_URL`, `BASE_PATH` | Only for a custom domain: `https://your.domain` and `/`. |

**The waitlist form appears only when both `WAITLIST_ENDPOINT` and `CONTACT_EMAIL` are set.** Until then the
page says the waitlist is opening soon, and the privacy page says no personal data is collected. Both
statements stay true either way.

## Rules for content

- **Only mark an integration "Available" if someone could use it in Keel today.** The list is
  `src/data/integrations.ts`; check it against the keelyard code when you change it. Everything else is
  "Planned".
- **No prices** until they've been tested with design partners.
- **No third-party scripts, fonts, trackers or images.** The privacy page promises it, and a test enforces it.
- **No customer or employer names** in copy without written permission.
- Every internal link goes through `import.meta.env.BASE_URL`; a bare `/path` 404s on a project site, and the
  link check fails the build.

## Open before launch

- Trademark search on "Keel" in software classes.
- A form service and a contact address for the waitlist.
- A custom domain, if wanted.
