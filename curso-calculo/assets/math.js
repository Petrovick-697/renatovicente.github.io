/* Cálculos das bancadas. As provas gerais estão nas aulas, não nos testes. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Calculo = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function finite(...xs) {
    if (!xs.every(Number.isFinite)) throw new RangeError('Use números finitos.');
  }
  function integer(...xs) {
    if (!xs.every(Number.isSafeInteger)) throw new RangeError('Use inteiros seguros.');
  }
  function contains(x, a, b, closedLeft, closedRight) {
    finite(x, a, b);
    if (a > b) throw new RangeError('O extremo inicial deve ser menor ou igual ao final.');
    return (closedLeft ? a <= x : a < x) && (closedRight ? x <= b : x < b);
  }
  function triangle(a, b) {
    finite(a, b);
    return { direct: Math.abs(a + b), detour: Math.abs(a) + Math.abs(b),
      reverse: Math.abs(Math.abs(a) - Math.abs(b)), distance: Math.abs(a - b) };
  }
  function supWitness(epsilon) {
    finite(epsilon);
    if (epsilon <= 0) throw new RangeError('epsilon deve ser positivo.');
    const point = 1 - Math.min(epsilon / 2, 0.5);
    if (!(0 < point && point < 1 && 1 - epsilon < point)) throw new RangeError('epsilon está abaixo da resolução desta bancada.');
    return point;
  }
  function refuteUpperBound(bound) {
    finite(bound);
    return bound >= 1 ? null : (bound < 0 ? 0.5 : (bound + 1) / 2);
  }
  // Trabalhar com numeradores evita arredondar x e L como decimais antes da divisão.
  function archimedean(xNumerator, boundNumerator, scale = 10) {
    integer(xNumerator, boundNumerator, scale);
    if (xNumerator <= 0 || scale <= 0) throw new RangeError('x e a escala devem ser positivos.');
    const n = Math.max(0, Math.floor(boundNumerator / xNumerator) + 1);
    integer(n, n * xNumerator);
    return { n, previous: Math.max(0, n - 1), value: n * xNumerator / scale,
      x: xNumerator / scale, bound: boundNumerator / scale };
  }
  function reciprocal(epsilonNumerator, epsilonDenominator = 1000) {
    integer(epsilonNumerator, epsilonDenominator);
    if (epsilonNumerator <= 0 || epsilonDenominator <= 0) throw new RangeError('epsilon deve ser positivo.');
    const n = Math.floor(epsilonDenominator / epsilonNumerator) + 1;
    integer(n);
    return { n, value: 1 / n, epsilon: epsilonNumerator / epsilonDenominator };
  }
  function sqrtTwoBracket(steps) {
    integer(steps);
    if (steps < 0 || steps > 20) throw new RangeError('Escolha de 0 a 20 bisseções.');
    let lower = 1, upper = 2, denominator = 1;
    for (let j = 0; j < steps; j++) {
      const middle = lower + upper;
      lower *= 2; upper *= 2; denominator *= 2;
      if (middle * middle < 2 * denominator * denominator) lower = middle;
      else upper = middle;
    }
    return { lower, upper, denominator, a: lower / denominator, b: upper / denominator };
  }
  function completenessCorrection(p, q = 100) {
    integer(p, q);
    if (q <= 0 || p < q || p > 2 * q) throw new RangeError('Escolha um candidato entre 1 e 2.');
    const residual = p * p - 2 * q * q, below = residual < 0;
    const hNumerator = Math.abs(residual);
    const hDenominator = below ? 2 * q * (2 * p + q) : 4 * p * q;
    const tNumerator = p * hDenominator + (below ? 1 : -1) * q * hNumerator;
    const tDenominator = q * hDenominator;
    integer(hNumerator, hDenominator, tNumerator, tDenominator);
    return { s:p/q, below, hNumerator, hDenominator, tNumerator, tDenominator,
      h:hNumerator/hDenominator, t:tNumerator/tDenominator };
  }
  function rationalBetween(a, b) {
    finite(a, b);
    if (a >= b) throw new RangeError('É necessário a < b.');
    const n = Math.floor(2 / (b - a)) + 1;
    const k = Math.floor(n * a) + 1;
    integer(n, k);
    const value = k / n;
    if (!(a < value && value < b)) throw new RangeError('Intervalo fora da resolução numérica desta bancada.');
    return { k, n, value, a, b };
  }
  function accumulation(kind, power) {
    integer(power);
    if (power < 1 || power > 14) throw new RangeError('Escolha uma escala entre 1 e 14.');
    const denominator = 2 ** power, delta = 1 / denominator;
    if (kind === 'reciprocal') {
      const n = 2 * denominator + 1;
      return { delta, denominator, n, point: 1 / n, member: false, accumulation: true };
    }
    if (kind === 'interval') return { delta, denominator, point: delta / 2, member: false, accumulation: true };
    if (kind === 'integers' || kind === 'finite') return { delta, denominator, point: null, member: true, accumulation: false };
    throw new RangeError('Conjunto desconhecido.');
  }
  function squareResidual(p, q) {
    integer(p, q);
    if (q <= 0) throw new RangeError('O denominador deve ser positivo.');
    return BigInt(p) ** 2n - 2n * BigInt(q) ** 2n;
  }
  function finiteMap(domain, codomain, outputs) {
    if (!Array.isArray(domain) || !Array.isArray(codomain) || !Array.isArray(outputs)
      || !domain.length || !codomain.length || outputs.length!==domain.length
      || new Set(domain).size!==domain.length || new Set(codomain).size!==codomain.length)
      throw new RangeError('Declare conjuntos não vazios, sem repetição, e uma saída por entrada.');
    if (!outputs.every(y=>codomain.includes(y))) throw new RangeError('Toda saída deve pertencer ao contradomínio.');
    const fibers=codomain.map(y=>domain.filter((x,i)=>outputs[i]===y));
    const injective=fibers.every(xs=>xs.length<=1),surjective=fibers.every(xs=>xs.length>=1);
    return {image:[...new Set(outputs)],fibers,injective,surjective,bijective:injective&&surjective,
      inverse:injective&&surjective?fibers.map(xs=>xs[0]):null};
  }
  function squareImage(a,b) {
    finite(a,b); if(a>b) throw new RangeError('É necessário a ≤ b.');
    return {min:a<=0&&b>=0?0:Math.min(a*a,b*b),max:Math.max(a*a,b*b)};
  }
  function squarePreimage(c,d) {
    finite(c,d); if(c>d) throw new RangeError('É necessário c ≤ d.');
    if(d<0) return [];
    const lower=Math.sqrt(Math.max(0,c)),upper=Math.sqrt(d);
    return lower===0?[[-upper,upper]]:[[-upper,-lower],[lower,upper]];
  }
  function functionOperation(x,operation) {
    finite(x);
    if(!['sum','product','quotient'].includes(operation)) throw new RangeError('Operação desconhecida.');
    if(x<0 || operation==='quotient'&&x===1) return null;
    const f=Math.sqrt(x),g=x-1;
    return operation==='sum'?f+g:operation==='product'?f*g:f/g;
  }
  function squareRootComposition(x,c) {
    finite(x,c); if(c<0) throw new RangeError('Use c ≥ 0.');
    const inner=x*x-c;
    return {inner,defined:inner>=0,value:inner>=0?Math.sqrt(inner):null,wholeDomain:c===0};
  }
  function affineInverse(m,b,y) {
    finite(m,b,y); if(m===0) return null; const value=(y-b)/m; return value===0?0:value;
  }
  function fractionalPart(x) {finite(x);return x-Math.floor(x);}
  // Compara k/n com r/d + sign*sqrt(2), por sinais e quadrados de inteiros.
  function compareRationalSurd(k,n,r,d,sign=1) {
    integer(k,n,r,d,sign);
    if(n<=0||d<=0||![1,-1].includes(sign)) throw new RangeError('Denominadores positivos e sinal ±1 são necessários.');
    const t=BigInt(k)*BigInt(d)-BigInt(r)*BigInt(n),den=BigInt(n)*BigInt(d);
    const cmp=z=>z<0n?-1:z>0n?1:0;
    if(sign===1) return t<=0n?-1:cmp(t*t-2n*den*den);
    return t>=0n?1:cmp(2n*den*den-t*t);
  }
  function linearityWitness(cNumerator,kind,deviationNumerator) {
    integer(cNumerator,deviationNumerator);
    if(cNumerator<1||cNumerator>4||Math.abs(deviationNumerator)>4||!['positive','negative','shifted'].includes(kind)) throw new RangeError('Parâmetro fora da bancada.');
    const sign=kind==='negative'?-1:1,base=kind==='shifted'?1:0;
    const x=base+sign*Math.sqrt(2),c=cNumerator/2,delta=deviationNumerator/4;
    if(delta===0) return {x,c,delta,fx:c*x,k:null,n:null};
    const d=2*cNumerator,rLow=base*d+Math.min(0,deviationNumerator),rHigh=base*d+Math.max(0,deviationNumerator);
    const width=Math.abs(deviationNumerator)/d,n=Math.floor(4/width)+1;
    let k=Math.floor(n*(rLow/d+sign*Math.sqrt(2)))+1;
    while(compareRationalSurd(k,n,rLow,d,sign)<=0) k++;
    if(compareRationalSurd(k,n,rHigh,d,sign)>=0) throw new RangeError('A construção não forneceu um ponto interior.');
    return {x,c,delta,fx:c*x+delta,k,n,q:k/n,sign,base,rLow,rHigh,d};
  }
  function knownPeriod(family,type,q=1,m=1,restricted=false) {
    integer(q,m); if(q<1||m<1||!['fraction','constant','rational-indicator'].includes(family)||!['rational','root'].includes(type)) throw new RangeError('Período ou família inválidos.');
    if(restricted) return false;
    if(family==='constant') return true;
    if(type==='root') return false;
    return family==='rational-indicator'||m%q===0;
  }
  function exampleValue(kind,x,m=1,b=0) {
    finite(x,m,b);
    const values={square:()=>x*x,cube:()=>x*x*x,mixed:()=>x*x+x,zero:()=>0,
      affine:()=>m*x+b,floor:()=>Math.floor(x),fraction:()=>fractionalPart(x),
      identity:()=>x,absolute:()=>Math.abs(x),oddSquare:()=>x*Math.abs(x)};
    if(!values[kind]) throw new RangeError('Exemplo desconhecido.');
    return values[kind]();
  }
  function sequenceValue(kind,n) {
    integer(n); if(n<0) throw new RangeError('O índice deve ser não negativo.');
    if(kind==='alternating') return n%2===0?1:-1;
    if(kind==='opposite') return n%2===0?-1:1;
    if(kind==='reciprocal') return 1/(n+1);
    throw new RangeError('Sequência desconhecida.');
  }
  function sectorModel(radius,thetaPi) {
    finite(radius,thetaPi); if(radius<=0) throw new RangeError('Raio positivo necessário.');
    return {theta:thetaPi*Math.PI,coefficient:radius*radius*thetaPi/2,area:radius*radius*thetaPi*Math.PI/2,
      turns:Math.trunc(Math.abs(thetaPi)/2),remainder:Math.abs(thetaPi)%2,sign:Math.sign(thetaPi)};
  }
  return Object.freeze({ contains, triangle, supWitness, refuteUpperBound,
    archimedean, reciprocal, sqrtTwoBracket, completenessCorrection, rationalBetween, accumulation, squareResidual,
    finiteMap,squareImage,squarePreimage,functionOperation,squareRootComposition,affineInverse,fractionalPart,
    compareRationalSurd,linearityWitness,knownPeriod,exampleValue,sequenceValue,sectorModel });
});
