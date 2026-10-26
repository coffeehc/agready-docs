# AgReady website — first homepage draft

A dependency-free, responsive English homepage starter for `agready.ai`. This is a **source draft**, not a deployed website or a product release. The commercial AgReady product is not represented as open source.

## Run

Use Node.js 22 or newer. No package installation is required.

    npm run build
    npm run preview
    npm test

Open `http://localhost:4173`. Production output is `dist/`. `PORT` overrides the preview port. The preview server is development-only, not a production server.

The default build is deliberately **noindex** and has **analytics disabled**. Preview output omits canonical and Open Graph URL/image metadata so an unknown preview hostname is not misrepresented as the production domain. Use a real HTTPS origin and explicitly set `SITE_PUBLISH=true` only at approved publication time. Environment variables are read from the process, not auto-loaded from `.env`.

    SITE_ORIGIN=https://agready.ai SITE_PUBLISH=true npm run build

## Source layout

- `src/index.html`: homepage copy and semantic structure.
- `src/site.config.mjs`: shared title and description.
- `public/styles.css`: responsive layout and design system.
- `public/app.js`: privacy dialog and optional, opt-in GA4 adapter.
- `scripts/build.mjs`: dependency-free build, metadata, sitemap and robots generation.
- `content/docs/`, `content/blog/`: future editorial sources, not public placeholder pages.
- `docs/launch-checklist.md`: requirements and outstanding setup before launch.

The first version intentionally uses plain HTML and a tiny build process. It does not pretend to render Markdown yet. When Docs and Blog are commissioned, migrate the shell to an established Markdown-capable static generator or add a reviewed Markdown pipeline. Keep `/docs/` and `/blog/` as the planned public URLs. Do not add empty navigation links before there is usable content.

## Content boundaries

The workflow panel is explicitly illustrative, not a product screenshot or a measured execution. Capability copy is based on the current `agready/xagent` development branch and is labelled accordingly. Before publication, verify every claim against the intended public release, replace the illustration with an approved real demo where useful, and connect a genuine acquisition route. The current Get started link opens a preparation checklist, **not an installer**.

No invented pricing, trial, customers, testimonials, benchmarks, download links, or license grants are included. The old 0.0.13 commercial release is not mixed into the current homepage.

## Analytics

`GA4_MEASUREMENT_ID` is optional and must match `G-[A-Z0-9]+`. A blank ID means no third-party tag, even after an attempted acceptance. A configured ID still loads no tag until the visitor allows analytics through Privacy & analytics. Decline works without affecting the website. The first-party choice is stored under `agready.analytics-choice.v1`.

Custom events are limited to `page_view` and `navigation_click` with predefined CTA names. Application code strips query and hash from page locations and omits referrers. No prompt, user input or file content is collected by this page. **In GA4, disable Enhanced Measurement and unwanted data sharing before activation**; remotely configured automatic events are outside this adapter's scope. Realtime collection and privacy behavior still require live verification with the actual property before launch. Do not put a Measurement Protocol secret in frontend code.

The preview privacy dialog is not a complete legal policy. Operator identity, contact, purposes, retention, transfer disclosures and applicable consent requirements must be reviewed before enabling analytics. Withdrawal disables further calls from this adapter and attempts to expire first-party GA cookies; it does not erase historical data sent to Google.

`GOOGLE_SITE_VERIFICATION` optionally adds a URL-prefix ownership verification meta value. A Domain property is verified through DNS separately. No Google property, data stream, DNS record or account was created by this draft.
