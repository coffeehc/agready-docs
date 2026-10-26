# AgReady website — English content draft

A dependency-free, responsive English website starter for `agready.ai`. This is a **source draft**, not a deployed website or a product release. The commercial AgReady product is not represented as open source.

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
- `src/site.config.mjs`: homepage title and description.
- `src/pages.json`: route, title and description manifest for six content pages.
- `src/product.html`, `src/docs*.html`, `src/faq.html`, `src/blog*.html`: reviewed HTML editorial sources.
- `public/styles.css`: responsive layout and design system.
- `public/app.js`: privacy dialog and optional, opt-in GA4 adapter.
- `scripts/build.mjs`: dependency-free build, metadata, sitemap and robots generation.
- `content/docs/`, `content/blog/`: editorial conventions and future Markdown migration notes.
- `docs/launch-checklist.md`: requirements and outstanding setup before launch.

The site uses plain HTML with a small multi-page build process. It does not render Markdown. Every published route in `src/pages.json` has substantive content; page-specific metadata and the production sitemap are generated from that manifest. Preview output remains noindex. Header/footer markup is currently duplicated between source pages; keep them consistent when editing. A shared-template or Markdown pipeline can be introduced separately.

## Content boundaries

The workflow panel is explicitly illustrative, not a product screenshot or a measured execution. Capability copy is based on the current `agready` source repository and is labelled accordingly. Before publication, verify every claim against the intended public release, replace the illustration with an approved real demo where useful, and connect a genuine acquisition route. Navigation opens Product, Docs, Blog and FAQ. The homepage preparation section is **not an installer**. The Blog example is explicitly fictional, with no measured product result.

No invented pricing, trial, customers, testimonials, benchmarks, download links, or license grants are included. The old 0.0.13 commercial release is not mixed into the current homepage.

## Analytics

`GA4_MEASUREMENT_ID` is optional and must match `G-[A-Z0-9]+`. A blank ID means no third-party tag, even after an attempted acceptance. A configured ID still loads no tag until the visitor allows analytics through Privacy & analytics. Decline works without affecting the website. The first-party choice is stored under `agready.analytics-choice.v1`.

Custom events are limited to `page_view` and `navigation_click` with predefined CTA names. Application code strips query and hash from page locations and omits referrers. No prompt, user input or file content is collected by this page. **In GA4, disable Enhanced Measurement and unwanted data sharing before activation**; remotely configured automatic events are outside this adapter's scope. Realtime collection and privacy behavior still require live verification with the actual property before launch. Do not put a Measurement Protocol secret in frontend code.

The preview privacy dialog is not a complete legal policy. Operator identity, contact, purposes, retention, transfer disclosures and applicable consent requirements must be reviewed before enabling analytics. Withdrawal disables further calls from this adapter and attempts to expire first-party GA cookies; it does not erase historical data sent to Google.

`GOOGLE_SITE_VERIFICATION` optionally adds a URL-prefix ownership verification meta value. A Domain property is verified through DNS separately. No Google property, data stream, DNS record or account was created by this draft.

## AgReady Server releases

Latest product release: [AgReady v0.0.1](https://github.com/coffeehc/agready-docs/releases/tag/v0.0.1).

[Release notes](changelog/v0.0.1.md) · [Release index](releases.json) · [Download catalog](https://download.agready.ai/agready/versions.json)

```bash
curl -fsSL https://download.agready.ai/agready/install.sh | bash
```

The Server installer installs only AgReady. Independently released plugins use `https://download.agready.ai/agready/agentplugins/install.sh --plugins <names>`; they are not bundled with this Server release. Existing xAgent installations require the separate migration tool; normal installation and upgrade do not migrate their data.
