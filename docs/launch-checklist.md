# Launch checklist

## Product and brand
- [ ] Confirm the public release and replace development-branch-qualified copy with release-specific facts.
- [ ] Confirm the actual download / access / purchasing route. Do not label an anchor as a download.
- [ ] Approve logo treatment and English positioning.
- [ ] Add a real demo with permission to publish its data; the current panel is clearly illustrative.
- [ ] Review existing xAgent naming and old-site links. Plan redirects per URL; do not blindly replace historical version names.
- [ ] Obtain a production privacy policy and operator contact details. Link actual commercial terms when available.

## Hosting and indexing (not performed)
- [ ] Choose hosting and authorize publication, DNS and HTTPS changes separately.
- [ ] Set `SITE_ORIGIN=https://agready.ai` and `SITE_PUBLISH=true` for the approved production build.
- [ ] Replace the SVG social preview with a tested 1200×630 PNG/JPEG for broad social crawler compatibility, and update og:image.
- [ ] Verify www/apex canonical behavior, HTTPS, 404 handling, cache headers and compression.
- [ ] Preview environments must remain noindex; private previews should also be access-controlled. robots.txt is not access control.
- [ ] Create Search Console ownership in the selected Google account. Prefer a Domain property if all domain variants are managed together; verify using the value Google actually issues. Do not invent a DNS token.
- [ ] Submit `/sitemap.xml`, inspect the homepage URL, and confirm the deployed canonical and robots rules.

## Google Analytics 4 (not configured)
- [ ] Confirm account ownership and permission to create a property / web stream for AgReady.
- [ ] Choose reporting timezone and currency deliberately.
- [ ] Record the public Measurement ID in deployment config; never embed API secrets.
- [ ] Review retention, sharing, regional requirements, privacy policy and consent UX before collection.
- [ ] Disable Enhanced Measurement automatic events to match this minimal adapter. Advertising features are not part of this task.
- [ ] Set `GA4_MEASUREMENT_ID` and verify tag network activity stays absent before consent and after decline.
- [ ] Check page visits and fixed CTA names in DebugView / Realtime after consent. Confirm a URL with a test query does not transmit that query.
- [ ] Check accept → decline → accept, storage blocked, repeated clicks and page reload.
- [ ] Exclude or separate development/test traffic. Decide whether CTA events deserve key-event status; a navigation click is not a signup or task completion.
- [ ] If a product app is added later, define verified activation/completion events there rather than inferring them from homepage clicks.

## Future content
- [ ] Publish a release-specific Quickstart before linking `/docs/`.
- [ ] Publish one reproducible case before linking a Use Cases index.
- [ ] Publish the first evidence-based article before linking `/blog/`.
- [ ] Add author/date/version/source metadata, canonical URLs and sitemap entries per real page.
- [ ] English remains root language. Add `/zh/` and hreflang only when real translated equivalents exist.

References:
- https://support.google.com/analytics/answer/9539598
- https://support.google.com/webmasters/answer/9008080
- https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
