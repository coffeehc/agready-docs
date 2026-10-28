const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
// A page's visible title supplies its label; only real section landing pages are parents.
export function breadcrumbTrail(page, pages) {
 if(page.notFound || page.path === '/') return [];
 const label = page.path === '/docs/' ? 'Docs' : page.path === '/blog/' ? 'Blog' : page.title.split(' — ')[0];
 const trail = [{name:'Home',path:'/'}];
 if(page.path.startsWith('/docs/') && page.path !== '/docs/') trail.push({name:'Docs',path:'/docs/'});
 if(page.path.startsWith('/blog/') && page.path !== '/blog/') trail.push({name:'Blog',path:'/blog/'});
 trail.push({name:label,path:page.path});
 const routes=new Set(pages.map(item=>item.path));
 for(const item of trail) if(!routes.has(item.path)) throw new Error('Breadcrumb route does not exist: '+item.path);
 return trail;
}
export function addBreadcrumbs(html,page,pages,{publish,origin}) {
 const trail=breadcrumbTrail(page,pages);
 if(!trail.length) return html;
 const visible='<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>'+trail.map((item,index)=>'<li>'+(index?'<span class="breadcrumb-separator" aria-hidden="true">/</span>':'')+(index===trail.length-1?'<span aria-current="page">'+escape(item.name)+'</span>':'<a href="'+escape(item.path)+'">'+escape(item.name)+'</a>')+'</li>').join('')+'</ol></nav>';
 html=html.replace(/(<main\b[^>]*>)/,'$1'+visible);
 if(publish){
  const structured={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:trail.map((item,index)=>({'@type':'ListItem',position:index+1,name:item.name,item:origin+item.path}))};
  // JSON-LD is data, but escape script delimiters and separators before embedding it.
  const json=JSON.stringify(structured).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
  html=html.replace('</head>','<script type="application/ld+json" id="breadcrumb-data">'+json+'</script>\n</head>');
 }
 return html;
}
