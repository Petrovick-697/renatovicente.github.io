'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),F=require('../assets/explorer-math.js');
const analyze=(s,d)=>F.analyze(F.parse(s),d);
test('explorador interpreta precedência e rejeita instruções e sintaxe fora da linguagem',()=>{
  assert.equal(F.evaluate(F.parse('-x^2'),3),-9);assert.equal(F.evaluate(F.parse('2^3^2'),0),512);
  assert.equal(F.evaluate(F.parse('x^-2'),2),.25);assert.equal(F.evaluate(F.parse('sen(pi/2)'),0),1);
  for(const s of ['window.alert(1)','x;1','2x','sin x','x=3','constructor(x)','sin('])assert.throws(()=>F.parse(s),s);
  assert.throws(()=>F.parse('x^0'));assert.throws(()=>F.parse('0^0'));assert.equal(F.evaluate(F.parse('x^x'),0),null);assert.throws(()=>F.parse('1e100'));assert.throws(()=>F.parse('('.repeat(40)+'x'+')'.repeat(40)));
});
test('explorador respeita os buracos do domínio sem transformar NaN em saída',()=>{
  for(const s of ['sqrt(-1)','ln(0)','1/0','tan(pi/2)','(-1)^0.5'])assert.equal(F.evaluate(F.parse(s),0),null,s);
  assert.equal(analyze('sqrt(-x)','positive').domain,'Domínio com uma única entrada: {0}');
  assert.equal(analyze('ln(-x)','positive').domain,'Domínio vazio nesta restrição');
  assert.equal(analyze('sqrt(-1)','positive').period.status,'unknown');
});
test('paridade deriva da expressão e exige domínio simétrico',()=>{
  for(const [s,p] of [['x^2','even'],['x^3+x','odd'],['0','both'],['x^2+x','neither'],['sin(x)','odd'],['cos(x)','even'],['sin(x)/x','even'],['sqrt(x^2)','even']])assert.equal(analyze(s).parity.status,p,s);
  assert.equal(analyze('x^2','positive').parity.status,'not-applicable');
  assert.equal(analyze('ln(x^2)').parity.status,'even');
  assert.equal(analyze('ln(x)').parity.status,'not-applicable');
});
test('periodicidade tem certificação estrutural e não é inferida da amostragem',()=>{
  assert.equal(analyze('2*sin(3*x)+1').period.status,'periodic');
  assert.equal(analyze('tan(x)').period.status,'periodic');
  assert.equal(analyze('1').period.status,'all');
  assert.equal(analyze('x^4-x').period.status,'none');
  assert.equal(analyze('sin(x)','positive').period.status,'none');
  assert.equal(analyze('sin(x^2)').period.status,'unknown');
});
test('monotonicidade e inversa dependem do domínio e não confundem ramo com função inteira',()=>{
  assert.equal(analyze('sin((1+1e-16)*x)','sine').monotonic.status,'unknown');
  assert.equal(analyze('((1e-20)^6)^2*exp((1e-20)^6*x)').monotonic.status,'increasing');
  assert.equal(analyze('ln(x-1.5707963267948966)','sine').monotonic.status,'unknown');
  assert.equal(analyze('x^2').inverse.status,'none');assert.equal(analyze('x^2').monotonic.status,'neither');
  assert.equal(analyze('x^2','positive').monotonic.status,'increasing');
  assert.equal(analyze('x^2','negative').monotonic.status,'decreasing');
  assert.equal(analyze('sin(x)').inverse.status,'none');assert.equal(analyze('sin(x)','sine').inverse.status,'formula');
  assert.equal(analyze('sin(3*x)','sine').inverse.status,'unknown');
  assert.equal(analyze('tan(x)').monotonic.status,'neither');
  assert.equal(analyze('x^3+x').inverse.status,'unknown');
  assert.equal(analyze('x^3+x').monotonic.status,'increasing');
});
test('fórmulas de inversas recuperam entradas e rejeitam valores fora da imagem',()=>{
  for(const [s,d,xs] of [['2*x-3','natural',[-2,0,3]],['x^3+2','natural',[-2,0,3]],['-2*x^2+3','positive',[0,1,2]],['x^2','negative',[-2,-1,0]],['exp(2*x-1)','natural',[-2,0,2]],['ln(2*x+1)','natural',[0,1,2]],['sqrt(2*x+1)','natural',[-.5,0,2]],['sin(x)','sine',[-1,0,1]],['cos(x)','cosine',[0,1,2]],['tan(x)','tangent',[-1,0,1]]]){
    const ast=F.parse(s),r=F.analyze(ast,d);assert.equal(r.inverse.status,'formula',s);
    for(const x of xs){const y=F.evaluate(ast,x),back=r.inverse.fn(y);assert.ok(back!==null&&Math.abs(back-x)<1e-9,`${s}: ${x} -> ${y} -> ${back}`);}
  }
  assert.equal(analyze('x^2','positive').inverse.fn(-1),null);
  assert.equal(analyze('sqrt(x)').inverse.fn(-1),null);
  assert.equal(analyze('exp(x)').inverse.fn(0),null);
  assert.equal(analyze('sin(x)','sine').inverse.fn(2),null);
});
