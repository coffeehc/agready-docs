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
 for(const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) assert.ok(existsSync('dist'+(match[1].endsWith('/')?match[1]+'index.html':match[1])),match[1]);
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
 assert.equal(pages.length,7);
 for(const page of pages){
  const html=readFileSync('dist'+page.path+'index.html','utf8');
  assert.equal((html.match(/<h1\b/g)||[]).length,1,page.path);
  assert.match(html,/name="robots" content="noindex,nofollow"/);
  assert.match(html,/name="ga4-measurement-id" content=""/);
  assert.doesNotMatch(html,/rel="canonical"|xagent-releases|xagent\.xiagaogao|github\.com\/coffeehc\/agready|localhost|127\.0\.0\.1|\{\{[A-Z_]+\}\}/);
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

test('brand and navigation stay consistent across all eight pages',()=>{
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
