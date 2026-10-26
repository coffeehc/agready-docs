// Optional QA script. Playwright must be supplied by the QA environment; it is not a runtime dependency.
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
await mkdir('artifacts',{recursive:true});
const results=[];
for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['small-mobile',320,740]]) {
 const page=await browser.newPage({viewport:{width,height}});
 const errors=[], external=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(!r.url().startsWith('http://localhost:4173'))external.push(r.url());});
 await page.goto('http://localhost:4173/?private=test#main');
 assert.equal(await page.locator('h1').count(),1);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${name} horizontal overflow`);
 await page.screenshot({path:`artifacts/${name}.png`,fullPage:true});
 await page.getByRole('button',{name:'Google Analytics preference',exact:true}).click();
 assert.equal(await page.locator('dialog').evaluate(d=>d.open),true);
 assert.equal(await page.getByRole('button',{name:'Allow Google Analytics',exact:true}).isDisabled(),true);
 await page.getByRole('button',{name:'Decline Google Analytics',exact:true}).click();
 assert.equal(await page.evaluate(()=>localStorage.getItem('agready.analytics-choice.v1')),'declined');
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('dialog').evaluate(d=>d.open),false);
 await page.reload();
 assert.equal(external.length,0,'Unconfigured build made external request');
 assert.deepEqual(errors,[]);
 results.push(`${name}: no overflow, no JS errors, privacy open/decline/Escape/reload passed, zero third-party requests.`);
 await page.close();
}
// Test an explicitly configured ID without sending traffic to any third party.
const page=await browser.newPage({viewport:{width:1000,height:800}});
const requested=[];
await page.route('**/*',async route=>{
 const url=route.request().url();
 if(!url.startsWith('http://localhost:4173')) {requested.push(url);return route.fulfill({contentType:'application/javascript',body:'/* mocked Google tag; no network */'});}
 if(route.request().resourceType()==='document'){
  const response=await route.fetch();
  return route.fulfill({response,body:(await response.text()).replace('name="ga4-measurement-id" content=""','name="ga4-measurement-id" content="G-QATEST123"')});
 }
 return route.continue();
});
await page.goto('http://localhost:4173/?secret=do-not-send#secret');
assert.equal(requested.length,0);
await page.getByRole('button',{name:'Google Analytics preference',exact:true}).click();
await page.getByRole('button',{name:'Allow Google Analytics',exact:true}).click();
await page.waitForTimeout(100);
assert.equal(requested.length,1);
assert.match(requested[0],/googletagmanager.com\/gtag\/js\?id=G-QATEST123/);
const entries=await page.evaluate(()=>Array.from(window.dataLayer,a=>Array.from(a)));
assert.equal(JSON.stringify(entries).includes('do-not-send'),false);
assert.equal(JSON.stringify(entries).includes('#secret'),false);
await page.getByRole('button',{name:'Decline Google Analytics',exact:true}).click();
assert.equal(await page.evaluate(()=>window['ga-disable-G-QATEST123']),true);
await page.getByRole('button',{name:'Allow Google Analytics',exact:true}).click();
assert.equal(await page.evaluate(()=>window['ga-disable-G-QATEST123']),false);
await page.getByRole('button',{name:'Decline Google Analytics',exact:true}).click();
await page.reload();
assert.equal(requested.length,1,'Declined reload loaded third-party tag');
results.push('Configured analytics (mocked): zero pre-consent requests; accept loads one tag; query/hash absent from event queue; decline and reaccept toggle disable flag; declined reload does not load tag.');
await page.close();
await browser.close();
await writeFile('artifacts/browser-results.txt',results.join('\n')+'\n');
console.log(results.join('\n'));
