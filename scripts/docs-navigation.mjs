const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const documentationGroups = [
 {title:'Start here',pages:[['/docs/','Documentation overview'],['/docs/getting-started/','Get started']]},
 {title:'Set up your instance',pages:[['/docs/install-and-start/','Install and start'],['/docs/model-configuration/','Model configuration']]},
 {title:'Work with an agent',pages:[['/docs/sessions-and-context/','Sessions and context'],['/docs/files-and-workspace/','Files and workspace']]},
 {title:'Context and reusable work',pages:[['/docs/memory-and-context/','Memory and context'],['/docs/skills-and-reusable-work/','Skills']]},
 {title:'Tools and human control',pages:[['/docs/tools-and-runtime-assets/','Tools and integrations'],['/docs/human-oversight/','Human oversight']]},
 {title:'Operate your instance',pages:[['/docs/operations/','Upgrades and recovery']]},
 {title:'Understand the concepts',pages:[['/docs/core-concepts/','Core concepts']]}
];
function navigation(path,label){
 return `<nav aria-label="${label}" class="docs-navigation">`+documentationGroups.map(group=>`<div class="docs-nav-group"><p class="docs-nav-heading">${escape(group.title)}</p><ul>`+group.pages.map(([url,title])=>`<li><a href="${url}"${url===path?' aria-current="page"':''}>${escape(title)}</a></li>`).join('')+'</ul></div>').join('')+'</nav>';
}
export function addDocumentationNavigation(html,page,pages){
 if(!page.path.startsWith('/docs/')) return html;
 const existing=new Set(pages.map(p=>p.path));
 for(const group of documentationGroups) for(const [url] of group.pages) if(!existing.has(url)) throw new Error('Missing documentation route: '+url);
 return html.replace(/<main\b([^>]*)>([\s\S]*?)<\/main>/,(_,attrs,body)=>{
  const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
  const headings=[];
  body=body.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/g,(_,hAttrs,text)=>{
   const title=text.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"');
   const existingId=hAttrs.match(/\bid="([^"]+)"/);
   let id=existingId?.[1];
   if(!id){
    const stem='section-'+title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    id=stem;let n=2;while(ids.has(id))id=stem+'-'+n++;
    ids.add(id);hAttrs+=' id="'+id+'"';
   }
   headings.push({id,title});return '<h2'+hAttrs+'>'+text+'</h2>';
  });
  // Replace the older hand-maintained tutorial TOC; its destination IDs remain intact.
  body=body.replace(/<nav class="tutorial-toc"[\s\S]*?<\/nav>/,'');
  const toc=page.path!=='/docs/' && headings.length>=3 ? '<details class="docs-page-toc"><summary>On this page</summary><nav aria-label="On this page"><ul>'+headings.map(h=>`<li><a href="#${h.id}">${escape(h.title)}</a></li>`).join('')+'</ul></nav></details>' : '';
  // Put the page TOC after the lead paragraph, keeping the answer before navigation.
  body=body.replace(/(<p class="reading-lead">[\s\S]*?<\/p>)/,'$1'+toc);
  attrs=attrs.replace(/class="([^"]*)"/,(_,classes)=>'class="'+classes.split(' ').filter(c=>c!=='container').join(' ')+' docs-article"');
  const mobile='<details class="docs-mobile-menu"><summary>Documentation menu</summary>'+navigation(page.path,'Documentation mobile')+'</details>';
  return '<div class="docs-layout container"><aside class="docs-sidebar">'+navigation(page.path,'Documentation')+'</aside><div class="docs-content">'+mobile+'<main'+attrs+'>'+body+'</main></div></div>';
 });
}
