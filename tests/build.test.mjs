import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
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
 for(const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)){ const [path,hash]=match[1].split('#'); const file='dist'+(path.endsWith('/')?path+'index.html':path); assert.ok(existsSync(file),match[1]); if(hash) assert.ok(readFileSync(file,'utf8').includes('id="'+hash+'"')); }
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

test('all content pages have real navigation, preview safeguards and no unconfirmed release paths',()=>{
 build();
 const pages=JSON.parse(readFileSync('src/pages.json','utf8'));
 assert.equal(pages.length,24);
 for(const page of pages){
  const html=readFileSync('dist'+page.path+'index.html','utf8');
  assert.equal((html.match(/<h1\b/g)||[]).length,1,page.path);
  assert.match(html,/name="robots" content="noindex,nofollow"/);
  assert.match(html,/name="ga4-measurement-id" content=""/);
  assert.doesNotMatch(html,/rel="canonical"|xagent-releases|xagent\.xiagaogao|github\.com\/coffeehc\/agready(?:\/|["?#])|localhost|\{\{[A-Z_]+\}\}/);
  for(const m of html.matchAll(/(?:href|src)="(\/[^"#]*)(?:#([^"]+))?"/g)){
   const file='dist'+(m[1].endsWith('/')?m[1]+'index.html':m[1]);
   assert.ok(existsSync(file),page.path+' -> '+m[1]);
   if(m[2]) assert.ok(readFileSync(file,'utf8').includes('id="'+m[2]+'"'));
  }
  for(const m of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes('id="'+m[1]+'"'));
 }
 assert.ok(!existsSync('.github/workflows/check.yml'));
});
test('every production page has its own canonical URL and sitemap entry',()=>{
 build({SITE_PUBLISH:'true',SITE_ORIGIN:'https://agready.ai'});
 for(const p of JSON.parse(readFileSync('src/pages.json','utf8'))){
  assert.ok(readFileSync('dist'+p.path+'index.html','utf8').includes('rel="canonical" href="https://agready.ai'+p.path+'"'));
  assert.ok(readFileSync('dist/sitemap.xml','utf8').includes('<loc>https://agready.ai'+p.path+'</loc>'));
 }
 build();
});

test('brand and navigation stay consistent across all content pages',()=>{
 build();
 const paths=['/',...JSON.parse(readFileSync('src/pages.json','utf8')).map(p=>p.path)];
 for(const path of paths){
  const html=readFileSync('dist'+path+'index.html','utf8');
  assert.equal((html.match(/AgReady<span class="brand-suffix">\.ai<\/span>/g)||[]).length,2,path);
  assert.doesNotMatch(html,/>agready</);
  assert.doesNotMatch(html,/Built for deliberate agentic work/);
  assert.match(html,/<a href="\/about\/">About<\/a><\/nav>/);
  assert.match(html,/class="footer-link" href="\/faq\/">FAQ/);
  assert.doesNotMatch(html,/href="\/apps\/"/);
 }
 assert.match(readFileSync('dist/about/index.html','utf8'),/grew out of a branch of xAgent/);
});

test('public contact email appears on every page and About without private forwarding details',()=>{
 build();
 for(const path of ['/',...JSON.parse(readFileSync('src/pages.json','utf8')).map(p=>p.path)]){
  const html=readFileSync('dist'+path+'index.html','utf8');
  assert.match(html,/<a class="footer-link" href="mailto:hello@agready.ai">hello@agready.ai<\/a>/);
  assert.doesNotMatch(html,/@gmail\.com/);
 }
 assert.match(readFileSync('dist/about/index.html','utf8'),/<h2>Contact<\/h2>/);
});

test('dedicated Get started CTA links to the tutorial, never last-child styling',()=>{
 build();
 const home=readFileSync('dist/index.html','utf8');
 assert.match(home,/id="start"/);
 assert.match(home,/This is a preparation checklist/);
 for(const path of ['/',...JSON.parse(readFileSync('src/pages.json','utf8')).map(p=>p.path)]){
  const html=readFileSync('dist'+path+'index.html','utf8');
  assert.match(html,/<\/nav><a class="nav-cta" href="\/docs\/getting-started\/"/);
 }
 const css=readFileSync('dist/styles.css','utf8');
 assert.doesNotMatch(css,/nav a:last-child/);
 assert.match(css,/a:focus-visible/);
 assert.match(css,/\.nav-cta\{/);
});

test('all pages reference matching content-hashed CSS and JS consistently',()=>{
 build();
 const paths=['/',...JSON.parse(readFileSync('src/pages.json','utf8')).map(p=>p.path)];
 for(const name of ['styles.css','app.js']){
  const source=readFileSync('public/'+name);
  const hash=createHash('sha256').update(source).digest('hex').slice(0,16);
  const dot=name.lastIndexOf('.');
  const hashed=name.slice(0,dot)+'.'+hash+name.slice(dot);
  assert.deepEqual(readFileSync('dist/'+hashed),source);
  for(const path of paths){
   const html=readFileSync('dist'+path+'index.html','utf8');
   assert.ok(html.includes('"/'+hashed+'"'),path);
   assert.ok(!html.includes('"/'+name+'"'),path);
  }
 }
});

test('tutorial uses practical captions and bounded example results',()=>{
 build();
 const html=readFileSync('dist/docs/getting-started/index.html','utf8');
 assert.equal((html.match(/<figure class="tutorial-figure">/g)||[]).length,10);
 assert.match(html,/Screens reflect the current development interface; details may vary by version/);
 assert.match(html,/Example result: three actions/);
 assert.match(html,/fictional placeholders/);
 assert.doesNotMatch(html,/Illustrative UI with demo data|0.0.1-ui-mock|xUI 4.2.42|640 ms|WebSocket/);
 assert.doesNotMatch(html,/\/Users\/|localhost|xagent-releases/);
 assert.doesNotMatch(html,/<img[^>]*src="[^"]*(?:08-workspace|09-approval)/);
});

test('About links to the public GitHub profile without publishing the privacy draft',()=>{
 build();
 const html=readFileSync('dist/about/index.html','utf8');
 assert.match(html,/href="https:\/\/github.com\/coffeehc">coffeehc on GitHub/);
 assert.match(html,/mailto:hello@agready.ai/);
 assert.ok(!existsSync('dist/docs/privacy-notice-unpublished-draft.md'));
 assert.ok(existsSync('dist/privacy/index.html'));
});

test('privacy copy distinguishes optional Google Analytics from Cloudflare',()=>{
 build();
 for(const path of ['/',...JSON.parse(readFileSync('src/pages.json','utf8')).map(p=>p.path)]){
  const html=readFileSync('dist'+path+'index.html','utf8');
  assert.match(html,/Google Analytics is not configured/);
  assert.match(html,/does not disable Cloudflare measurement/);
  assert.match(html,/>Allow Google Analytics<\/button>/);
  assert.match(html,/>Decline Google Analytics<\/button>/);
  assert.match(html,/href="\/privacy\/"/);
  assert.doesNotMatch(html,/does not load third-party analytics by default|Allow analytics<|Decline analytics</);
 }
 const notice=readFileSync('dist/privacy/index.html','utf8');
 assert.match(notice,/Project profile:/);
 assert.match(notice,/Google-hosted mailbox/);
 assert.doesNotMatch(notice,/Internal publication blockers|@gmail\.com|personal operator|company-operated|GDPR compliant/);
});

test('consent banner uses native keyboard controls and stays non-modal',()=>{
 build();
 const html=readFileSync('dist/index.html','utf8');
 assert.match(html,/id="analytics-banner"[^>]*role="region"[^>]*hidden/);
 assert.match(html,/<main tabindex="-1" id="main"/);
 for(const id of ['banner-accept','banner-decline']) assert.ok(html.includes('id="'+id+'" class="button secondary" type="button"'));
 const css=readFileSync('public/styles.css','utf8');
 assert.match(css,/analytics-banner\[hidden\]\{display:none/);
 assert.doesNotMatch(css,/\.analytics-banner\{[^}]*position:(?:fixed|absolute)/);
 assert.match(css,/a:focus-visible,button:focus-visible/);
});

test('404 output is noindex, not canonicalized and excluded from the content sitemap',()=>{
 build({SITE_PUBLISH:'true',SITE_ORIGIN:'https://agready.ai'});
 const missing=readFileSync('dist/404.html','utf8');
 assert.match(missing,/noindex,nofollow/);
 assert.doesNotMatch(missing,/rel="canonical"|property="og:url"/);
 assert.match(missing,/href="\/"/);assert.match(missing,/href="\/docs\/"/);
 assert.match(missing,/name="ga4-measurement-id" content=""/);
 const sitemap=readFileSync('dist/sitemap.xml','utf8');
 assert.equal((sitemap.match(/<loc>/g)||[]).length,25);
 assert.doesNotMatch(sitemap,/404/);
 assert.ok(!existsSync('dist/_redirects'));
 build();
});
test('Pages preview host noindex headers survive both build modes',()=>{
 for(const publish of ['false','true']){
  build({SITE_PUBLISH:publish,SITE_ORIGIN:'https://agready.ai'});
  const headers=readFileSync('dist/_headers','utf8');
  assert.ok(headers.includes('https://agready-docs.pages.dev/*\n  X-Robots-Tag: noindex'));
  assert.ok(headers.includes('https://:version.agready-docs.pages.dev/*\n  X-Robots-Tag: noindex'));
  assert.equal(headers.includes('\n/*\n'),publish==='false');
  assert.doesNotMatch(headers,/https:\/\/agready.ai/);
 }
 assert.throws(()=>build({SITE_PUBLISH:'true',SITE_ORIGIN:'https://agready-docs.pages.dev'}));
 assert.throws(()=>build({SITE_PUBLISH:'true',SITE_ORIGIN:'https://example.com'}));
 build();
 assert.match(readFileSync('dist/robots.txt','utf8'),/Disallow: \//);
});

test('Search Console token persists only in the published homepage head',()=>{
 const token='TtCSefdKI5OtPV_p2mX9OihOAAK1kOdfoERM1Z3HgV4';
 const published=build({SITE_PUBLISH:'true',SITE_ORIGIN:'https://agready.ai'});
 const head=published.split('</head>')[0];
 assert.ok(head.includes('<meta name="google-site-verification" content="'+token+'" />'));
 assert.equal((published.match(/name="google-site-verification"/g)||[]).length,1);
 for(const p of JSON.parse(readFileSync('src/pages.json','utf8'))){
  assert.doesNotMatch(readFileSync('dist'+p.path+'index.html','utf8'),/google-site-verification/);
 }
 assert.doesNotMatch(readFileSync('dist/404.html','utf8'),/google-site-verification/);
 const preview=build({GOOGLE_SITE_VERIFICATION:token});
 assert.doesNotMatch(preview,/google-site-verification/);
 assert.ok(!preview.includes(token));
 assert.match(preview,/name="robots" content="noindex,nofollow"/);
 assert.match(preview,/name="ga4-measurement-id" content=""/);
});

test('first-use links point to AgReady release, licensing and the tutorial',()=>{
 const home=build();
 assert.match(home,/class="button dark" href="\/docs\/getting-started\/"/);
 const guide=readFileSync('dist/docs/getting-started/index.html','utf8');
 assert.match(guide,/https:\/\/github.com\/coffeehc\/agready-docs\/releases\/tag\/v0.0.1/);
 for(const name of ['LICENSE','EULA.md','SHA256SUMS','BINARY_SHA256SUMS']) assert.ok(guide.includes('/releases/download/v0.0.1/'+name));
 assert.match(guide,/AMD64 or ARM64/);
 assert.doesNotMatch(readFileSync('README.md','utf8'),/curl[^\n]*\|\s*bash/);
});

test('weekly brief keeps a fictional, source-linked example and explicit cutoff',()=>{
 build();
 const html=readFileSync('dist/blog/weekly-project-brief/index.html','utf8');
 assert.match(html,/fictional example/);
 assert.match(html,/not a report of an AgReady execution/);
 for(const id of ['N1','N2','N3','N4','N5']) assert.ok(html.includes('['+id+']'));
 assert.match(html,/After cutoff/); assert.match(html,/9 − 6 = 3/);
 assert.match(html,/not a verified resolution/);
 assert.match(html,/href="\/docs\/getting-started\/"/);
 for(const path of ['dist/blog/index.html','dist/blog/verifiable-agent-tasks/index.html']) assert.ok(readFileSync(path,'utf8').includes('href="/blog/weekly-project-brief/"'));
});

test('startup guide scopes source-derived platform behavior without private repository links',()=>{
 build(); const html=readFileSync('dist/docs/install-and-start/index.html','utf8');
 assert.match(html,/v0.0.1 release and its associated installer defaults/);
 assert.match(html,/agready-server/);
 assert.match(html,/http:\/\/127\.0\.0\.1:18888\//);
 assert.match(html,/not a statement that the server listens only on loopback/);
 assert.match(html,/does not automatically activate a managed service/);
 assert.match(html,/\$HOME\/\.local\/bin\/agready/);
 assert.doesNotMatch(html,/github\.com\/coffeehc\/agready\//);
 assert.doesNotMatch(html,/curl[^<]*\|\s*bash/);
});

test('first-use diagnostic anchors and read-only checks are linked without stale access claims',()=>{
 build(); const html=readFileSync('dist/docs/getting-started/index.html','utf8');
 for(const id of ['troubleshooting','startup-check','page-check','login-check','connection-check','output-check','tools-check']) assert.ok(html.includes('id="'+id+'"'));
 assert.match(html,/systemctl status agready-server --no-pager/);
 assert.match(html,/journalctl -u agready-server -n 100 --no-pager/);
 assert.match(html,/without restarting it/);
 assert.match(html,/Do not disable certificate checks/);
 assert.match(html,/Do not attach a full configuration or unreviewed journal dump/);
 for(const path of ['faq','docs/core-concepts']) {
  const content=readFileSync('dist/'+path+'/index.html','utf8');
  assert.match(content,/href="\/docs\/getting-started\/#troubleshooting"/);
  assert.doesNotMatch(content,/Deployment and access instructions are not yet published|license details will need to accompany/);
 }
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length);
 assert.match(html,/<a class="skip" href="#main">/);
});

test('Agent Ready vision stays distinct from product and is connected to existing guides',()=>{
 const home=build();
 assert.match(home,/self-hosted AI agent workspace/);
 assert.match(home,/class="button primary" href="\/docs\/getting-started\/"/);
 const vision=readFileSync('dist/agent-ready/index.html','utf8');
 for(const phrase of ['my vision','default operator','open APIs','Inside AgReady','Inside the connected business system','user interface','not a certification']) assert.ok(vision.includes(phrase),phrase);
 assert.match(vision,/does not describe a fully implemented product/);
 for(const path of ['/','/product/','/docs/','/about/']) assert.ok(readFileSync('dist'+path+'index.html','utf8').includes('href="/agent-ready/"'),path);
 const product=readFileSync('dist/product/index.html','utf8');
 for(const phrase of ['Who is it for?','How do you work with it?','What is available, and what needs checking?']) assert.ok(product.includes(phrase));
 assert.doesNotMatch(vision,/certified Agent Ready|first-ever|guaranteed autonomy/);
});

test('four substantive guides have real links, version scope and no internal evidence',()=>{
 build();
 const names=['install-and-start','model-configuration','sessions-and-context','files-and-workspace'];
 const docs=readFileSync('dist/docs/index.html','utf8');
 for(const name of names){
  const html=readFileSync('dist/docs/'+name+'/index.html','utf8');
  assert.ok(docs.includes('href="/docs/'+name+'/"'));
  assert.ok((html.match(/<h2\b/g)||[]).length>=4);
  assert.doesNotMatch(html,/INTERNAL ONLY|INTERNAL-EVIDENCE|e5942c56|github.com\/coffeehc\/agready\/|accompanying interface images/);
  if(name!=='install-and-start') assert.match(html,/October 2026 development interface/);
 }
 assert.ok(!existsSync('dist/INTERNAL-EVIDENCE.md'));
 const start=readFileSync('dist/docs/getting-started/index.html','utf8');
 for(const name of names) assert.ok(start.includes('href="/docs/'+name+'/"'));
 for(const id of ['access','setup','model','task','review','stop','troubleshooting']) assert.ok(start.includes('id="'+id+'"'));
});

test('all docs routes have shared accessible navigation and real page TOC anchors',()=>{
 build(); const pages=JSON.parse(readFileSync('src/pages.json','utf8')).filter(p=>p.path.startsWith('/docs/'));
 assert.equal(pages.length,15);
 for(const page of pages){
  const html=readFileSync('dist'+page.path+'index.html','utf8');
  assert.match(html,/class="docs-sidebar"/);assert.match(html,/<details class="docs-mobile-menu"><summary>Documentation menu<\/summary>/);
  const navs=[...html.matchAll(/<nav aria-label="Documentation(?: mobile)?" class="docs-navigation">([\s\S]*?)<\/nav>/g)];
  assert.equal(navs.length,2);
  for(const [,nav] of navs){
   assert.equal((nav.match(/aria-current="page"/g)||[]).length,1);
   assert.ok(nav.includes('href="'+page.path+'" aria-current="page"'));
   for(const item of pages) assert.ok(nav.includes('href="'+item.path+'"'),item.path);
   assert.doesNotMatch(nav,/href="\/blog/);
  }
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
  if(page.path!=='/docs/'){
   const toc=html.match(/<nav aria-label="On this page">([\s\S]*?)<\/nav>/)[1];
   const main=html.match(/<main\b[\s\S]*?<\/main>/)[0];
   const headings=[...main.matchAll(/<h2[^>]*id="([^"]+)"/g)].map(m=>m[1]);
   assert.ok(headings.length>=3);
   for(const id of headings) assert.ok(toc.includes('href="#'+id+'"'));
   assert.equal((toc.match(/href="#/g)||[]).length,headings.length);
  }
 }
 const css=readFileSync('public/styles.css','utf8');
 assert.match(css,/@media\(max-width:900px\)/);assert.match(css,/summary:focus-visible/);
});

test('advanced guidance keeps version and recovery boundaries with shared navigation',()=>{
 build();
 const names=['memory-and-context','skills-and-reusable-work','tools-and-runtime-assets','human-oversight','operations'];
 const docs=readFileSync('dist/docs/index.html','utf8');
 for(const name of names){
  const page=readFileSync('dist/docs/'+name+'/index.html','utf8');
  assert.ok((page.match(/<h2\b/g)||[]).length>=5);
  assert.ok(docs.includes('href="/docs/'+name+'/"'));
  assert.doesNotMatch(page,/INTERNAL|e5942c56|9d6fc32|github.com\/coffeehc\/agready\/|successful live test/);
 }
 const ops=readFileSync('dist/docs/operations/index.html','utf8');
 assert.match(ops,/separate database backup/);assert.match(ops,/credentials and the decryption key/);
 assert.match(ops,/Ready for cutover/);assert.match(ops,/Confirmation cleans up/);
 assert.doesNotMatch(ops,/agready(?:-server)? backup restore --continue/);
});

test('visible breadcrumbs match production JSON-LD on every non-home content page',()=>{
 build({SITE_PUBLISH:'true',SITE_ORIGIN:'https://agready.ai'});
 const pages=JSON.parse(readFileSync('src/pages.json','utf8'));
 const routes=new Set(['/',...pages.map(p=>p.path)]);
 for(const page of pages){
  const html=readFileSync('dist'+page.path+'index.html','utf8');
  const nav=html.match(/<nav class="breadcrumbs" aria-label="Breadcrumb">([\s\S]*?)<\/nav>/)[1];
  assert.equal((nav.match(/aria-current="page"/g)||[]).length,1);
  const raw=html.match(/<script type="application\/ld\+json" id="breadcrumb-data">([\s\S]*?)<\/script>/)[1];
  const schema=JSON.parse(raw);
  assert.equal(schema['@type'],'BreadcrumbList');assert.equal(schema['@context'],'https://schema.org');
  const items=schema.itemListElement;
  const expectedParent=page.path.startsWith('/docs/')&&page.path!=='/docs/'?'/docs/':page.path.startsWith('/blog/')&&page.path!=='/blog/'?'/blog/':null;
  assert.equal(items.length,expectedParent?3:2);
  assert.equal(items[0].name,'Home');assert.equal(items[0].item,'https://agready.ai/');
  if(expectedParent) assert.equal(items[1].item,'https://agready.ai'+expectedParent);
  for(const [index,item] of items.entries()){
   assert.equal(item['@type'],'ListItem');assert.equal(item.position,index+1);
   assert.ok(routes.has(new URL(item.item).pathname));
   const escaped=item.name.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
   assert.ok(nav.includes('>'+escaped+'</'),page.path+': '+item.name);
   if(index<items.length-1) assert.ok(nav.includes('href="'+new URL(item.item).pathname+'"'));
  }
  assert.equal(items.at(-1).item,'https://agready.ai'+page.path);
 }
 for(const path of ['dist/index.html','dist/404.html']) assert.doesNotMatch(readFileSync(path,'utf8'),/breadcrumb-data|aria-label="Breadcrumb"/);
 build();
 for(const page of pages){const html=readFileSync('dist'+page.path+'index.html','utf8');assert.doesNotMatch(html,/breadcrumb-data|BreadcrumbList/);assert.match(html,/aria-label="Breadcrumb"/);}
});


test('related products distinguish information and messaging from native AgReady integrations',()=>{
 build({SITE_PUBLISH:'true',SITE_ORIGIN:'https://agready.ai'});
 const html=readFileSync('dist/product/index.html','utf8');
 for(const id of ['related-products','lead','letter']) assert.ok(html.includes('id="'+id+'"'));
 assert.match(html,/Lead: a workspace for curated information/);
 assert.match(html,/Letter: asynchronous messaging for AI agents/);
 assert.match(html,/not requirements for using AgReady/);
 assert.match(html,/agent supplies the collection and scheduling workflow/);
 assert.match(html,/Receiving a message does not itself authorize/);
 assert.match(html,/do not imply a preconfigured or tested native AgReady integration/);
 assert.match(html,/href="https:\/\/github.com\/coffeehc\/xletter-skill"/);
 assert.match(html,/href="https:\/\/xlead\.51apis\.com\/"/);
 assert.match(html,/href="https:\/\/xletter\.51apis\.com\/"/);
 assert.doesNotMatch(html,/https:\/\/(?:lead|letter)\.agready\.ai|github\.com\/coffeehc\/(?:lead|letter)(?:["/])|guaranteed delivery|SMTP-compatible/);
 assert.equal(JSON.parse(readFileSync('src/pages.json','utf8')).length,24);
 assert.match(html,/rel="canonical" href="https:\/\/agready\.ai\/product\/"/);
});


test('self-hosted agent article publishes approved copy with sources and semantic table',()=>{
 build({SITE_PUBLISH:'true',SITE_ORIGIN:'https://agready.ai'});
 const path='/blog/self-hosted-ai-agent-work-you-control/';
 const html=readFileSync('dist'+path+'index.html','utf8');
 assert.ok(html.includes('<h1>AgReady: A Self-Hosted AI Agent for Work You Control</h1>'));
 assert.doesNotMatch(html,/Editorial notes|Suggested slug|Suggested web title|Website article draft/);
 assert.match(html,/not an ITU certification/);assert.match(html,/illustrative workflow, not a reported test result/);
 assert.ok(html.includes('href="https://www.itu.int/rec/T-REC-F.748.46/en"'));
 assert.ok(html.includes('href="https://cloud.tencent.cn/product/workbuddy-enterprise"'));
 assert.ok(html.includes('<table class="capabilities-table">'));
 assert.equal((html.match(/scope="row"/g)||[]).length,33);
 assert.equal((html.match(/scope="col"/g)||[]).length,17);
 assert.ok(html.includes('rel="canonical" href="https://agready.ai'+path+'"'));
 assert.ok(readFileSync('dist/blog/index.html','utf8').includes('href="'+path+'"'));
 assert.ok(readFileSync('dist/sitemap.xml','utf8').includes('<loc>https://agready.ai'+path+'</loc>'));
});


test('four-product comparison retains dated evidence limits and scoped capability conditions',()=>{
 build({SITE_PUBLISH:'true',SITE_ORIGIN:'https://agready.ai'});
 const html=readFileSync('dist/blog/self-hosted-ai-agent-work-you-control/index.html','utf8');
 assert.equal((html.match(/class="product-comparison-table"/g)||[]).length,3);
 assert.equal((html.match(/class="comparison-table-scroll" role="region"/g)||[]).length,3);
 assert.equal((html.match(/id="comparison-source-\d+"/g)||[]).length,31);
 assert.match(html,/insufficient evidence, not absence/);
 assert.match(html,/No common-condition testing was performed/);
 assert.match(html,/October 28, 2026/);
 assert.match(html,/hard user and team budgets are not implemented/);
 assert.match(html,/enterprise private-deployment offering/);
 assert.match(html,/not every ChatGPT feature/);
 assert.match(html,/not Claude Code/);
 assert.doesNotMatch(html,/coffeehc\/(?:agready|lead|letter)["/]|\/workspace\/|2539cc1/);
 const css=readFileSync('public/styles.css','utf8');
 assert.match(css,/\.comparison-table-scroll\{max-width:100%;overflow-x:auto/);
 assert.match(css,/\.product-comparison-table\{width:100%;min-width:900px/);
});


test('capabilities overview is a first-class docs entry with bounded product guidance',()=>{
 build({SITE_PUBLISH:'true',SITE_ORIGIN:'https://agready.ai'});
 const path='/docs/what-can-agready-do/';
 const html=readFileSync('dist'+path+'index.html','utf8');
 assert.ok(html.includes('<h1>What can you do with AgReady?</h1>'));
 assert.match(html,/These are task patterns, not a claim/);
 assert.match(html,/More agents do not automatically mean a faster or better result/);
 assert.match(html,/configured schedule as proof that work happened/);
 assert.match(html,/page-reading tool does not establish that interactive browsing is available/);
 assert.match(html,/aria-label="On this page"/);
 for(const page of ['dist/docs/index.html','dist/product/index.html']) assert.ok(readFileSync(page,'utf8').includes('href="'+path+'"'));
 assert.ok(html.includes('rel="canonical" href="https://agready.ai'+path+'"'));
 assert.ok(readFileSync('dist/sitemap.xml','utf8').includes('<loc>https://agready.ai'+path+'</loc>'));
});


test('team and recurring guides preserve activation and evidence boundaries',()=>{
 build({SITE_PUBLISH:'true',SITE_ORIGIN:'https://agready.ai'});
 const team=readFileSync('dist/docs/agent-teams/index.html','utf8');
 const recurring=readFileSync('dist/docs/recurring-tasks/index.html','utf8');
 assert.match(team,/without creating a team/);assert.match(team,/not exercised in this check/);
 assert.match(team,/Archive team/);assert.match(team,/Restore team/);assert.match(team,/role description does not grant additional access/);
 assert.match(recurring,/Operations → Triggers/);assert.match(recurring,/without saving a trigger/);
 assert.match(recurring,/UTC\+8/);assert.match(recurring,/not verified task completions/);
 assert.match(recurring,/does not automatically disable the recurring trigger/);
 for(const slug of ['agent-teams','recurring-tasks']){
  for(const source of ['dist/docs/index.html','dist/docs/what-can-agready-do/index.html']) assert.ok(readFileSync(source,'utf8').includes('href="/docs/'+slug+'/"'));
  assert.ok(readFileSync('dist/sitemap.xml','utf8').includes('<loc>https://agready.ai/docs/'+slug+'/</loc>'));
 }
 for(const html of [team,recurring])assert.doesNotMatch(html,/82ffcc|081948|\/workspace\/|team-manager\.md|builtin\.yaml/);
});
