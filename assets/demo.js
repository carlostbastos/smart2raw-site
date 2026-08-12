/* Smart2Raw ao vivo / live — a biblioteca real em WebAssembly.
 * Smart2Raw - Copyright (C) 2026 Carlos Alberto Terêncio de Bastos
 * SPDX-License-Identifier: AGPL-3.0-or-later */
(function(){
"use strict";

/* ---------- índices do relatório: a MESMA ordem do enum em s2r_probe.c ------ */
var R = {N:0,SIGNED:1,CLS:2,ELEM_BITS:3,MIN:4,MAX:5,SUM:6,DISTINCT:7,RUNS:8,
  RAW:9,FLAT:10,AFFINE:11,AF_BASE:12,AF_STRIDE:13,CONST:14,
  BLOCKED:15,BLOCK:16,NBLOCKS:17,NCONST:18,HAS_STRIDE:19,
  BEST:20,BEST_BYTES:21,IDX_OK:22,IDX_BYTES:23,SORTED:24,SUMMARY_OK:25,
  DICT:26,DICT_K:27,RLE:28,RLE_RUNS:29,BITMAP:30,BITMAP_OK:31,
  FILE_BYTES:32,FILE_FMT:33,ROUNDTRIP:34,CRC_OK:35,
  NEVER_EXPANDS:36,VERIFIED:37,ERR:38,NPLAN:39,PLAN_BLK:40,PLAN_BYTES:52};

/* ---------- textos ---------------------------------------------------------- */
var STR = {
pt:{
  d_title:"Smart2Raw ao vivo",
  d_sub:"A biblioteca inteira compilada para WebAssembly e rodando no seu navegador. Todo número abaixo vem de uma chamada ao smart2raw.h, e todo número que pode ser conferido contra um laço ingênuo é conferido antes de ser mostrado.",
  d_local:"✓ nenhum dado sai do seu navegador",
  d_s1:"1 · a coluna", d_s2:"2 · o veredito", d_s3:"3 · o mesmo dado em cada formato",
  d_s4:"4 · a consulta, cronometrada aqui", d_s5:"5 · o tamanho de bloco é classificado, não chutado",
  d_s6:"6 · o arquivo",
  p_pick:"— exemplos prontos —", p_telemetry:"telemetria, 0..200",
  p_ts:"timestamps a cada 60 s", p_money:"dinheiro em centavos, passo 25",
  p_cat:"12 valores distintos em 500..11500", p_ids:"ids em 0..1.000.000",
  p_bool:"booleano 0/1", p_rand:"u64 aleatório (entropia máxima)",
  p_hash:"hashes de 64 bits (acima de 2^63)", p_const:"coluna constante",
  p_sensor:"sensor com sinal, −500..500",
  d_elements:"elementos", d_generate:"gerar",
  d_drop:"arraste um .csv ou .txt aqui — ou clique para escolher",
  d_column:"coluna:", d_paste:"ou cole os valores (um por linha, ou separados por vírgula):",
  d_classify:"classificar",
  k_cls_l:"classe escolhida", k_ratio_l:"contra a linha de base int64",
  k_form_l:"forma recomendada", k_dist_l:"valores distintos",
  k_idx_l:"consulta por faixa, pelo índice cumulativo — duas leituras que não crescem com o dado",
  k_idx_na:"classe larga demais para o índice cumulativo",
  d_cross_t:"A mesma coluna, em dois tamanhos",
  d_cross_note:"É a tese do projeto acontecendo na sua máquina. Numa coluna que cabe no cache do processador, ninguém está limitado por memória: ler 8× menos bytes não compra tempo nenhum, e o caminho compacto até perde para o laço direto. Quando o int64 deixa de caber, o gargalo passa a ser a memória — e aí ler menos é ir mais rápido. Espaço vira tempo no ponto em que o dado não cabe mais, não antes.",
  d_cross_tile:"a sua coluna repetida até %s elementos — os mesmos valores, na mesma proporção",
  cross_measuring:"medindo a mesma coluna em 4 milhões de elementos…",
  cross_l:"%s elementos",
  th_repr:"representação", th_bytes:"bytes", th_vs:"× int64", th_what:"o que é",
  th_path:"caminho", th_result:"resultado", th_ms:"ms / consulta", th_gain:"ganho",
  th_block:"bloco", th_predicted:"bytes previstos", th_vsbest:"× melhor",
  d_countgt:"contar valores >", d_inrange:"e na faixa", d_measure:"medir",
  d_download:"baixar .s2r",
  d_sizes_note:"O Smart2Raw classifica por amplitude, e a classe mais larga é o int64 de entrada — por isso ele não tem regime onde expande. Cada linha vermelha acima é um formato que ficou maior que a entrada.",
  d_bench_note:"Qual representação é a menor e qual responde mais rápido são perguntas diferentes, então todas as disponíveis são medidas. Em coluna pequena, que cabe no cache do processador, o ganho de espaço não vira ganho de tempo — aumente o número de elementos e a diferença aparece.",
  d_plan_note:"s2r_blocked_plan() precifica todos os candidatos a partir de uma única passagem sobre o dado, com uma fusão em árvore dos gcds que é exata por construção. A linha marcada é a que s2r_blocked_choose_block() escolheu.",
  d_file_note:"Esses bytes foram escritos pelo s2r_blocked_save() de verdade: a página só trocou o disco por um bloco de memória. O arquivo foi reaberto com s2r_blocked_load(), o CRC conferido e cada valor comparado com o original antes de este botão aparecer.",
  form:["pool plano","afim (base + passo)","em blocos"],
  row_int64:"int64 (linha de base)", row_flat:"Smart2Raw · pool plano",
  row_affine:"Smart2Raw · afim", row_blocked:"Smart2Raw · em blocos",
  row_dict:"dicionário + bit-packing", row_rle:"RLE", row_bitmap:"bitmap",
  why_int64:"o que a coluna ocupa sem nenhum tratamento",
  why_flat:"todo elemento na menor classe nativa que cabe",
  why_affine_s:function(s){return "passo "+s+" fatorado; índices na menor classe";},
  why_affine_n:"sem passo comum: idêntico ao pool plano",
  why_blocked:"cada bloco relativo ao próprio mínimo, com metadados que respondem sem ler payload",
  why_dict:function(k){return "piso teórico: "+k+" distintos × 8 B + códigos";},
  why_rle:function(r){return r+" corridas × 8 B";},
  why_bmp_y:"só existe porque há exatamente 2 valores distintos",
  why_bmp_n:function(k){return "não se aplica: "+k+" valores distintos";},
  b_ver_ok:"✓ cada valor conferido contra o original",
  b_ver_no:"✗ divergência contra o original",
  b_exp_ok:"✓ não excedeu a linha de base int64",
  b_exp_no:"✗ excedeu a linha de base",
  b_rt_ok:"✓ .s2r salvo, relido e conferido", b_rt_no:"arquivo não gerado",
  b_sort_y:"coluna ordenada — busca binária habilitada", b_sort_n:"coluna não ordenada",
  v_range:function(a,b,c,n){return "A amplitude real é <code>"+a+" … "+b+"</code>, e a menor classe nativa que a contém é <code>"+c+"</code> — "+n+" bits por elemento. ";},
  v_const:"A coluna é <b>constante</b>: a forma afim não guarda payload nenhum. ",
  v_stride:function(s,b){return "Existe um passo comum de <code>"+s+"</code>: todo valor é <code>"+b+" + "+s+"·i</code>, e dividir esse passo é exato por construção — não é dicionário, é uma função afim. ";},
  v_fmt3:"Na forma em blocos, pelo menos um bloco tem passo próprio (arquivo <code>fmt = 3</code>). ",
  v_index:function(b){return "A classe é estreita o bastante para o índice cumulativo: "+b+" que respondem <i>qualquer</i> faixa em duas leituras. ";},
  v_block:function(b,n,c){return "Bloco escolhido: <code>"+b+"</code> elementos ("+n+" blocos, "+c+" sem payload).";},
  p_naive:"varredura ingênua sobre int64", p_flat:"Smart2Raw · pool plano",
  p_aff:"Smart2Raw · afim", p_blk:"Smart2Raw · em blocos",
  r_naive:"faixa · varredura ingênua", r_flat:"faixa · Smart2Raw pool plano",
  r_index:"faixa · índice cumulativo",
  bn_ok:"✓ todos os caminhos deram o mesmo resultado.",
  bn_no:"✗ caminhos divergiram — isso é um defeito, não uma medida.",
  bn_meas:" Medido neste navegador, agora, com aquecimento e argumento variando a cada repetição.",
  bn_idx:function(b){return " O índice cumulativo responde qualquer faixa em duas leituras de "+b+" que não crescem com o dado, e recusa a resposta se o pool mudou desde que ele foi construído.";},
  st_pick:"escolha um exemplo", st_ready:function(n){return n+" valores prontos";},
  st_reading:function(f){return "lendo "+f+"…";}, st_loaded:function(f){return f+" carregado";},
  st_class:"classificando…", st_none:"nenhum número encontrado",
  st_oom:function(n){return "memória insuficiente para "+n+" elementos";},
  st_done:function(n,ms){return n+" elementos · análise completa em "+ms+" ms";},
  st_badv:"valor inválido", st_measuring:"medindo…",
  f_info:function(b,f){return b+" · fmt = "+f+(f===3?" (blocos com passo)":" (blocos)")+" · CRC confere";},
  f_fail:"falha ao carregar o wasm: "
},
en:{
  d_title:"Smart2Raw live",
  d_sub:"The whole library compiled to WebAssembly, running in your browser. Every number below comes from a call into smart2raw.h, and every number that can be checked against a naive loop is checked before it is shown.",
  d_local:"✓ no data leaves your browser",
  d_s1:"1 · the column", d_s2:"2 · the verdict", d_s3:"3 · the same data in every format",
  d_s4:"4 · the query, timed right here", d_s5:"5 · block size is classified, not guessed",
  d_s6:"6 · the file",
  p_pick:"— ready-made examples —", p_telemetry:"telemetry, 0..200",
  p_ts:"timestamps every 60 s", p_money:"money in cents, step 25",
  p_cat:"12 distinct values in 500..11500", p_ids:"ids in 0..1,000,000",
  p_bool:"boolean 0/1", p_rand:"random u64 (maximum entropy)",
  p_hash:"64-bit hashes (above 2^63)", p_const:"constant column",
  p_sensor:"signed sensor, −500..500",
  d_elements:"elements", d_generate:"generate",
  d_drop:"drop a .csv or .txt here — or click to choose",
  d_column:"column:", d_paste:"or paste the values (one per line, or comma separated):",
  d_classify:"classify",
  k_cls_l:"class chosen", k_ratio_l:"against the int64 baseline",
  k_form_l:"recommended form", k_dist_l:"distinct values",
  k_idx_l:"range query through the cumulative index — two reads that do not grow with the data",
  k_idx_na:"class too wide for the cumulative index",
  d_cross_t:"The same column, at two sizes",
  d_cross_note:"This is the project's thesis happening on your machine. On a column that fits in the processor cache nobody is memory-bound: reading 8× fewer bytes buys no time at all, and the compact path even loses to the direct loop. Once the int64 form stops fitting, memory becomes the bottleneck — and then reading less is going faster. Space turns into time at the point where the data stops fitting, not before.",
  d_cross_tile:"your column repeated up to %s elements — the same values, in the same proportion",
  cross_measuring:"measuring the same column at 4 million elements…",
  cross_l:"%s elements",
  th_repr:"representation", th_bytes:"bytes", th_vs:"× int64", th_what:"what it is",
  th_path:"path", th_result:"result", th_ms:"ms / query", th_gain:"gain",
  th_block:"block", th_predicted:"predicted bytes", th_vsbest:"× best",
  d_countgt:"count values >", d_inrange:"and in range", d_measure:"measure",
  d_download:"download .s2r",
  d_sizes_note:"Smart2Raw classifies by RANGE, and the widest class IS the int64 input — which is why it has no regime where it expands. Every red row above is a format that ended up larger than the input.",
  d_bench_note:"Which representation is smallest and which one answers fastest are different questions, so every available path is measured. On a small column that fits in cache, the space win does not become a time win — raise the element count and the difference appears.",
  d_plan_note:"s2r_blocked_plan() prices every candidate from a SINGLE pass over the data, with a tree merge of the gcds that is exact by construction. The marked row is the one s2r_blocked_choose_block() picked.",
  d_file_note:"These bytes were written by the real s2r_blocked_save(): the page only swapped the disk for a block of memory. The file was reopened with s2r_blocked_load(), the CRC checked and every value compared against the original before this button appeared.",
  form:["flat pool","affine (base + stride)","block-wise"],
  row_int64:"int64 (baseline)", row_flat:"Smart2Raw · flat pool",
  row_affine:"Smart2Raw · affine", row_blocked:"Smart2Raw · block-wise",
  row_dict:"dictionary + bit-packing", row_rle:"RLE", row_bitmap:"bitmap",
  why_int64:"what the column takes with no treatment at all",
  why_flat:"every element in the smallest native class that fits",
  why_affine_s:function(s){return "stride "+s+" factored out; indices in the smallest class";},
  why_affine_n:"no common stride: identical to the flat pool",
  why_blocked:"each block relative to its own minimum, with metadata that answers without reading payload",
  why_dict:function(k){return "theoretical floor: "+k+" distinct × 8 B + codes";},
  why_rle:function(r){return r+" runs × 8 B";},
  why_bmp_y:"exists only because there are exactly 2 distinct values",
  why_bmp_n:function(k){return "not applicable: "+k+" distinct values";},
  b_ver_ok:"✓ every value checked against the original",
  b_ver_no:"✗ disagreement against the original",
  b_exp_ok:"✓ did not exceed the int64 baseline",
  b_exp_no:"✗ exceeded the baseline",
  b_rt_ok:"✓ .s2r saved, reloaded and checked", b_rt_no:"file not produced",
  b_sort_y:"column is ordered — binary search enabled", b_sort_n:"column is not ordered",
  v_range:function(a,b,c,n){return "The real range is <code>"+a+" … "+b+"</code>, and the smallest native class containing it is <code>"+c+"</code> — "+n+" bits per element. ";},
  v_const:"The column is <b>constant</b>: the affine form stores no payload at all. ",
  v_stride:function(s,b){return "There is a common stride of <code>"+s+"</code>: every value is <code>"+b+" + "+s+"·i</code>, and dividing that stride out is exact by construction — not a dictionary, an affine function. ";},
  v_fmt3:"In the block-wise form at least one block carries its own stride (file <code>fmt = 3</code>). ",
  v_index:function(b){return "The class is narrow enough for the cumulative index: "+b+" that answer <i>any</i> range in two reads. ";},
  v_block:function(b,n,c){return "Block chosen: <code>"+b+"</code> elements ("+n+" blocks, "+c+" with no payload).";},
  p_naive:"naive scan over int64", p_flat:"Smart2Raw · flat pool",
  p_aff:"Smart2Raw · affine", p_blk:"Smart2Raw · block-wise",
  r_naive:"range · naive scan", r_flat:"range · Smart2Raw flat pool",
  r_index:"range · cumulative index",
  bn_ok:"✓ every path returned the same result.",
  bn_no:"✗ paths disagreed — that is a defect, not a measurement.",
  bn_meas:" Measured in this browser, just now, with warm-up and the argument varying on every repetition.",
  bn_idx:function(b){return " The cumulative index answers any range in two reads of "+b+" that do not grow with the data, and refuses to answer if the pool changed since it was built.";},
  st_pick:"pick an example", st_ready:function(n){return n+" values ready";},
  st_reading:function(f){return "reading "+f+"…";}, st_loaded:function(f){return f+" loaded";},
  st_class:"classifying…", st_none:"no numbers found",
  st_oom:function(n){return "not enough memory for "+n+" elements";},
  st_done:function(n,ms){return n+" elements · full analysis in "+ms+" ms";},
  st_badv:"invalid value", st_measuring:"measuring…",
  f_info:function(b,f){return b+" · fmt = "+f+(f===3?" (blocks with stride)":" (blocks)")+" · CRC checks out";},
  f_fail:"failed to load the wasm: "
}};

var host = document.getElementById('s2rdemo');
if(!host) return;
var LANG = (document.documentElement.lang || 'en').slice(0,2) === 'pt' ? 'pt' : 'en';
var T = STR[LANG];
var LOC = LANG === 'pt' ? 'pt-BR' : 'en-US';
var X = null, rep = null, M64 = (1n<<64n)-1n, NA = 0xFFFFFFFF;

function el(id){ return document.getElementById(id); }
function num(x){ return Number(x).toLocaleString(LOC); }
function bytes(b){
  b = Number(b);
  if(b < 1024) return b + " B";
  if(b < 1048576) return (b/1024).toFixed(1) + " KB";
  if(b < 1073741824) return (b/1048576).toFixed(2) + " MB";
  return (b/1073741824).toFixed(2) + " GB";
}
function g(i){ return new DataView(X.memory.buffer).getBigUint64(rep + i*8, true); }
function gn(i){ return Number(g(i)); }

/* preenche todo texto estático marcado com data-t */
Array.prototype.forEach.call(host.querySelectorAll('[data-t]'), function(n){
  var v = T[n.getAttribute('data-t')];
  if(typeof v === 'string') n.textContent = v;
});

/* ---------- carga do módulo ------------------------------------------------- */
fetch(host.getAttribute('data-wasm'))
  .then(function(r){ return r.arrayBuffer(); })
  .then(function(b){ return WebAssembly.instantiate(b, {}); })
  .then(function(m){
    X = m.instance.exports;
    rep = X.s2r_probe_report();
    var p = X.s2r_probe_version(), u8 = new Uint8Array(X.memory.buffer), s = "", i = p;
    while(u8[i]) s += String.fromCharCode(u8[i++]);
    el('d_ver').textContent = "v" + s + " · wasm";
  })
  .catch(function(e){ el('status').textContent = T.f_fail + e; });

/* ---------- entrada --------------------------------------------------------- */
function parseNumbers(text, limit){
  var out = [], re = /-?\d+/g, m;
  while((m = re.exec(text)) !== null){
    try { out.push(BigInt(m[0])); } catch(e) {}
    if(out.length >= limit) break;
  }
  return out;
}
var csvRows = null;
function loadCSV(text){
  var rows = text.split(/\r?\n/).filter(function(l){ return l.trim().length; })
                 .map(function(l){ return l.split(/[,;\t|]/); });
  if(!rows.length) return;
  var ncol = Math.max.apply(null, rows.slice(0,50).map(function(r){ return r.length; }));
  if(ncol <= 1){ el('src').value = text; el('colrow').classList.add('hidden'); csvRows = null; return; }
  csvRows = rows;
  var headerText = rows[0].some(function(c){ return c.trim().length && !/^-?\d+$/.test(c.trim()); });
  var sel = el('colsel'); sel.innerHTML = "";
  for(var c = 0; c < ncol; c++){
    var o = document.createElement('option');
    o.value = c;
    o.textContent = (headerText && rows[0][c]) ? rows[0][c].trim() : (T.d_column + " " + (c+1));
    sel.appendChild(o);
  }
  el('colrow').classList.remove('hidden');
  pickColumn();
  sel.onchange = pickColumn;
}
function pickColumn(){
  if(!csvRows) return;
  var c = +el('colsel').value;
  var start = /^-?\d+$/.test((csvRows[0][c]||"").trim()) ? 0 : 1, vals = [];
  for(var i = start; i < csvRows.length; i++){
    var t = (csvRows[i][c]||"").trim();
    if(/^-?\d+$/.test(t)) vals.push(t);
  }
  el('src').value = vals.join("\n");
}

function rng(){
  var s = 0x9E3779B97F4A7C15n;
  return function(){ s ^= (s<<13n)&M64; s ^= s>>7n; s ^= (s<<17n)&M64; return s; };
}
var presets = {
  telemetry:function(n,r){var a=new Array(n);for(var i=0;i<n;i++)a[i]=r()%201n;return [a,0];},
  ts:function(n){var a=new Array(n);for(var i=0;i<n;i++)a[i]=1700000000n+BigInt(i)*60n;return [a,0];},
  money:function(n,r){var a=new Array(n);for(var i=0;i<n;i++)a[i]=1000n+(r()%400n)*25n;return [a,0];},
  cat:function(n,r){var a=new Array(n);for(var i=0;i<n;i++)a[i]=500n+(r()%12n)*1000n;return [a,0];},
  ids:function(n,r){var a=new Array(n);for(var i=0;i<n;i++)a[i]=r()%1000000n;return [a,0];},
  bool:function(n,r){var a=new Array(n);for(var i=0;i<n;i++)a[i]=r()&1n;return [a,0];},
  rand:function(n,r){var a=new Array(n);for(var i=0;i<n;i++)a[i]=r();return [a,0];},
  hash:function(n,r){var a=new Array(n);for(var i=0;i<n;i++)a[i]=r()|0x8000000000000000n;return [a,0];},
  "const":function(n){var a=new Array(n);a.fill(777n);return [a,0];},
  sensor:function(n,r){var a=new Array(n);for(var i=0;i<n;i++)a[i]=(r()%1001n)-500n;return [a,1];}
};
var pending = null;
el('gen').onclick = function(){
  var k = el('preset').value;
  if(!k){ el('status').textContent = T.st_pick; return; }
  var n = Math.max(1, Math.min(4000000, +el('npreset').value || 1));
  var pair = presets[k](n, rng());
  pending = {a: pair[0], sg: pair[1]};
  csvRows = null; el('colrow').classList.add('hidden');
  el('src').value = pair[0].slice(0,200).join("\n") + (n > 200 ? "\n… (" + num(n) + ")" : "");
  el('status').textContent = T.st_ready(num(n));
};
el('src').addEventListener('input', function(){ pending = null; });

var drop = el('drop'), fi = el('file');
drop.onclick = function(){ fi.click(); };
drop.ondragover = function(e){ e.preventDefault(); drop.classList.add('hot'); };
drop.ondragleave = function(){ drop.classList.remove('hot'); };
drop.ondrop = function(e){ e.preventDefault(); drop.classList.remove('hot');
  if(e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]); };
fi.onchange = function(){ if(fi.files[0]) readFile(fi.files[0]); };
function readFile(f){
  el('status').textContent = T.st_reading(f.name);
  var rd = new FileReader();
  rd.onload = function(){ pending = null; loadCSV(rd.result); el('status').textContent = T.st_loaded(f.name); };
  rd.readAsText(f);
}

/* ---------- a análise -------------------------------------------------------- */
el('run').onclick = function(){
  if(!X){ el('status').textContent = T.st_class; return; }
  el('status').textContent = T.st_class;
  setTimeout(analyze, 20);
};
var lastVals = null, lastSigned = 0;   /* a coluna atual, para a travessia */
function loadInto(vals, signed){
  var n = vals.length, ptr = X.s2r_probe_input(n);
  if(!ptr) return 0;
  var dv = new DataView(X.memory.buffer);
  for(var i = 0; i < n; i++) dv.setBigUint64(ptr + i*8, vals[i] & M64, true);
  X.s2r_probe_run(n, signed);
  return n;
}
function analyze(){
  var vals, signed;
  if(pending){ vals = pending.a; signed = pending.sg; }
  else {
    vals = parseNumbers(el('src').value, 4000000);
    signed = vals.some(function(v){ return v < 0n; }) ? 1 : 0;
  }
  if(!vals.length){ el('status').textContent = T.st_none; return; }
  var n = vals.length, ptr = X.s2r_probe_input(n);
  if(!ptr){ el('status').textContent = T.st_oom(num(n)); return; }
  var dv = new DataView(X.memory.buffer);
  for(var i = 0; i < n; i++) dv.setBigUint64(ptr + i*8, vals[i] & M64, true);
  var t0 = performance.now();
  X.s2r_probe_run(n, signed);
  var t1 = performance.now();
  lastVals = vals; lastSigned = signed;
  resetMedicao();
  render();
  el('status').textContent = T.st_done(num(n), (t1-t0).toFixed(0));
  el('out').classList.remove('hidden');
  /* Os dois eixos sao a mesma ideia, entao aparecem juntos: quem classificou ja
     ve o tempo, sem precisar pedir. Custa fracao de segundo no tamanho padrao. */
  setTimeout(medir, 30);
}
function clsName(){
  var c = Number(BigInt.asIntN(64, g(R.CLS)));
  return (c < 0 ? "int" : "uint") + Math.abs(c);
}
function render(){
  var raw = gn(R.RAW), best = gn(R.BEST_BYTES), sg = gn(R.SIGNED);
  el('k_cls').textContent   = clsName();
  el('k_ratio').textContent = (raw/best).toFixed(2) + "×";
  el('k_form').textContent  = T.form[gn(R.BEST)];
  el('k_dist').textContent  = num(gn(R.DISTINCT));

  var mn = sg ? BigInt.asIntN(64, g(R.MIN)) : g(R.MIN);
  var mx = sg ? BigInt.asIntN(64, g(R.MAX)) : g(R.MAX);
  var v = T.v_range(mn, mx, clsName(), gn(R.ELEM_BITS));
  if(gn(R.CONST)) v += T.v_const;
  else if(gn(R.AF_STRIDE) > 1) v += T.v_stride(g(R.AF_STRIDE), BigInt.asIntN(64, g(R.AF_BASE)));
  if(gn(R.HAS_STRIDE)) v += T.v_fmt3;
  if(gn(R.IDX_OK))     v += T.v_index(bytes(gn(R.IDX_BYTES)));
  v += T.v_block(num(gn(R.BLOCK)), num(gn(R.NBLOCKS)), num(gn(R.NCONST)));
  el('verdict').innerHTML = v;

  var bv = el('b_verified');
  bv.className = "badge " + (gn(R.VERIFIED) ? "g" : "r");
  bv.textContent = gn(R.VERIFIED) ? T.b_ver_ok : T.b_ver_no;
  var be = el('b_expand');
  be.className = "badge " + (gn(R.NEVER_EXPANDS) ? "g" : "r");
  be.textContent = gn(R.NEVER_EXPANDS) ? T.b_exp_ok : T.b_exp_no;
  var br = el('b_round');
  br.className = "badge " + (gn(R.ROUNDTRIP) ? "g" : "");
  br.textContent = gn(R.ROUNDTRIP) ? T.b_rt_ok : T.b_rt_no;
  el('b_sorted').className = "badge";
  el('b_sorted').textContent = gn(R.SORTED) ? T.b_sort_y : T.b_sort_n;

  var rows = [
    [T.row_int64,   raw,             -1, T.why_int64],
    [T.row_flat,    gn(R.FLAT),       0, T.why_flat],
    [T.row_affine,  gn(R.AFFINE),     1, gn(R.AF_STRIDE) > 1 ? T.why_affine_s(g(R.AF_STRIDE)) : T.why_affine_n],
    [T.row_blocked, gn(R.BLOCKED),    2, T.why_blocked],
    [T.row_dict,    gn(R.DICT),      -1, T.why_dict(num(gn(R.DICT_K)))],
    [T.row_rle,     gn(R.RLE),       -1, T.why_rle(num(gn(R.RLE_RUNS)))]
  ];
  rows.push(gn(R.BITMAP_OK)
    ? [T.row_bitmap, gn(R.BITMAP), -1, T.why_bmp_y]
    : [T.row_bitmap, 0,            -1, T.why_bmp_n(num(gn(R.DISTINCT)))]);

  var maxv = Math.max.apply(null, rows.map(function(r){ return r[1]; }));
  var tb = el('t_sizes').tBodies[0]; tb.innerHTML = "";
  rows.forEach(function(r){
    var name = r[0], b = r[1], mine = r[2], why = r[3];
    var tr = document.createElement('tr');
    if(mine >= 0 && mine === gn(R.BEST)) tr.className = "best";
    var over = b > raw;
    tr.innerHTML = "<td>" + name + "</td>"
      + "<td class='r'>" + (b ? bytes(b) : "—") + "</td>"
      + "<td class='r" + (over ? " bad" : "") + "'>" + (b ? (b/raw).toFixed(2) + "×" : "—") + "</td>"
      + "<td><span class='bar" + (over ? " over" : mine < 0 ? " peer" : "") + "' style='width:"
      + (b ? Math.max(2, 100*b/maxv) : 0) + "%'></span></td>"
      + "<td class='dim'>" + why + "</td>";
    tb.appendChild(tr);
  });

  var np = gn(R.NPLAN), bestPlan = Infinity, i;
  for(i = 0; i < np; i++) bestPlan = Math.min(bestPlan, gn(R.PLAN_BYTES+i));
  var pb = el('t_plan').tBodies[0]; pb.innerHTML = "";
  for(i = 0; i < np; i++){
    var blk = gn(R.PLAN_BLK+i), by = gn(R.PLAN_BYTES+i);
    var tr2 = document.createElement('tr');
    if(blk === gn(R.BLOCK)) tr2.className = "best";
    tr2.innerHTML = "<td>" + num(blk) + "</td><td class='r'>" + bytes(by) + "</td>"
      + "<td class='r'>" + (by/bestPlan).toFixed(3) + "×</td>"
      + "<td><span class='bar' style='width:" + Math.max(2, 100*bestPlan/by) + "%'></span></td>";
    pb.appendChild(tr2);
  }

  el('fileinfo').textContent = gn(R.FILE_BYTES)
    ? T.f_info(bytes(gn(R.FILE_BYTES)), gn(R.FILE_FMT)) : "—";
  el('dl').disabled = !gn(R.FILE_BYTES);

  var lo0 = sg ? BigInt.asIntN(64, g(R.MIN)) : g(R.MIN);
  var hi0 = sg ? BigInt.asIntN(64, g(R.MAX)) : g(R.MAX);
  var half = lo0/2n + hi0/2n, quarter = (hi0 - lo0)/4n;
  el('thr').value = half.toString();
  el('lo').value  = (half - quarter).toString();
  el('hi').value  = (half + quarter).toString();
}
/* O reset vive aqui, e nao no fim de render(): render() e chamado de novo quando
   a travessia devolve a coluna original, e ali ele apagaria a medicao que acabou
   de ser feita. Coluna nova comeca em analyze(), e e la que se limpa. */
function resetMedicao(){
  el('t_bench').classList.add('hidden');
  el('benchnote').textContent = "";
  if(el('cross'))   el('cross').classList.add('hidden');
  if(el('k_idx'))   el('k_idx').textContent = "—";
  if(el('kpi_idx')) el('kpi_idx').classList.remove('off');
}

/* ---------- a consulta cronometrada ----------------------------------------- */
function medir(){
  var t, lo, hi;
  try { t = BigInt(el('thr').value.trim()); lo = BigInt(el('lo').value.trim());
        hi = BigInt(el('hi').value.trim()); }
  catch(e){ el('bstat').textContent = T.st_badv; return; }
  el('bstat').textContent = T.st_measuring;
  setTimeout(function(){ runBench(t, lo, hi); }, 20);
}
el('bench').onclick = medir;

/* ---------- a travessia: a mesma coluna, grande o bastante para sair do cache -
 *
 * O ganho de espaco so vira ganho de tempo quando a forma int64 deixa de caber
 * no cache. Em 200 mil elementos ela cabe, e o caminho compacto PERDE - o que e
 * verdade e estava escondido num rodape cinza. Medir os dois tamanhos lado a
 * lado transforma o constrangimento na propria demonstracao.
 *
 * A coluna maior e a do visitante repetida: mesma amplitude, mesma distribuicao,
 * mesma classe. Nada e inventado, e a legenda diz exatamente isso.            */
var ALVO = 4000000;
function runCrossover(thr, msPequeno, msBase){
  if(!el('cross')) return;               /* molde sem o bloco: nada a fazer */
  if(!lastVals || lastVals.length >= ALVO/2) return;
  /* Duas guardas, e as duas existem porque a travessia pode MENTIR.
   *
   * 1. So faz sentido numa coluna que de fato encolhe. Numa coluna u64 de
   *    entropia maxima nao ha menos bytes para ler, entao nao ha o que a
   *    largura de banda possa comprar - e mostrar dois numeros abaixo de 1,00x
   *    sugeriria um fracasso onde na verdade nao ha aposta.
   *
   * 2. So aparece quando o caminho compacto PERDEU neste tamanho. Se ele ja
   *    ganhou, nao ha nada a explicar; e numa coluna ordenada a repeticao
   *    destroi a ordem, entao o numero grande sairia pior que o pequeno por
   *    causa da construcao, nao do hardware. Uma demonstracao que precisa de
   *    nota de rodape para nao enganar nao deveria estar na tela. */
  if(gn(R.RAW) / gn(R.BEST_BYTES) < 1.05) return;
  if(!msPequeno || msBase / msPequeno >= 1.0) return;
  var n0 = lastVals.length, reps = Math.ceil(ALVO / n0), grande = new Array(n0*reps);
  for(var r = 0, k = 0; r < reps; r++)
    for(var i = 0; i < n0; i++) grande[k++] = lastVals[i];
  el('bstat').textContent = T.cross_measuring;
  setTimeout(function(){
    var ok = loadInto(grande, lastSigned);
    if(ok){
      var cBase = X.s2r_probe_count_gt_naive(thr) >>> 0;
      var cFlat = X.s2r_probe_count_gt_flat(thr) >>> 0;
      if(cBase !== NA && cFlat !== NA){
        var b = timeIt(function(d){ return X.s2r_probe_count_gt_naive(thr + BigInt(d)); });
        var f = timeIt(function(d){ return X.s2r_probe_count_gt_flat(thr + BigInt(d)); });
        el('cross_a_l').textContent = T.cross_l.replace('%s', num(n0));
        el('cross_b_l').textContent = T.cross_l.replace('%s', num(grande.length));
        pinta(el('cross_a_v'), msBase / msPequeno);
        pinta(el('cross_b_v'), b / f);
        el('cross_note').textContent =
          T.d_cross_tile.replace('%s', num(grande.length)) + " · " + T.d_cross_note;
        el('cross').classList.remove('hidden');
      }
    }
    loadInto(lastVals, lastSigned);   /* devolve a coluna original ao modulo */
    el('bstat').textContent = "";
  }, 30);
}
function pinta(node, gain){
  node.textContent = gain.toFixed(2) + "×";
  node.className = "crossv " + (gain >= 1.05 ? "ok" : gain <= 0.95 ? "warn" : "");
}
function timeIt(fn){
  var i;
  for(i = 0; i < 3; i++) fn(0);
  var reps = 1, dt = 0, sink = 0;
  while(dt < 25 && reps < 4e6){
    reps *= 2;
    var t0 = performance.now();
    for(i = 0; i < reps; i++) sink += fn(i & 7);
    dt = performance.now() - t0;
  }
  if(sink === -1) console.log(sink);
  return dt / reps;
}
function runBench(thr, lo, hi){
  var tb = el('t_bench').tBodies[0]; tb.innerHTML = "";
  function mk(name, c, ms, base){
    var gain = base ? (base/ms) : 1;
    var tr = document.createElement('tr');
    tr.innerHTML = "<td>" + name + "</td><td class='r'>" + num(c) + "</td>"
      + "<td class='r'>" + ms.toFixed(ms < 0.01 ? 5 : 3) + "</td>"
      + "<td class='r " + (gain >= 1.05 ? "ok" : gain <= 0.95 ? "warn" : "") + "'>"
      + gain.toFixed(2) + "×</td>";
    tb.appendChild(tr);
  }
  var paths = [[T.p_naive, X.s2r_probe_count_gt_naive],
               [T.p_flat,  X.s2r_probe_count_gt_flat],
               [T.p_aff,   X.s2r_probe_count_gt_affine],
               [T.p_blk,   X.s2r_probe_count_gt_blocked]];
  var baseMs = 0, ref = null, agree = true, flatMs = 0;
  paths.forEach(function(p){
    var c = p[1](thr) >>> 0;
    if(c === NA) return;
    var ms = timeIt(function(d){ return p[1](thr + BigInt(d)); });
    if(ref === null){ ref = c; baseMs = ms; } else if(c !== ref) agree = false;
    if(p[0] === T.p_flat) flatMs = ms;
    mk(p[0], c, ms, baseMs);
  });
  var rp = [[T.r_naive, X.s2r_probe_count_range_naive],
            [T.r_flat,  X.s2r_probe_count_range_flat],
            [T.r_index, X.s2r_probe_count_range_index]];
  var rbase = 0, rref = null, ragree = true, hasIdx = false, idxGain = 0;
  rp.forEach(function(p){
    var c = p[1](lo, hi) >>> 0;
    if(c === NA) return;
    if(p[0] === T.r_index) hasIdx = true;
    var ms = timeIt(function(d){ return p[1](lo, hi + BigInt(d)); });
    if(rref === null){ rref = c; rbase = ms; } else if(c !== rref) ragree = false;
    if(p[0] === T.r_index && rbase) idxGain = rbase / ms;
    mk(p[0], c, ms, rbase);
  });
  el('t_bench').classList.remove('hidden');
  el('bstat').textContent = "";
  /* o melhor numero que o projeto produz sai da ultima linha e vira KPI */
  var kb = el('kpi_idx'), kv = el('k_idx');
  if(!kb || !kv){ /* molde antigo: sem KPI, o resto segue */ }
  else if(hasIdx && idxGain > 1){
    /* Sem separador de milhar de proposito. O KPI ao lado diz "8.00x", onde o
       ponto e decimal; escrever "3.513x" na mesma fila faria o mesmo simbolo
       significar duas coisas a um palmo de distancia. Numero grande vai inteiro
       e cru: 3513x nao tem como ser lido errado. */
    kv.textContent = (idxGain >= 100 ? String(Math.round(idxGain))
                                     : idxGain.toFixed(1)) + "×";
    kb.classList.remove('off');
  } else {
    kv.textContent = "—";
    kb.classList.add('off');
    var sm = kb.querySelector('small');
    if(sm) sm.textContent = T.k_idx_na;
  }
  var note = (agree && ragree)
    ? "<span class='ok'>" + T.bn_ok + "</span>" : "<span class='bad'>" + T.bn_no + "</span>";
  note += T.bn_meas;
  if(hasIdx) note += T.bn_idx(bytes(gn(R.IDX_BYTES)));
  el('benchnote').innerHTML = note;
  runCrossover(thr, flatMs, baseMs);
}

el('dl').onclick = function(){
  var p = X.s2r_probe_file(), n = X.s2r_probe_file_len() >>> 0;
  if(!p || !n) return;
  var copy = new Uint8Array(X.memory.buffer.slice(p, p + n));
  var url = URL.createObjectURL(new Blob([copy], {type:"application/octet-stream"}));
  var a = document.createElement('a');
  a.href = url; a.download = "column.s2r"; a.click();
  setTimeout(function(){ URL.revokeObjectURL(url); }, 4000);
};
})();
