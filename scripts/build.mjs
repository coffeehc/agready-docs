import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { site } from '../src/site.config.mjs';
const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const origin = new URL(process.env.SITE_ORIGIN || 'https://agready.ai');
if (origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash || origin.username || origin.password) throw new Error('SITE_ORIGIN must be an HTTPS origin without a path, credentials or query.');
const publish = process.env.SITE_PUBLISH === 'true';
const ga = process.env.GA4_MEASUREMENT_ID || '';
if (ga && !/^G-[A-Z0-9]+$/.test(ga)) throw new Error('GA4_MEASUREMENT_ID must be a GA4 G- identifier.');
const verification = process.env.GOOGLE_SITE_VERIFICATION || '';
await rm('dist', { recursive:true, force:true });
await mkdir('dist', {recursive:true});
await cp('public', 'dist', {recursive:true});
let html = await readFile('src/index.html','utf8');
const values = { TITLE:site.title, DESCRIPTION:site.description, ORIGIN:origin.origin, ROBOTS:publish?'index,follow':'noindex,nofollow', GA_ID:ga, VERIFICATION:verification };
html = html.replace(/\{\{([A-Z_]+)\}\}/g,(_,k)=>escape(values[k] ?? ''));
// A draft may be hosted on an unknown pages.dev URL. Never claim the live domain as its canonical.
if (!publish) html = html
  .replace(/<link rel="canonical"[^>]*>/g, '')
  .replace(/<meta property="og:(?:url|image)"[^>]*>/g, '');
await writeFile('dist/index.html', html);
if (!publish) await writeFile('dist/_headers', '/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n');
await writeFile('dist/robots.txt', publish ? `User-agent: *\nAllow: /\nSitemap: ${origin.origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publish?`<url><loc>${escape(origin.origin)}/</loc></url>`:''}</urlset>\n`);
console.log(`Built dist/ (${publish?'indexable production':'noindex preview'}; analytics ${ga?'configured, consent required':'disabled'}).`);
