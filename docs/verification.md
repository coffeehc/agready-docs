# Verification status

- Node build: passed (preview default; analytics disabled).
- Node tests: 10 passed. Includes linked-asset/anchor existence on all seven pages, one H1 per page, unique production canonicals and sitemap entries, forbidden legacy release references, no Actions workflow, preview indexing safety, production metadata and escaping, invalid ID/origin rejection, default analytics off, opt-in, query/hash stripping in manually queued events, repeat acceptance, withdrawal, persisted decline and blocked storage.
- Real Google account/property setup: not performed.
- Actual Google network collection and DebugView: not verified; tests use a simulated DOM and event queue, not a real property.
- Browser visual and responsive QA: **not completed**. The build environment did not support launching Chromium or accessing the preview server from the browser environment. A real browser pass is required before public release.
- `scripts/check-browser.mjs` contains a Playwright QA workflow for a normal development environment with Chromium available; it has not completed here. Playwright is optional QA tooling, not a site dependency.
- Deployment, DNS changes and Google account configuration are separate steps and have not been performed by this implementation.
