import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,existsSync} from 'node:fs';
function build(env={}){execFileSync(process.execPath,['scripts/build.mjs'],{stdio:'pipe',env:{...process.env,GA4_MEASUREMENT_ID:'',GOOGLE_SITE_VERIFICATION:'',SITE_PUBLISH:'false',...env}});return readFileSync('dist/index.html','utf8');}
test('preview is noindex, analytics disabled and all linked local assets exist',()=>{
 const html=build();
 assert.match(html,/name="robots" content="noindex,nofollow"/);
 assert.match(html,/name="ga4-measurement-id" content=""/);
 assert.doesNotMatch(html,/\{\{[A-Z_]+\}\}/);
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.match(html,/Illustrative workflow/);
 assert.doesNotMatch(html,/rel="canonical"/);
 assert.doesNotMatch(html,/property="og:(?:url|image)"/);
 assert.match(readFileSync('dist/_headers','utf8'),/X-Robots-Tag: noindex/);
 for(const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) { const path=match[1].split('#')[0]; assert.ok(existsSync('dist'+path+(path.endsWith('/')?'index.html':'')),path); }
 for(const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${match[1]}"`),match[1]);
 assert.match(readFileSync('dist/robots.txt','utf8'),/Disallow: \//);
});
test('production metadata is configurable and escaped',()=>{
 const html=build({SITE_PUBLISH:'true',GA4_MEASUREMENT_ID:'G-TEST123',GOOGLE_SITE_VERIFICATION:'a"<b',SITE_ORIGIN:'https://agready.ai'});
 assert.match(html,/name="robots" content="index,follow"/);
 assert.match(html,/content="a&quot;&lt;b"/);
 assert.match(html,/content="G-TEST123"/);
 assert.match(readFileSync('dist/sitemap.xml','utf8'),/<loc>https:\/\/agready.ai\/<\/loc>/);
 assert.match(readFileSync('dist/robots.txt','utf8'),/Allow: \//);
});
test('invalid analytics ID and unsafe origin fail closed',()=>{
 assert.throws(()=>build({GA4_MEASUREMENT_ID:'https://evil.test'}));
 assert.throws(()=>build({SITE_ORIGIN:'http://example.com'}));
 assert.throws(()=>build({SITE_ORIGIN:'https://example.com/path'}));
 build();
});

test('getting started guide is real, release-scoped and preview-safe',()=>{
 build();
 const home=readFileSync('dist/index.html','utf8');
 const guide=readFileSync('dist/docs/getting-started/index.html','utf8');
 assert.match(home,/href="\/docs\/getting-started\/"/);
 assert.equal((guide.match(/<h1\b/g)||[]).length,1);
 assert.match(guide,/name="robots" content="noindex,nofollow"/);
 assert.match(guide,/Downloading a binary does not mean the product is free/);
 assert.match(guide,/releases\/tag\/v0.1.1/);
 assert.match(guide,/does not provide an AgReady account signup/);
 assert.doesNotMatch(guide,/github.com\/coffeehc\/agready\/blob|10\.88\.|\/Users\/coffee/);
 for(const match of guide.matchAll(/href="#([^"]+)"/g)) assert.ok(guide.includes(`id="${match[1]}"`),match[1]);
 for(const match of guide.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {const path=match[1].split('#')[0];assert.ok(existsSync('dist'+path+(path.endsWith('/')?'index.html':'')),path);}
});
test('icons use SVG and no Actions workflow is included',()=>{
 for(const file of ['src/index.html','src/getting-started.html']) {
  const html=readFileSync(file,'utf8');
  assert.doesNotMatch(html,/[↗↓≡×]/);
  assert.match(html,/<svg class="icon/);
  for(const tag of html.matchAll(/<svg[^>]*>/g)) {assert.match(tag[0],/aria-hidden="true"/);assert.match(tag[0],/focusable="false"/);}
 }
 assert.equal(existsSync('.github/workflows/check.yml'),false);
});
