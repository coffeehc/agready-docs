import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { site } from '../src/site.config.mjs';
const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const origin = new URL(process.env.SITE_ORIGIN || 'https://agready.ai');
if (origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash || origin.username || origin.password) throw new Error('SITE_ORIGIN must be an HTTPS origin without a path, credentials or query.');
const publish = process.env.SITE_PUBLISH === 'true';
if (publish && origin.origin !== 'https://agready.ai') throw new Error('Published SITE_ORIGIN must be https://agready.ai.');
const ga = process.env.GA4_MEASUREMENT_ID || '';
if (ga && !/^G-[A-Z0-9]+$/.test(ga)) throw new Error('GA4_MEASUREMENT_ID must be a GA4 G- identifier.');
const verification = process.env.GOOGLE_SITE_VERIFICATION || site.googleSiteVerification || '';
await rm('dist', { recursive:true, force:true });
await mkdir('dist', {recursive:true});
await cp('public', 'dist', {recursive:true});
// Content-addressed URLs prevent an older cached asset from styling a new page.
// Keep legacy names for previously cached HTML; new pages only use hashed URLs.
const assets = {};
for (const name of ['styles.css', 'app.js']) {
 const bytes = await readFile('public/'+name);
 const hash = createHash('sha256').update(bytes).digest('hex').slice(0,16);
 const dot = name.lastIndexOf('.');
 const versioned = name.slice(0,dot)+'.'+hash+name.slice(dot);
 await writeFile('dist/'+versioned, bytes);
 assets['/'+name] = '/'+versioned;
}

const pages = [{source:'src/index.html',path:'/',title:site.title,description:site.description}, ...JSON.parse(await readFile('src/pages.json','utf8'))];
for (const page of [...pages, {source:'src/404.html',path:'/404.html',output:'dist/404.html',notFound:true}]) {
 let html = await readFile(page.source,'utf8');
 for (const [original, versioned] of Object.entries(assets)) html = html.replaceAll('\"'+original+'\"', '\"'+versioned+'\"');
 const values = { TITLE:page.title, DESCRIPTION:page.description, PAGE_PATH:page.path, ORIGIN:origin.origin, ROBOTS:publish&&!page.notFound?'index,follow':'noindex,nofollow', GA_ID:ga, VERIFICATION:verification };
 html = html.replace(/\{\{([A-Z_]+)\}\}/g,(_,k)=>escape(values[k] ?? ''));
 // Publish the public ownership token only on the production homepage.
 html = html.replace(/<meta name="google-site-verification"[^>]*>\s*/g, '');
 if (publish && page.path === '/' && verification) {
  html = html.replace('</head>', `<meta name="google-site-verification" content="${escape(verification)}" />\n</head>`);
 }

 if (!publish || page.notFound) html = html.replace(/<link rel="canonical"[^>]*>/g, '').replace(/<meta property="og:(?:url|image)"[^>]*>/g, '');
 const output = page.output || 'dist'+page.path+'index.html';
 await mkdir(dirname(output),{recursive:true});
 await writeFile(output,html);
}
// Cloudflare Pages supports absolute-host patterns and named host placeholders.
// Always protect the project and branch/commit preview hosts, even in a published build.
const previewHeaders = 'https://agready-docs.pages.dev/*\n  X-Robots-Tag: noindex\n\nhttps://:version.agready-docs.pages.dev/*\n  X-Robots-Tag: noindex\n';
await writeFile('dist/_headers', previewHeaders + (!publish ? '\n/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n' : ''));

await writeFile('dist/robots.txt', publish ? `User-agent: *\nAllow: /\nSitemap: ${origin.origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publish?pages.map(p=>`<url><loc>${escape(origin.origin+p.path)}</loc></url>`).join(''):''}</urlset>\n`);
console.log(`Built dist/ (${publish?'indexable production':'noindex preview'}; analytics ${ga?'configured, consent required':'disabled'}).`);
