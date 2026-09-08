export type Point = { x: number; y: number };

export function mean(xs: number[]) {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

export function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function ols(points: Point[]) {
  const n = points.length;
  if (n < 2) return { slope: 0, intercept: 0, mse: 0 };
  const mx = mean(points.map((p) => p.x));
  const my = mean(points.map((p) => p.y));
  let cov = 0;
  let varx = 0;
  for (const p of points) {
    cov += (p.x - mx) * (p.y - my);
    varx += (p.x - mx) ** 2;
  }
  const slope = varx === 0 ? 0 : cov / varx;
  const intercept = my - slope * mx;
  const mse =
    points.reduce((s, p) => s + (p.y - (slope * p.x + intercept)) ** 2, 0) / n;
  return { slope, intercept, mse };
}

export function sigmoid(z: number) {
  if (z > 20) return 1;
  if (z < -20) return 0;
  return 1 / (1 + Math.exp(-z));
}

export function entropy(p: number) {
  const q = 1 - p;
  if (p <= 0 || p >= 1) return 0;
  return -(p * Math.log2(p) + q * Math.log2(q));
}

export function binomialMajority(n: number, p: number) {
  if (n < 1) return 0;
  const majority = Math.floor(n / 2) + 1;
  let acc = 0;
  for (let k = majority; k <= n; k++) {
    acc += binomial(n, k) * p ** k * (1 - p) ** (n - k);
  }
  return acc;
}

function binomial(n: number, k: number) {
  if (k < 0 || k > n) return 0;
  k = Math.min(k, n - k);
  let c = 1;
  for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
  return c;
}

export function gaussian(meanVal: number, std: number) {
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return meanVal + z * std;
}

export function linspace(a: number, b: number, n: number) {
  if (n <= 1) return [a];
  return Array.from({ length: n }, (_, i) => a + ((b - a) * i) / (n - 1));
}

export function mse(y: number[], yhat: number[]) {
  const n = y.length;
  if (!n) return 0;
  let s = 0;
  for (let i = 0; i < n; i++) s += (y[i] - yhat[i]) ** 2;
  return s / n;
}

export function polyFit(xs: number[], ys: number[], degree: number) {
  const n = xs.length;
  const m = degree + 1;
  const A: number[][] = Array.from({ length: m }, () => Array(m).fill(0));
  const b: number[] = Array(m).fill(0);
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    let p = 1;
    for (let j = 0; j < m; j++) {
      row.push(p);
      p *= xs[i];
    }
    for (let r = 0; r < m; r++) {
      b[r] += row[r] * ys[i];
      for (let c = 0; c < m; c++) A[r][c] += row[r] * row[c];
    }
  }
  return solve(A, b);
}

function solve(A: number[][], b: number[]) {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let i = 0; i < n; i++) {
    let max = i;
    for (let r = i + 1; r < n; r++) {
      if (Math.abs(M[r][i]) > Math.abs(M[max][i])) max = r;
    }
    [M[i], M[max]] = [M[max], M[i]];
    const pivot = M[i][i] || 1e-12;
    for (let c = i; c <= n; c++) M[i][c] /= pivot;
    for (let r = 0; r < n; r++) {
      if (r === i) continue;
      const f = M[r][i];
      for (let c = i; c <= n; c++) M[r][c] -= f * M[i][c];
    }
  }
  return M.map((row) => row[n]);
}

export function polyEval(coeffs: number[], x: number) {
  let y = 0;
  let p = 1;
  for (const c of coeffs) {
    y += c * p;
    p *= x;
  }
  return y;
}
