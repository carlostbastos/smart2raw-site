// Abre TODAS as páginas geradas, nas duas línguas, num navegador de verdade:
// nenhum erro de console, nenhum recurso 404, hreflang presente, título e
// descrição preenchidos, e o formulário com a saída correta enquanto a chave
// não estiver configurada.
const { chromium } = require('playwright');
const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..','site');
const MIME={'.html':'text/html;charset=utf-8','.css':'text/css','.js':'text/javascript',
            '.wasm':'application/wasm','.svg':'image/svg+xml','.xml':'text/xml','.txt':'text/plain'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);
 if(p.endsWith('/'))p+='index.html'; const f=path.join(ROOT,p);
 if(!f.startsWith(ROOT)||!fs.existsSync(f)){r.writeHead(404);return r.end('404')}
 r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});
 fs.createReadStream(f).pipe(r)});
function pages(dir, base=''){
  let out=[];
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if(e.isDirectory() && e.name!=='assets') out=out.concat(pages(path.join(dir,e.name), base+'/'+e.name));
    else if(e.name==='index.html') out.push(base+'/');
  }
  return out.sort();
}
(async()=>{
  await new Promise(r=>srv.listen(8096,r));
  const b=await chromium.launch(); let bad=0;
  const list=pages(ROOT);
  for(const u of list){
    const pg=await b.newPage({viewport:{width:1280,height:900}});
    const errs=[];
    pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
    pg.on('pageerror',e=>errs.push('js: '+e.message));
    pg.on('response',r=>{if(r.status()>=400)errs.push(r.status()+' '+r.url())});
    await pg.goto('http://localhost:8096'+u,{waitUntil:'networkidle'});
    const m=await pg.evaluate(()=>({
      title:document.title, desc:(document.querySelector('meta[name=description]')||{}).content||'',
      alts:document.querySelectorAll('link[hreflang]').length,
      lang:document.documentElement.lang,
      h1:document.querySelectorAll('h1').length,
      nav:document.querySelectorAll('.nav a').length,
      form:!!document.getElementById('cform'),
      formMsg:(document.getElementById('cstat')||{}).textContent||'',
      formDisabled:(document.getElementById('csend')||{}).disabled
    }));
    const probs=[];
    if(!m.title||m.title.length<15) probs.push('título curto/ausente');
    if(!m.desc||m.desc.length<50) probs.push('description curta/ausente');
    if(m.alts<3) probs.push('hreflang incompleto');
    if(m.h1!==1) probs.push('h1='+m.h1);
    if(m.nav<8) probs.push('menu com '+m.nav);
    if(m.form && !m.formDisabled) probs.push('formulário ativo sem chave');
    if(errs.length) probs.push('console: '+errs.slice(0,2).join(' | '));
    console.log((probs.length?'FALHA ':'ok    ')+u.padEnd(22)+' lang='+m.lang.padEnd(5)
                +' nav='+String(m.nav).padEnd(3)+(m.form?' [form]':'')
                +(probs.length?'  << '+probs.join('; '):''));
    if(probs.length) bad++;
    await pg.close();
  }
  await b.close(); srv.close();
  console.log(bad?`\n${bad} PÁGINA(S) COM PROBLEMA`:`\n${list.length} páginas, todas OK`);
  process.exit(bad?1:0);
})();
