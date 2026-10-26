import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { dirname } from 'node:path';
import { site } from '../src/site.config.mjs';
const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const origin = new URL(process.env.SITE_ORIGIN || 'https://agready.ai');
if (origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash || origin.username || origin.password) throw new Error('SITE_ORIGIN must be an HTTPS origin without a path, credentials or query.');
const publish = process.env.SITE_PUBLISH === 'true';
const ga = process.env.GA4_MEASUREMENT_ID || '';
if (ga && !/^G-[A-Z0-9]+$/.test(ga)) throw new Error('GA4_MEASUREMENT_ID must be a GA4 G- identifier.');
const verification = process.env.GOOGLE_SITE_VERIFICATION || '';
const pages = [
  {source:'src/index.html', path:'/', title:site.title, description:site.description},
  {source:'src/getting-started.html', path:'/docs/getting-started/', title:'Getting started — AgReady', description:'Find the official xAgent release resources, prepare your environment and verify a bounded first task. An AgReady getting started guide.'},
];
await rm('dist', { recursive:true, force:true });
await mkdir('dist', {recursive:true});
await cp('public', 'dist', {recursive:true});
for (const page of pages) {
  let html = await readFile(page.source,'utf8');
  const values = { TITLE:page.title, DESCRIPTION:page.description, PAGE_PATH:page.path, ORIGIN:origin.origin, ROBOTS:publish?'index,follow':'noindex,nofollow', GA_ID:ga, VERIFICATION:verification };
  html = html.replace(/\{\{([A-Z_]+)\}\}/g,(_,k)=>escape(values[k] ?? ''));
  // An unknown preview hostname must not be represented as the production domain.
  if (!publish) html = html.replace(/<link rel="canonical"[^>]*>/g, '').replace(/<meta property="og:(?:url|image)"[^>]*>/g, '');
  const output = 'dist' + page.path + 'index.html';
  await mkdir(dirname(output), {recursive:true});
  await writeFile(output, html);
}
if (!publish) await writeFile('dist/_headers', '/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n');
await writeFile('dist/robots.txt', publish ? `User-agent: *\nAllow: /\nSitemap: ${origin.origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publish?pages.map(p=>`<url><loc>${escape(origin.origin+p.path)}</loc></url>`).join(''):''}</urlset>\n`);
console.log(`Built ${pages.length} pages in dist/ (${publish?'indexable production':'noindex preview'}; analytics ${ga?'configured, consent required':'disabled'}).`);
