'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const pages=['index.html','ordem-e-distancia.html','completude-e-aproximacao.html'];
test('as páginas possuem identificadores únicos e links locais resolvidos',()=>{
  for(const page of pages) {
    const html=fs.readFileSync(path.join(root,page),'utf8');
    const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(new Set(ids).size,ids.length,`IDs duplicados em ${page}`);
    for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if(/^(https?:|mailto:)/.test(url)) continue;
      const [file,hash]=url.split('#'),target=path.join(root,file||page);
      assert.ok(fs.existsSync(target),`Destino ausente: ${page} -> ${url}`);
      if(hash) assert.ok(fs.readFileSync(target,'utf8').includes(`id="${hash}"`),`Âncora ausente: ${url}`);
    }
  }
});
test('cada resultado declarado tem enunciado, prova e bancada ligada à prova',()=>{
  let results=0;
  for(const page of pages.slice(1)) {
    const html=fs.readFileSync(path.join(root,page),'utf8');
    for(const section of html.matchAll(/<section\b([^>]*\bdata-result="([^"]+)"[^>]*)>([\s\S]*?)<\/section>/g)) {
      const [,attrs,name,body]=section;
      assert.ok(body.includes('class="statement"'),`${name}: falta enunciado`);
      assert.ok(body.includes('class="proof"'),`${name}: falta prova`);
      const proof=body.match(/data-proof="([^"]+)"/);
      assert.ok(proof,`${name}: falta figura ligada à prova`);
      assert.ok(body.includes(`<ol id="${proof[1]}">`),`${name}: prova não encontrada`);
      assert.ok(body.includes('data-lab="'),`${name}: falta interação`);
      results++;
    }
  }
  assert.equal(results,14);
});
