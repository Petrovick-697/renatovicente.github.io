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
  return Object.freeze({ contains, triangle, supWitness, refuteUpperBound,
    archimedean, reciprocal, sqrtTwoBracket, completenessCorrection, rationalBetween, accumulation, squareResidual });
});
