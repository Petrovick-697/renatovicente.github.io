'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),K=require('../assets/vendor/katex/katex.min.js'),M=require('../assets/latex.js'),F=require('../assets/explorer-math.js');
test('todas as fórmulas TeX das quatro aulas compilam com o renderizador local',()=>{
 let count=0;
 for(const page of ['ordem-e-distancia','completude-e-aproximacao','funcoes-e-inversas','simetria-e-monotonicidade']){
  const html=fs.readFileSync(path.join(root,page+'.html'),'utf8');
  assert.ok(html.includes('assets/vendor/katex/katex.min.js'));
  for(const m of html.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)){
   assert.ok(!(m[1]||m[2]).includes('<'),'Desigualdades em HTML precisam usar &lt; dentro do TeX.');
   const tex=(m[1]||m[2]).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
   assert.doesNotThrow(()=>K.renderToString(tex,{throwOnError:true,strict:'error'}),page+': '+tex);count++;
  }
 }
 assert.ok(count>1000);
});
test('as referências matemáticas abrem em nova aba e levam a âncoras existentes',()=>{
 let refs=0;
 for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.html'))){
  const html=fs.readFileSync(path.join(root,file),'utf8');
  for(const [,attrs] of html.matchAll(/<a\b([^>]*class="xref"[^>]*)>/g)){
   assert.match(attrs,/target="_blank"/);assert.match(attrs,/rel="noopener noreferrer"/);
   const [page,id]=attrs.match(/href="([^"]+)"/)[1].split('#');
   assert.ok(fs.readFileSync(path.join(root,page),'utf8').includes(`id="${id}"`));refs++;
  }
 }
 assert.ok(refs>50);
});
test('a composição dos rótulos não aceita sobreposições nem reduz o tamanho para caber',()=>{
 const labels=Array.from({length:12},()=>({x:280,y:140,width:100,height:24,anchor:'middle'}));
 const positions=M.placeLabels(labels,560,280),placed=positions.filter(Boolean);
 assert.ok(placed.length>1);assert.ok(positions.some(p=>p===null));
 for(const p of placed){assert.equal(p.width,100);assert.equal(p.height,24);assert.ok(p.x>=4&&p.y>=3&&p.x+p.width<=556&&p.y+p.height<=277);}
 for(let i=0;i<placed.length;i++)for(let j=i+1;j<placed.length;j++){const a=placed[i],b=placed[j];assert.ok(a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y);}
 assert.equal(M.placeLabels([{x:0,y:0,width:700,height:24,anchor:'start'}],560,280)[0],null);
});
test('as expressões e inversas do explorador têm fontes LaTeX válidas',()=>{
 for(const source of ['(x^2)^3','x^(2^3)','-(x+1)','x-(x+1)','x*(x+1)'])assert.doesNotThrow(()=>K.renderToString(F.toLatex(F.parse(source)),{throwOnError:true,strict:'error'}));
 for(const [source,domain] of [['x^2','positive'],['-2*x^2+3','negative'],['x^3+2','natural'],['exp(2*x-1)','natural'],['ln(2*x+1)','natural'],['sqrt(2*x+1)','natural'],['cbrt(x)','natural'],['sin(x)','sine'],['cos(x)','cosine'],['tan(x)','tangent'],['abs(2*x)','positive'],['1/(2*x+1)','natural']]){
  const ast=F.parse(source),r=F.analyze(ast,domain);assert.ok(r.inverse.tex,source);
  for(const tex of [F.toLatex(ast),r.inverse.tex])assert.doesNotThrow(()=>K.renderToString(tex,{throwOnError:true,strict:'error'}),tex);
 }
});
