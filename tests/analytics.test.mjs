import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync('public/app.js','utf8');
function tagConsent(h,expected){assert.equal(h.events().filter(a=>a[0]==='consent').at(-1)[2].analytics_storage,expected)}
function harness(id='',saved=null,blockedStorage=false,hostname='agready.ai'){
 const listeners={},requests=[],storage=new Map(saved?[['agready.analytics-choice.v1',saved]]:[]),nodes=new Map();
 function node(key){if(!nodes.has(key))nodes.set(key,{textContent:'',disabled:false,open:false,hidden:true,contains(el){return el?.ownerBanner===key},focus(options){this.focused=true;this.focusOptions=options},addEventListener(type,fn){listeners[key+':'+type]=fn},showModal(){this.open=true},remove(){this.removed=true}});return nodes.get(key)}
 const cta={dataset:{cta:'explore_workspace'},addEventListener(type,fn){listeners['cta:'+type]=fn}};
 const window={};
 const document={cookie:'',title:'AgReady',querySelector(){return {content:id}},getElementById:node,querySelectorAll(){return [cta]},createElement(){return {remove(){this.removed=true}}},head:{appendChild(s){requests.push(s.src);nodes.set(s.id,s)}}};
 const context={window,document,localStorage:{getItem(k){if(blockedStorage)throw new Error('blocked');return storage.get(k)||null},setItem(k,v){if(blockedStorage)throw new Error('blocked');storage.set(k,v)}},location:{origin:'https://agready.ai',pathname:'/',hostname,search:'?secret=never',hash:'#never'},Date,encodeURIComponent};
 vm.runInNewContext(source,context);
 return {window,document,nodes,requests,storage,click:(k)=>listeners[k+':click'](),events:()=>window.dataLayer?.map(a=>Array.from(a))||[]};
}
test('blank ID remains off regardless of stored or clicked consent',()=>{
 const h=harness('','accepted');h.click('analytics-accept');h.click('cta');
 assert.equal(h.requests.length,0);assert.equal(h.nodes.get('analytics-accept').disabled,true);
});
test('configured ID is opt-in; decline leaves network and event queue untouched',()=>{
 const h=harness('G-TEST123');assert.equal(h.requests.length,0);h.click('analytics-decline');h.click('cta');assert.equal(h.requests.length,0);assert.equal(h.events().length,0);
});
test('accept emits sanitized page event; repeated acceptance never reloads tag',()=>{
 const h=harness('G-TEST123');h.click('analytics-accept');h.click('analytics-accept');h.click('cta');
 assert.equal(h.requests.length,1);assert.match(h.requests[0],/^https:\/\/www.googletagmanager.com\/gtag\/js\?id=G-TEST123$/);
 assert.equal(h.events().filter(a=>a[0]==='event'&&a[1]==='page_view').length,1);
 assert.equal(h.events().filter(a=>a[1]==='navigation_click').length,1);
 assert.equal(JSON.stringify(h.events()).includes('never'),false);
 assert.equal(h.events().find(a=>a[1]==='page_view')[2].page_location,'https://agready.ai/');
});
test('withdrawal stops adapter events, reaccept works and persisted decline stays off',()=>{
 const h=harness('G-TEST123');h.click('analytics-accept');
 // Retaining the tag supports reacceptance even while its first request is pending.
 const n=h.events().filter(a=>a[0]==='event').length;h.click('analytics-decline');h.click('cta');assert.equal(h.events().filter(a=>a[0]==='event').length,n);assert.equal(h.window['ga-disable-G-TEST123'],true);tagConsent(h,'denied');assert.notEqual(h.nodes.get('agready-google-tag').removed,true);
 h.click('analytics-accept');assert.equal(h.window['ga-disable-G-TEST123'],false);h.click('cta');assert.equal(h.events().filter(a=>a[0]==='event').length,n+1);tagConsent(h,'granted');
 assert.equal(harness('G-TEST123','declined').requests.length,0);
});
test('blocked local storage is safe and defaults to off; dialog works',()=>{
 const h=harness('G-TEST123',null,true);assert.equal(h.requests.length,0);h.click('privacy-open');assert.equal(h.nodes.get('privacy-dialog').open,true);h.click('analytics-decline');assert.equal(h.requests.length,0);
});

test('preference status and feedback describe Google Analytics only',()=>{
 const h=harness();
 assert.match(h.nodes.get('analytics-status').textContent,/Google Analytics is not configured/);
 h.click('analytics-decline');
 assert.match(h.nodes.get('consent-feedback').textContent,/does not disable Cloudflare measurement/);
 assert.equal(h.requests.length,0);
 const enabled=harness('G-TEST123');enabled.click('analytics-accept');
 assert.match(enabled.nodes.get('consent-feedback').textContent,/Google Analytics allowed/);
 assert.match(enabled.nodes.get('consent-feedback').textContent,/Cloudflare measurement is separate/);
});

test('first-choice banner is configured-only, non-consenting and hides after either choice',()=>{
 assert.equal(harness().nodes.get('analytics-banner').hidden,true);
 const h=harness('G-TEST123');
 assert.equal(h.nodes.get('analytics-banner').hidden,false);
 assert.equal(h.requests.length,0);
 h.click('banner-decline');assert.equal(h.requests.length,0);
 assert.equal(h.nodes.get('analytics-banner').hidden,true);
 assert.equal(h.storage.get('agready.analytics-choice.v1'),'declined');
 const yes=harness('G-TEST123');yes.click('banner-accept');yes.click('banner-accept');
 assert.equal(yes.requests.length,1);assert.equal(yes.nodes.get('analytics-banner').hidden,true);
 assert.equal(harness('G-TEST123','accepted').nodes.get('analytics-banner').hidden,true);
 assert.equal(harness('G-TEST123','declined').nodes.get('analytics-banner').hidden,true);
 assert.equal(harness('G-TEST123','invalid').nodes.get('analytics-banner').hidden,false);
});
test('banner keyboard focus continues at content; storage failure does not imply future consent',()=>{
 const h=harness('G-TEST123',null,true);
 assert.equal(h.nodes.get('main'),undefined);
 h.document.activeElement={ownerBanner:'analytics-banner'};
 h.click('banner-decline');assert.equal(h.nodes.get('main').focused,true);
 assert.equal(h.nodes.get('main').focusOptions.preventScroll,true);
 assert.equal(h.requests.length,0);
 const next=harness('G-TEST123',null,true);
 assert.equal(next.nodes.get('analytics-banner').hidden,false);assert.equal(next.requests.length,0);
 next.click('banner-accept');assert.equal(next.requests.length,1);
 next.click('analytics-decline');const n=next.events().length;next.click('cta');assert.equal(next.events().length,n);
});

 test('production ID never loads on preview or local host',()=>{
 for(const host of ['agready-docs.pages.dev','preview.agready-docs.pages.dev','localhost','agent.agready.ai']){
  const h=harness('G-TEST123','accepted',false,host);h.click('analytics-accept');h.click('cta');
  assert.equal(h.requests.length,0);assert.equal(h.events().length,0);assert.equal(h.nodes.get('analytics-banner').hidden,true);
 }
 });
