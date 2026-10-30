# AgReady website

Source for the dependency-free, responsive English website deployed at `agready.ai`. Website source and AgReady Server product releases have separate roles. The commercial AgReady product is not represented as open source.

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
- `src/pages.json`: route, title and description manifest for twenty content pages (twenty-one public pages including the homepage; the separate 404 is excluded).
- `src/product.html`, `src/docs*.html`, `src/faq.html`, `src/blog*.html`: reviewed HTML editorial sources.
- `public/styles.css`: responsive layout and design system.
- `public/app.js`: privacy dialog and optional, opt-in GA4 adapter.
- `scripts/build.mjs`: dependency-free build, metadata, sitemap and robots generation.
- `content/docs/`, `content/blog/`: editorial conventions and future Markdown migration notes.
- `docs/launch-checklist.md`: requirements and outstanding setup before launch.

The site uses plain HTML with a small multi-page build process. It does not render Markdown. Every published route in `src/pages.json` has substantive content; page-specific metadata and the production sitemap are generated from that manifest. Preview output remains noindex. Header/footer markup is currently duplicated between source pages; keep them consistent when editing. A shared-template or Markdown pipeline can be introduced separately.

## Content boundaries

The workflow panel is explicitly illustrative, not a product screenshot or a measured execution. Capability copy is based on the current `agready` source repository and is labelled accordingly. Before publication, verify every claim against the intended public release, replace the illustration with an approved real demo where useful, and connect a genuine acquisition route. Navigation opens Product, Docs, Blog and About, with FAQ in the footer. The homepage preparation section is **not an installer**. The Blog examples are explicitly fictional, with no measured product result.

No invented pricing, trial, customers, testimonials, benchmarks, download links, or license grants are included. The old 0.0.13 commercial release is not mixed into the current homepage.

## Analytics

`GA4_MEASUREMENT_ID` is optional and must match `G-[A-Z0-9]+`. When omitted, indexable production builds use the public `site.gaMeasurementId`; preview builds default to blank. An explicitly blank environment value disables the integration. The adapter also requires the hostname `agready.ai`, preventing Pages previews and local QA from collecting production data. A blank ID means no Google Analytics tag, even after an attempted acceptance. A configured ID still loads no tag until the visitor allows analytics through the Google Analytics preference controls. Decline works without affecting the website. The first-party choice is stored under `agready.analytics-choice.v1`.

Manual events are limited to `page_view` and `navigation_click` with the existing internal CTA names `open_getting_started` and `see_product`. The manual payload strips page query/hash and omits referrers. This is **not** a blanket filter for Google automatic events. The selected Enhanced Measurement settings are scrolling, outbound clicks and file-download clicks on; site search, forms, video and browser-history page changes off. `send_page_view: false` prevents the configuration command from duplicating our manual page view. Keep history-based page views off in the data stream and verify one page view per navigation in live collection.

Automatic outbound/file events can include full destination URLs and link/file details, including URL parameters. Do not publish sensitive values in links. No separate manual Lead/Release click event is sent; use automatic outbound events instead. A click/file-download event does not prove a completed transfer, installation or product use. No task input or file content is intentionally collected. UTM attribution is not implemented by this adapter.

On withdrawal, the integration sets Google's documented `ga-disable-<ID>` flag before updating analytics consent to denied, attempts to expire first-party GA cookies and prevents later declined-page loads from loading the tag. This disables further collection by the tag, rather than merely suppressing our manual events. The existing tag element is retained because removing it cannot unload executed code and could interrupt an in-flight initial load, breaking reacceptance. Data already sent or in flight cannot be recalled. Reacceptance updates consent to granted while keeping advertising consent denied; a later declined page load never loads the tag. Live network verification of automatic events and withdrawal remains required; unit tests do not execute Google's remote library. References: https://developers.google.com/tag-platform/security/guides/privacy and https://developers.google.com/tag-platform/security/guides/consent . Do not put a Measurement Protocol secret in frontend code.

The preview privacy dialog is not a complete legal policy. Operator identity, contact, purposes, retention, transfer disclosures and applicable consent requirements must be reviewed before enabling analytics. Withdrawal disables further calls from this adapter and attempts to expire first-party GA cookies; it does not erase historical data sent to Google.

`src/site.config.mjs` retains the approved public Search Console verification marker. Only a `SITE_PUBLISH=true` build emits it, in the homepage head; preview builds, other pages and the 404 omit it. `GOOGLE_SITE_VERIFICATION` can explicitly override this value for a separately approved ownership change. Keep the approved marker in place while verification is in use. A Domain property is verified through DNS separately. No Google property, data stream, DNS record or account was created by this draft.

## AgReady Server releases

Latest product release: [AgReady v0.0.1](https://github.com/coffeehc/agready-docs/releases/tag/v0.0.1).

[Release notes](changelog/v0.0.1.md) · [Release index](releases.json) · [Download catalog](https://download.agready.ai/agready/versions.json)

Download the installer first, then inspect its contents and the release terms before deciding to run it. The following commands are the two-step installation sequence documented in the official v0.0.1 release; downloading does not execute it.

```bash
curl -fsSL https://download.agready.ai/agready/install.sh -o install-agready.sh
```

After reviewing the downloaded script, on the intended deployment machine:

```bash
bash install-agready.sh
```

This website change did not execute the installer or verify startup behavior. Select the correct platform archive and compare it with the release's `SHA256SUMS` when downloading an archive manually.

The Server installer installs only AgReady. Independently released plugins use `https://download.agready.ai/agready/agentplugins/install.sh --plugins <names>`; they are not bundled with this Server release. Existing xAgent installations require the separate migration tool; normal installation and upgrade do not migrate their data.

## Static asset versions

The build emits SHA-256 content-hashed CSS and JavaScript filenames and rewrites every page to those URLs. Identical asset bytes keep the same URL; changes produce a new URL so stale domain caches cannot mix old CSS with new HTML. Legacy unversioned copies remain for previously cached HTML, but newly generated pages do not reference them.

## Illustrated Get started guide

`src/getting-started.html` and the original images under `public/images/getting-started/` form the setup and first-task guide. Captions explain controls and the example result; screens reflect the development interface, not a promise of release equivalence. No clean-install or real-model acceptance claim is made. Image filenames include content hashes; original bytes are preserved.

## Breadcrumb navigation

`scripts/breadcrumbs.mjs` generates visible Home / Docs or Blog / current-page trails from existing routes. The same trail produces BreadcrumbList JSON-LD only for published non-home content pages. Preview builds keep navigation but omit this structured data; the homepage and 404 have neither. No rich-result appearance or ranking gain is guaranteed.
