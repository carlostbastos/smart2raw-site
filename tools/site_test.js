// Verificação do site num navegador de verdade: as duas línguas, a demonstração
// ponta a ponta, o download do .s2r e o console limpo.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');

const ROOT = path.join(__dirname, '..', 'site');
const MIME = {'.html':'text/html;charset=utf-8','.css':'text/css','.js':'text/javascript',
              '.wasm':'application/wasm','.svg':'image/svg+xml','.xml':'text/xml','.txt':'text/plain'};
const srv = http.createServer((req,res)=>{
  let p = decodeURIComponent(req.url.split('?')[0]);
  if(p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if(!f.startsWith(ROOT) || !fs.existsSync(f)){ res.writeHead(404); return res.end('404'); }
  res.writeHead(200, {'content-type': MIME[path.extname(f)] || 'application/octet-stream'});
  fs.createReadStream(f).pipe(res);
});

(async () => {
  await new Promise(r => srv.listen(8099, r));
  const b = await chromium.launch();
  let bad = 0;
  for (const [lang, url, expectNav] of [['EN','http://localhost:8099/','Get started'],
                                        ['PT','http://localhost:8099/pt/','Comece']]) {
    const pg = await b.newPage({viewport:{width:1240,height:1000}});
    const errs = [];
    pg.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
    pg.on('pageerror', e => errs.push('pageerror: '+e.message));
    pg.on('requestfailed', r => errs.push('404? '+r.url()));
    await pg.goto(url);
    await pg.waitForFunction(() => document.getElementById('d_ver').textContent.startsWith('v3'), {timeout:15000});

    const html = await pg.evaluate(() => document.documentElement.lang);
    const nav  = await pg.evaluate(() => [...document.querySelectorAll('.nav a')].map(a=>a.textContent).join(','));
    const alt  = await pg.evaluate(() => [...document.querySelectorAll('link[hreflang]')].map(l=>l.hreflang+'='+l.href).join(' '));

    for (const [preset, n] of [['ts','300000'], ['telemetry','300000'], ['sensor','150000']]) {
      await pg.selectOption('#preset', preset);
      await pg.fill('#npreset', n);
      await pg.click('#gen');
      await pg.click('#run');
      await pg.waitForFunction(() => /elements|elementos/.test(document.getElementById('status').textContent), {timeout:60000});
      await pg.click('#bench');
      await pg.waitForFunction(() => document.getElementById('benchnote').textContent.length>0, {timeout:30000});
      const r = await pg.evaluate(() => ({
        cls: document.getElementById('k_cls').textContent,
        ratio: document.getElementById('k_ratio').textContent,
        ver: document.getElementById('b_verified').textContent,
        exp: document.getElementById('b_expand').textContent,
        note: document.getElementById('benchnote').textContent.slice(0,30),
        rows: document.querySelectorAll('#t_bench tbody tr').length,
        file: document.getElementById('fileinfo').textContent,
        untranslated: [...document.querySelectorAll('[data-t]')].filter(e=>!e.textContent.trim()).length
      }));
      const ok = r.ver.startsWith('✓') && r.exp.startsWith('✓') && r.note.startsWith('✓') && r.untranslated===0;
      if(!ok) bad++;
      console.log(`${ok?'ok   ':'FALHA'} ${lang} ${preset.padEnd(10)} ${r.cls.padEnd(7)} ${r.ratio.padEnd(9)} caminhos:${r.rows} | ${r.file}`);
      if(!ok) console.log('        ', JSON.stringify(r));
    }
    const [dl] = await Promise.all([pg.waitForEvent('download'), pg.click('#dl')]);
    const dst = `/tmp/site/out_${lang}.s2r`;
    await dl.saveAs(dst);
    const buf = fs.readFileSync(dst);
    console.log(`      ${lang} html lang=${html} · nav=[${nav}] · download ${dl.suggestedFilename()} ${buf.length}B magic=${buf.readUInt32LE(0).toString(16)}`);
    if(!nav.includes(expectNav)) { console.log('      FALHA: menu sem "'+expectNav+'"'); bad++; }
    if(!alt.includes('en=') || !alt.includes('pt-BR=')) { console.log('      FALHA: hreflang'); bad++; }
    if(errs.length){ console.log('      ERROS:', errs.slice(0,4).join(' | ')); bad++; }
    else console.log('      console limpo');
    await pg.screenshot({path:`/tmp/site/shot_${lang}.png`, fullPage:false});
    await pg.close();
  }
  await b.close(); srv.close();
  console.log(bad ? `\n${bad} PROBLEMA(S)` : '\nTUDO OK');
  process.exit(bad?1:0);
})();
