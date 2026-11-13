'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),C=require('../assets/math.js');
test('funções finitas: contradomínio, fibras e inversa são tratados como conjuntos declarados',()=>{
  const f=C.finiteMap([-2,-1,0,1,2],[0,1,4],[4,1,0,1,4]);
  assert.equal(f.injective,false);assert.equal(f.surjective,true);assert.equal(f.inverse,null);
  const g=C.finiteMap([0,1,2],[0,1,2],[2,0,1]);
  assert.deepEqual(g.inverse,[1,2,0]);
  g.inverse.forEach((x,y)=>assert.equal([2,0,1][x],y));
  assert.equal(C.finiteMap([0,1],[0,1,2],[0,1]).surjective,false);
  assert.throws(()=>C.finiteMap([0,1],[0],[0,1]),RangeError);
  assert.throws(()=>C.finiteMap([0,0],[0],[0,0]),RangeError);
});
test('imagem e pré-imagem do quadrado incluem zero e tratam intervalos negativos e degenerados',()=>{
  assert.deepEqual(C.squareImage(-2,1),{min:0,max:4});
  assert.deepEqual(C.squareImage(-3,-2),{min:4,max:9});
  assert.deepEqual(C.squareImage(2,2),{min:4,max:4});
  assert.deepEqual(C.squarePreimage(-3,-1),[]);
  assert.deepEqual(C.squarePreimage(-1,4),[[-2,2]]);
  assert.deepEqual(C.squarePreimage(1,4),[[-2,-1],[1,2]]);
  assert.deepEqual(C.squarePreimage(0,0),[[-0,0]]);
  assert.throws(()=>C.squareImage(2,-1),RangeError);
});
test('operações respeitam domínio natural e o zero do denominador',()=>{
  assert.equal(C.functionOperation(-1,'sum'),null);
  assert.equal(C.functionOperation(1,'quotient'),null);
  assert.equal(C.functionOperation(4,'sum'),5);
  assert.equal(C.functionOperation(4,'product'),6);
  assert.equal(C.functionOperation(4,'quotient'),2/3);
  assert.equal(C.functionOperation(0,'quotient'),-0);
});
test('domínio da composição é decidido antes de extrair a raiz',()=>{
  assert.equal(C.squareRootComposition(0,1).defined,false);
  assert.equal(C.squareRootComposition(1,1).value,0);
  assert.equal(C.squareRootComposition(-1,1).value,0);
  assert.equal(C.squareRootComposition(3,0).value,3);
  for(let c=0;c<=16;c++) for(let t=-12;t<=12;t++) {
    const w=C.squareRootComposition(t/4,c/4);
    assert.equal(w.defined,t*t>=4*c);
  }
});
test('inversa afim e parte fracionária nos números negativos',()=>{
  assert.equal(C.affineInverse(0,2,2),null);
  for(const m of [-2,-.5,.5,2]) for(const b of [-2,0,2]) for(const x of [-2,-.5,0,1,3]) assert.equal(C.affineInverse(m,b,m*x+b),x);
  assert.equal(C.fractionalPart(-1.25),.75);
  assert.equal(C.fractionalPart(-2),0);
  assert.equal(C.fractionalPart(1.25),.25);
});
test('comparador algébrico de raízes rejeita testemunhas fora do intervalo',()=>{
  assert.equal(C.compareRationalSurd(7,5,0,1),-1);
  assert.equal(C.compareRationalSurd(17,12,0,1),1);
  assert.equal(C.compareRationalSurd(-7,5,0,1,-1),1);
  assert.equal(C.compareRationalSurd(-17,12,0,1,-1),-1);
  assert.equal(C.compareRationalSurd(0,1,0,1),-1);
  assert.equal(C.compareRationalSurd(0,1,0,1,-1),1);
});
test('racional da prova de linearidade está estritamente entre os dois extremos algébricos',()=>{
  for(const kind of ['positive','negative','shifted']) for(let c=1;c<=4;c++) for(let d=-4;d<=4;d++) {
    const w=C.linearityWitness(c,kind,d);
    if(d===0){assert.equal(w.k,null);continue;}
    assert.equal(C.compareRationalSurd(w.k,w.n,w.rLow,w.d,w.sign),1);
    assert.equal(C.compareRationalSurd(w.k,w.n,w.rHigh,w.d,w.sign),-1);
    assert.equal(C.compareRationalSurd(w.k-10*w.n,w.n,w.rLow,w.d,w.sign),-1);
    assert.equal(C.compareRationalSurd(w.k+10*w.n,w.n,w.rHigh,w.d,w.sign),1);
    assert.ok(d<0?w.q<w.x&&w.c*w.q>w.fx:w.q>w.x&&w.c*w.q<w.fx);
  }
});
test('períodos são classificados pela forma exata declarada, inclusive os contraexemplos',()=>{
  assert.equal(C.knownPeriod('fraction','rational',1),true);
  assert.equal(C.knownPeriod('fraction','rational',2),false);
  assert.equal(C.knownPeriod('fraction','rational',2,2),true);
  assert.equal(C.knownPeriod('fraction','root'),false);
  assert.equal(C.knownPeriod('constant','root'),true);
  assert.equal(C.knownPeriod('rational-indicator','rational',7),true);
  assert.equal(C.knownPeriod('rational-indicator','root'),false);
  assert.equal(C.knownPeriod('constant','rational',1,1,true),false);
});
