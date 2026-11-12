'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../assets/math.js');

// Comparadores exatos usados como verificadores das testemunhas, sem formatação decimal.
function reciprocalIsInside(n, p, q) { return BigInt(p) * BigInt(n) > BigInt(q); }
function rationalIsInside(k, n, left, right, denominator) {
  return BigInt(left) * BigInt(n) < BigInt(k) * BigInt(denominator)
    && BigInt(k) * BigInt(denominator) < BigInt(right) * BigInt(n);
}
test('controles negativos rejeitam extremos excluídos e denominadores insuficientes', () => {
  assert.equal(reciprocalIsInside(10, 1, 10), false);
  assert.equal(reciprocalIsInside(9, 1, 10), false);
  assert.equal(rationalIsInside(0, 3, 0, 1, 1), false);
  assert.equal(rationalIsInside(1, 1, 0, 1, 1), false);
  assert.equal(reciprocalIsInside(11, 1, 10), true);
  assert.equal(rationalIsInside(1, 2, 0, 1, 1), true);
});
test('intervalos incluem exatamente os extremos declarados, inclusive o degenerado', () => {
  for (const left of [false,true]) for (const right of [false,true]) {
    assert.equal(C.contains(-2,-2,3,left,right),left);
    assert.equal(C.contains(3,-2,3,left,right),right);
    assert.equal(C.contains(0,-2,3,left,right),true);
    assert.equal(C.contains(2,2,2,left,right),left && right);
  }
  assert.throws(()=>C.contains(0,3,-2,true,true),RangeError);
});
test('desigualdades triangulares e casos de igualdade na malha diádica', () => {
  for (let i=-24;i<=24;i++) for (let j=-24;j<=24;j++) {
    const a=i/4,b=j/4,t=C.triangle(a,b);
    assert.ok(t.direct<=t.detour);
    assert.ok(t.reverse<=t.distance);
    assert.equal(t.direct===t.detour,a*b>=0);
    assert.equal(t.reverse===t.distance,a*b>=0);
  }
});
test('supremo: testemunha pertence a (0,1) e supera 1-epsilon', () => {
  for (let e=1;e<=500;e++) {
    const epsilon=e/100,x=C.supWitness(epsilon);
    assert.ok(0<x && x<1 && 1-epsilon<x);
  }
  for(let tick=-10;tick<20;tick++) {
    const bound=tick/20,x=C.refuteUpperBound(bound);
    assert.ok(0<x && x<1 && bound<x);
  }
  assert.equal(C.refuteUpperBound(1),null);
  assert.throws(()=>C.supWitness(0),RangeError);
  assert.throws(()=>C.supWitness(Number.MIN_VALUE),RangeError);
});
test('testemunhas arquimedianas, incluindo limites iguais a múltiplos', () => {
  for(let x=1;x<=20;x++) for(let L=-20;L<=120;L++) {
    const {n}=C.archimedean(x,L);
    assert.ok(BigInt(n)*BigInt(x)>BigInt(L));
    if(n>0) assert.ok(BigInt(n-1)*BigInt(x)<=BigInt(L));
  }
  assert.equal(C.archimedean(5,20).n,5);
  assert.throws(()=>C.archimedean(0,10),RangeError);
});
test('recíprocos: desigualdade estrita verificada por multiplicação cruzada', () => {
  for(let p=1;p<=1000;p++) {
    const {n}=C.reciprocal(p,1000);
    assert.equal(reciprocalIsInside(n,p,1000),true);
  }
  assert.equal(C.reciprocal(100,1000).n,11);
  assert.throws(()=>C.reciprocal(-1),RangeError);
});
test('bisseção: quadrados inteiros enquadram 2 e a largura é 1/2^j', () => {
  for(let j=0;j<=20;j++) {
    const t=C.sqrtTwoBracket(j),l=BigInt(t.lower),u=BigInt(t.upper),d=BigInt(t.denominator);
    assert.ok(l*l<2n*d*d && 2n*d*d<u*u);
    assert.equal(u-l,1n);
    assert.equal(d,2n**BigInt(j));
  }
});
test('a correção do candidato ao supremo satisfaz as desigualdades com frações exatas',()=>{
  for(let p=100;p<=200;p++) {
    const c=C.completenessCorrection(p),n=BigInt(c.tNumerator),d=BigInt(c.tDenominator);
    const candidate=BigInt(p)*d,corrected=100n*n;
    if(c.below) {assert.ok(n*n<2n*d*d);assert.ok(corrected>candidate);}
    else {assert.ok(n*n>2n*d*d);assert.ok(corrected<candidate);}
  }
});
test('densidade: fração estritamente interna a intervalos positivos e negativos', () => {
  for(let power=0;power<=12;power++) for(let center=-16;center<=16;center++) {
    // Centro center/8; semilargura 1/2^(power+1). Denominador comum exato.
    const d=2**Math.max(3,power+1),m=center*d/8,w=d/2**(power+1);
    const a=(m-w)/d,b=(m+w)/d,{k,n}=C.rationalBetween(a,b);
    assert.equal(rationalIsInside(k,n,m-w,m+w,d),true);
  }
  assert.throws(()=>C.rationalBetween(1,1),RangeError);
});
test('a testemunha de acumulação é distinta de zero e está dentro da vizinhança', () => {
  for(let power=1;power<=14;power++) {
    const t=C.accumulation('reciprocal',power);
    assert.ok(t.n>t.denominator);
    assert.equal(reciprocalIsInside(t.n,1,t.denominator),true);
    const u=C.accumulation('interval',power);
    assert.ok(0<u.point && u.point<u.delta);
    assert.equal(C.accumulation('integers',power).point,null);
  }
});
test('resíduo de aproximações racionais a raiz de 2 usa inteiros exatos', () => {
  assert.equal(C.squareResidual(7,5),-1n);
  assert.equal(C.squareResidual(17,12),1n);
  assert.equal(C.squareResidual(99,70),1n);
});
