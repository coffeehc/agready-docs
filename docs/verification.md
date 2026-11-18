# Verification status

## November 18, 2026: local model connection address checks

- Scope: expand the existing model connection guide to separate the browser, AgReady Server and model API locations, explain loopback and container-network boundaries, and link the check from the FAQ. Update the existing description; no new route, configuration, provider or compatibility claim.
- Basis: existing AgReady Server-reachability guidance, RFC 6761 section 6.3 and Docker's networking overview, read November 18. The guidance is diagnostic, not an executed local-model or container-deployment acceptance test. No firewall, credential, TLS or network setting was changed.
- Validation: all 68 Node tests, noindex preview and indexable production builds, and whitespace checks passed. Independent review found no content blocker and caught a test-section delimiter error; the delimiter and explicit boundary assertions were corrected before the final rerun. Existing route, canonical, sitemap, 404, Pages preview noindex, GSC marker and GA consent coverage remains in place.
- Browser QA could not start: cloud Chromium terminated with `socket() failed: Operation not permitted`. No rendered desktop/mobile pass, real model connection, GSC measurement or traffic gain is claimed.
- Pre-change main `349d244a016af25e813d5d686cb62f089edd6181` had a successful Cloudflare Pages deployment and no open PR. Publication and live-page acceptance are checked separately. No GitHub Actions workflow or user-computer resource was used.

## November 11, 2026: three timely agent-workflow articles

- Scope: publish three distinct English Blog guides: Agent Skills vs MCP vs A2A; memory vs context vs skills; and a self-hosted agent security checklist. Add Blog discovery links, route metadata, cross-links and focused regression coverage. No existing article is replaced.
- Topic basis: Anthropic's October 22 Agent Skills foundation announcement and November 6 memory article, the current Agent Skills/MCP/A2A documentation, and Google's October 22 Agent Compute Engine discussion. These are evidence of current ecosystem activity, not measured keyword volume, low competition, search growth or expected traffic. Long-tail phrases are editorial hypotheses matched to concrete reader questions.
- Product basis: reviewed current AgReady development architecture and service interfaces for Skills imports, MCP tool runtimes, A2A Client, memory and session context. The comparison states the existing A2A Client capability and its current A2A v1 JSON-RPC/HTTP+JSON boundary, while explicitly distinguishing it from an A2A Server and internal agent teams. Release availability remains separate. No real-provider, remote-agent or security acceptance run is represented as completed.
- Original examples: the research comparison and continuing-project handover are fictional instructional examples. The security article is deployment guidance, not an audit or a claim that AgReady has a particular sandbox, universal approval coverage or complete audit logging.
- Validation: 61 Node tests, preview and production builds, and whitespace checks passed. Coverage includes all 31 published URLs, local links/anchors, distinct canonical/sitemap entries, preview noindex, true 404 exclusions, consent controls and article-specific factual boundaries. Independent editorial, source and static-code review found no blockers. Browser layout QA could not start because Chromium terminated with `socket() failed: Operation not permitted`; no rendered desktop/mobile pass is claimed.
- Pre-change main: `e8875c752e038c07b0fe97ab0c598f499ccfd868`, with a successful Cloudflare Pages check and no open pull requests. The existing live Blog returned HTTP 200. Publication and live route acceptance are checked separately after commit.
- Canonical generation, sitemap generation, 404 behavior, Pages preview noindex, Search Console verification and GA consent implementation remain unchanged. No GitHub Actions workflow, deployment setting or user-computer resource is used or changed.

## November 11, 2026: verify a first agent-team result

- Scope: expand the existing agent-team guide with a fictional Harbor documentation packet, a review-only manager brief, a source-linked reference result and focused troubleshooting. Update the existing page metadata and Docs entry. No route, product control or integration is added.
- Basis: existing October 2026 development-interface guidance for team creation, manager/member reports, goal control and archive/restore. The exercise is instructional, not an executed AgReady team run or a performance comparison. It distinguishes proposed copy from published changes, leaves missing setup steps unknown, and does not imply that more agents guarantee a better result.
- Validation: all 60 Node tests, noindex preview and indexable production builds, and whitespace checks passed. New regression coverage checks the fictional source packet, bounded manager brief, reference-result limits, original navigation anchors, internal links and production/preview metadata. Independent editorial/static review found no blockers; its suggestion to avoid an exact three-finding quota in the earlier generic brief was applied.
- Browser-layout QA could not start: Chromium terminated at launch with `socket() failed: Operation not permitted`. No rendered desktop/mobile pass or real team execution test is claimed. The pre-change guide and latest oversight content were readable by public HTTP; new content is checked separately after publication.
- Pre-change main was `c3667df1ac8d13071a1f9ed2f1cc16d4549fbd1f`; its tree matched the prior reviewed `8cc3789` content. No open pull request or competing recent editing task was found. The connected status API returned no statuses, and the public check-runs endpoint returned HTTP 403; that endpoint was not retried. A Cloudflare check-run ID was therefore not established in this check.
- Canonicals, sitemap routes, true 404, Pages preview noindex, Search Console verification and GA consent code are unchanged. No GitHub Actions workflow, deployment setting or user-computer resource is used or changed. No Search Console performance measurement is available from the connected tools in this run; no ranking or traffic improvement is claimed.

## November 10, 2026: review approvals and handle interrupted actions

- Scope: expand the Human oversight guide with a fictional draft-versus-send review, separate states for pending, rejected, completed and uncertain operations, and a reusable handover brief. Update the existing page metadata and Docs entry; no route, product control or integration was added.
- Basis: existing version-scoped guidance for approvals, stopping a run, sessions, schedules and teams. The examples illustrate decisions rather than report an executed AgReady workflow. Existing October 2026 development-interface and Agent Ready vision caveats remain. No benchmark, traffic or ranking result is implied.
- Validation: all 59 Node tests, noindex preview and indexable production builds, and whitespace checks passed. New coverage checks the action boundaries, result-evidence distinctions, handover fields, navigation anchors and production/preview metadata. Independent editorial/static review found no blockers; its suggested pending-work field was added. Existing generated heading anchors were preserved.
- Browser-layout QA could not start: Chromium terminated at launch with `socket() failed: Operation not permitted`. No rendered desktop/mobile pass or real external-action test is claimed. The pre-change production guide was readable by public HTTP. New content and automatic deployment are verified separately after publication.
- Pre-change main was `9e5b99400c6ba489cc12540f707c86a27a52565f`, with a successful Cloudflare Pages check and no open pull requests. No competing repository-editing task was found. Canonicals, sitemap routes, true 404, Pages preview noindex, Search Console verification and GA consent code are unchanged. No GitHub Actions workflow, deployment setting or user-computer resource was used or changed.

## November 9, 2026: resume a task with explicit context

- Scope: expand the existing sessions/context guide with session-selection guidance, a reusable review-first resume brief, a fictional two-step correction exercise and recovery checks. Update the page metadata and Docs entry without adding a route or changing product behavior.
- Basis: the current development implementation and design documentation for session context compression, context usage and archive/restore were inspected. Session continuity and cross-session memory are separate; existing interface labels remain scoped to the October 2026 development interface. The worked example is instructional, not an executed AgReady test, a forced-compression test or evidence of search demand or growth.
- Validation: all 58 Node tests, noindex preview and indexable production builds, and whitespace checks passed. New regression coverage checks the resume brief's verified/uncertain state, bounded action scope, source-labelled correction/reference answer, generated navigation, metadata and preview exclusions. Independent editorial/static review found no publication blockers.
- Browser-layout QA could not start: Chromium terminated at launch with `socket() failed: Operation not permitted`. No rendered desktop/mobile pass or real product workflow test is claimed. The pre-change production guide was readable through public HTTP; acceptance of the new content and deployment is checked separately after publication.
- Pre-change main was `afea4a4330f0be264f2b61aae43c081f7ad30e9c`, with a successful Cloudflare Pages check and no open pull requests. No competing active repository-editing task was found. Canonical URLs, sitemap routes, real 404, Pages preview noindex, Search Console verification and GA consent code are unchanged. No GitHub Actions workflow, deployment setting or user-computer resource was used or changed.

## November 8, 2026: CSV and Codex memory scope corrections

- Corrected the PDF tutorial's absolute exclusion of Excel formulas from CSV. CSV can contain formula-interpreted text; workbook formatting and multiple worksheets are not preserved, and cross-application formula semantics are not guaranteed. Kept the text-only extraction warning and added the OWASP CSV injection reference: https://owasp.org/www-community/attacks/CSV_Injection .
- Narrowed the comparison's cross-session Codex memory entry to local Codex clients, explicitly excluding ChatGPT web and ChatGPT Work from that description. Source: https://learn.chatgpt.com/docs/customization/memories . Other comparison rows retain their existing evidence date; this is not a fresh audit of all competitors.
- Validation: all 57 Node tests, preview and production builds, and whitespace checks passed. New regression coverage checks both qualifications and their citations. No real spreadsheet application, AgReady workflow, or browser-layout acceptance test was run for this editorial correction.
- Pre-change main was `d074f7f0c6b7a98571f38f122588307792771ef8`, with a successful Cloudflare Pages check and no open pull requests. No other active repository-editing task was found. No runtime, route, deployment setting, GitHub Actions workflow, analytics behavior or user-computer resource was changed. Existing automatic deployment is checked separately after publication; live-site acceptance is not implied by build success.


## November 8, 2026: memory verification and stale-context troubleshooting

- Scope: expand the existing memory guide with an optional fictional-project preference, separate checks for a stored record and its use, a current-task formatting exception, and missing/stale-memory troubleshooting. Update the existing page metadata and Docs entry; no new route or product capability is introduced.
- Basis: the guide's existing October 2026 development-interface controls and documented memory/context limits. The example is editorial guidance, not an executed AgReady workflow, release-acceptance result, or evidence of search demand or traffic gains. The installed-release caveat remains explicit.
- Validation: 56 Node tests, preview and indexable production builds, and whitespace checks passed. Dedicated regression coverage checks the fictional scope, prompt/answer separation, source labels, current-task override, generated navigation anchors, metadata and preview exclusions.
- Browser-layout QA could not start: Chromium terminated at launch with `socket() failed: Operation not permitted`. No rendered desktop/mobile pass or real memory storage/retrieval test is claimed. The public web reader could not access the production homepage or prior guide, so live-page acceptance remains separate from the deployment result.
- Pre-change main was `288becdd09668b9e275f41fddc39647a7f9ba0f7`, with a successful Cloudflare Pages check and no open pull requests found. Canonicals, sitemap, 404, Pages preview noindex, Search Console verification and consent code are unchanged. No GitHub Actions workflow, deployment setting or user-computer resource was used or changed. Publication follows the existing Cloudflare integration and is checked separately after commit.

## November 6, 2026: first reusable skill example

- Scope: expand the existing Skills guide with a fictional text-only creation brief, a three-note test packet, an evidence-linked reference answer, acceptance checks and troubleshooting. Update its title and description without changing the route or adding product capability claims.
- Basis: the guide's existing October 2026 development-interface instructions for Target description, generation review and Loaded skills. The example is editorial guidance, not an executed AgReady test or evidence of search demand, ranking or traffic gains.
- Validation: 52 Node tests, preview and indexable production builds, and whitespace checks passed. Regression coverage checks the source packet, revised deadline, missing date, completion uncertainty, action limits and generated TOC links. Independent review confirmed the reference answer and tightened wording to avoid implying an undocumented inline editor.
- Browser-layout QA remains blocked: Chromium terminated during launch with `socket() failed: Operation not permitted`. No rendered desktop/mobile pass or real product workflow test is claimed. Public-page reads were unavailable through the web reader; live-page acceptance remains separate from the Cloudflare deployment result.
- Pre-change main was `c65e2d8f57da4852236fa54bb0636ec7532a4572`, with a successful Cloudflare Pages check. Canonicals, sitemap, 404, Pages preview noindex, Search Console verification and consent code are unchanged. No GitHub Actions workflow, deployment setting or user-computer resource was used or changed. Publication follows the existing Cloudflare integration and is checked separately after commit.

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
