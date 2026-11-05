# Verification status

## November 5, 2026: raster social preview metadata

- Scope: replace the SVG-only Open Graph image URL on all 27 published pages with a 1200 × 630 PNG exported from the unchanged SVG artwork. Add production-only image type, dimensions and alternative text; retain the original SVG for older URLs. No product copy, route, analytics behavior or deployment setting changed.
- Sources: the archived official X Cards markup reference supports PNG, excludes SVG and documents Open Graph fallback. Its former live URL now redirects to the developer homepage. Open Graph's current specification defines the added image properties. See the README for exact source links and the limits of this compatibility fix.
- Validation: 51 Node tests, indexable production build and whitespace checks passed. The PNG is 51,973 bytes, decodes at 1200 × 630 and is pixel-identical to a fresh render of the source SVG in the same renderer. Visual inspection found the original text, colors and composition intact. All production image metadata and preview/404 exclusions are regression-tested.
- Browser launch was blocked by the cloud sandbox's socket restriction. No browser-layout or external social-card rendering pass is claimed. No user computer was used, and no GitHub Actions workflow was added or run.
- Pre-change remote main was `c758358644608545258d7b09cc609955a43605df`, with a successful Cloudflare Pages check. Existing automatic deployment for this change will be verified separately; direct production-page acceptance is blocked after a Cloudflare 403 reported during this run. No alternate client or security-setting change is used to bypass that denial.

## November 2, 2026: model connection verification

- Scope: deepen the existing model-configuration guide with a fictional, non-sensitive text task, expected checks and layered troubleshooting; update only its search metadata and regression coverage. No new product compatibility or benchmark claims.
- Basis: existing version-scoped model, file, tools and oversight documentation. This is instructional guidance, not a product execution test or evidence of search demand/traffic.
- Validation: 48 Node tests, indexable production build and whitespace checks passed. Independent review removed duplicate manual navigation (the build supplies the table of contents) and strengthened the fresh-session privacy wording. Final checks were rerun after those changes.
- Browser QA could not start: Chromium hit a sandbox socket restriction; one cloud-only escalated attempt failed during environment setup with a read-only filesystem error. No browser rendering, mobile-layout pass or real provider task is claimed.
- Canonical, sitemap, true 404, Pages preview noindex, Search Console and consent implementation were left unchanged. No GitHub Actions workflow or deployment setting was added or changed. Existing Cloudflare deployment and live HTTP acceptance are checked separately after publication.

## October 31, 2026: download selection

- Scope: make existing installation instructions easier to enter from Get started; expose four version-pinned Server downloads with platform/CPU guidance, a latest-release link, licensing and archive checksum references. No new page, script, analytics behavior or product setting.
- Source: official GitHub latest-release API checked at 02:31 UTC; v0.0.1 published October 26, with four Linux/macOS amd64/arm64 archives, LICENSE, EULA.md and SHA256SUMS. No native Windows archive is listed for this release. Links are version-pinned, not a claim that v0.0.1 will remain latest.
- Validation: all 46 Node tests, indexable production build and diff whitespace checks passed. No GitHub Actions workflow exists or was added. A download link is not proof of a completed download, installation or use; no installer or product test was run.
- Earlier PDF tutorial deployment: main 7ad120c85e8ffec85639806a45a9cf74b6b7f7f6 completed Cloudflare Pages successfully at 02:21:36 UTC (deployment 491cc157-e258-47ac-9422-47f0c5572a66). The earlier 403 HTTP route remains stopped. This update will use the existing integration; production browser acceptance is tracked separately.

## October 31, 2026: PDF comparison tutorial

- Scope: the source-linked PDF comparison tutorial, its Blog and Docs entry links, route metadata and regression test. This is an instructional workflow, not a completed AgReady PDF/OCR/Excel execution test.
- Source basis: the public question at https://www.reddit.com/r/copilotstudio/comments/1rsw7bs/creating_an_agent_that_can_create_a_excel/ was read on October 31. It motivates a multi-file workflow; it does not establish market prevalence or current competitor limitations. AgReady controls follow the existing, version-scoped files/workspace guide.
- Validation: all 45 Node tests passed, including new source-coverage and output-delivery boundary checks. The indexable production build passed with 27 sitemap URLs. Repository diff whitespace checks passed.
- Existing safeguards retained: unique canonicals, preview-host noindex headers, separate noindex 404, production-only Search Console marker, and opt-in GA4. No analytics implementation or account setting changed in this update. Tests simulate the browser environment; they do not verify remote Google collection.
- No GitHub Actions workflow exists in the repository tree. No workflow was added or executed by this work. Publication uses the existing Cloudflare Pages integration.
- Publication checkpoint: content commit `ee16b65aa1b17881a48f55295518b9abe6c243ca` matched the tested files on remote main. At 02:18 UTC the new route still showed the site 404 and no Cloudflare check was visible. A follow-on verification-record commit is being used once to retrigger the existing deployment chain. The reason the earlier deployment did not appear is unconfirmed; no deployment setting was changed.
- Live acceptance remains separate from build success. A direct HTTP fetch was denied with 403 and stopped; browser visual review of the published tutorial and deployment completion remain pending at this checkpoint. No real-mobile or product-workflow success is claimed.

## Historical initial implementation checkpoint

The following describes the original implementation only, not the current account setup, content count or deployment status.

- Node build: passed (preview default; analytics disabled).
- Node tests: 23 passed. Includes linked-asset/anchor existence on all ten pages, one H1 per page, unique production canonicals and sitemap entries, forbidden legacy release references, no Actions workflow, preview indexing safety, production metadata and escaping, invalid ID/origin rejection, default analytics off, opt-in, query/hash stripping in manually queued events, repeat acceptance, withdrawal, persisted decline and blocked storage.
- Real Google account/property setup: not performed.
- Actual Google network collection and DebugView: not verified; tests use a simulated DOM and event queue, not a real property.
- Browser visual and responsive QA: **not completed**. The build environment did not support launching Chromium or accessing the preview server from the browser environment. A real browser pass is required before public release.
- `scripts/check-browser.mjs` contains a Playwright QA workflow for a normal development environment with Chromium available; it has not completed here. Playwright is optional QA tooling, not a site dependency.
- Deployment, DNS changes and Google account configuration are separate steps and have not been performed by this implementation.
