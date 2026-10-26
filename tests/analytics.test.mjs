import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync('public/app.js','utf8');
function harness(id='',saved=null,blockedStorage=false){
 const listeners={},requests=[],storage=new Map(saved?[['agready.analytics-choice.v1',saved]]:[]),nodes=new Map();
 function node(key){if(!nodes.has(key))nodes.set(key,{textContent:'',disabled:false,open:false,addEventListener(type,fn){listeners[key+':'+type]=fn},showModal(){this.open=true},remove(){this.removed=true}});return nodes.get(key)}
 const cta={dataset:{cta:'explore_workspace'},addEventListener(type,fn){listeners['cta:'+type]=fn}};
 const window={};
 const document={cookie:'',title:'AgReady',querySelector(){return {content:id}},getElementById:node,querySelectorAll(){return [cta]},createElement(){return {}},head:{appendChild(s){requests.push(s.src);nodes.set(s.id,s)}}};
 const context={window,document,localStorage:{getItem(k){if(blockedStorage)throw new Error('blocked');return storage.get(k)||null},setItem(k,v){if(blockedStorage)throw new Error('blocked');storage.set(k,v)}},location:{origin:'https://agready.ai',pathname:'/',hostname:'agready.ai',search:'?secret=never',hash:'#never'},Date,encodeURIComponent};
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
 // The test models removal; real browser removal does not unload an already executed script.
 h.nodes.get('agready-google-tag').remove=()=>{};
 const n=h.events().length;h.click('analytics-decline');h.click('cta');assert.equal(h.events().length,n);assert.equal(h.window['ga-disable-G-TEST123'],true);
 h.click('analytics-accept');assert.equal(h.window['ga-disable-G-TEST123'],false);h.click('cta');assert.equal(h.events().length,n+1);
 assert.equal(harness('G-TEST123','declined').requests.length,0);
});
test('blocked local storage is safe and defaults to off; dialog works',()=>{
 const h=harness('G-TEST123',null,true);assert.equal(h.requests.length,0);h.click('privacy-open');assert.equal(h.nodes.get('privacy-dialog').open,true);h.click('analytics-decline');assert.equal(h.requests.length,0);
});
