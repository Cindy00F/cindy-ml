"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PlaygroundFrame } from "@/components/playground-frame";
import { useI18n } from "@/lib/i18n";
import {
  binomialMajority,
  clamp,
  entropy,
  linspace,
  mse,
  ols,
  polyEval,
  polyFit,
  sigmoid,
  type Point,
} from "@/lib/math";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/70 px-3 py-2">
      <div className="text-[11px] tracking-wide text-muted-foreground uppercase">
        {label}
      </div>
      <div className="font-mono text-sm tabular-nums">{value}</div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  display?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span className="font-mono tabular-nums">{display ?? value}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step ?? 1}
        onValueChange={(v) => {
          const next = Array.isArray(v) ? v[0] : v;
          if (typeof next === "number") onChange(next);
        }}
      />
    </label>
  );
}

export function LinearRegressionPlayground() {
  const { locale, t } = useI18n();
  const [points, setPoints] = useState<Point[]>([
    { x: 0.15, y: 0.28 },
    { x: 0.32, y: 0.4 },
    { x: 0.48, y: 0.52 },
    { x: 0.66, y: 0.58 },
    { x: 0.82, y: 0.78 },
  ]);
  const { slope, intercept, mse: err } = ols(points);
  const w = 520;
  const h = 280;
  const pad = 28;

  const toSvg = (p: Point) => ({
    cx: pad + p.x * (w - pad * 2),
    cy: h - pad - p.y * (h - pad * 2),
  });
  const fromSvg = (cx: number, cy: number): Point => ({
    x: clamp((cx - pad) / (w - pad * 2), 0, 1),
    y: clamp((h - pad - cy) / (h - pad * 2), 0, 1),
  });

  const line = [
    toSvg({ x: 0, y: intercept }),
    toSvg({ x: 1, y: slope + intercept }),
  ];

  return (
    <PlaygroundFrame
      title={locale === "zh" ? "最小二乘拟合" : "Least-squares fit"}
    >
      <div className="mb-3 grid grid-cols-3 gap-2">
        <Stat label={locale === "zh" ? "斜率" : "Slope"} value={slope.toFixed(3)} />
        <Stat
          label={locale === "zh" ? "截距" : "Intercept"}
          value={intercept.toFixed(3)}
        />
        <Stat label="MSE" value={err.toFixed(4)} />
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full cursor-crosshair rounded-xl bg-muted/40"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const sx = ((e.clientX - rect.left) / rect.width) * w;
          const sy = ((e.clientY - rect.top) / rect.height) * h;
          setPoints((ps) => [...ps, fromSvg(sx, sy)]);
        }}
      >
        <line
          x1={pad}
          x2={w - pad}
          y1={h - pad}
          y2={h - pad}
          className="stroke-border"
        />
        <line
          x1={pad}
          x2={pad}
          y1={pad}
          y2={h - pad}
          className="stroke-border"
        />
        <line
          x1={line[0].cx}
          y1={line[0].cy}
          x2={line[1].cx}
          y2={line[1].cy}
          className="stroke-primary"
          strokeWidth={2.5}
        />
        {points.map((p, i) => {
          const s = toSvg(p);
          const yhat = slope * p.x + intercept;
          const pred = toSvg({ x: p.x, y: yhat });
          return (
            <g key={i}>
              <line
                x1={s.cx}
                y1={s.cy}
                x2={pred.cx}
                y2={pred.cy}
                className="stroke-primary/40"
                strokeDasharray="3 3"
              />
              <circle
                cx={s.cx}
                cy={s.cy}
                r={6}
                className="fill-primary stroke-background"
                strokeWidth={2}
              />
            </g>
          );
        })}
      </svg>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{t("addPoint")}</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            setPoints([
              { x: 0.15, y: 0.28 },
              { x: 0.32, y: 0.4 },
              { x: 0.48, y: 0.52 },
              { x: 0.66, y: 0.58 },
              { x: 0.82, y: 0.78 },
            ])
          }
        >
          {t("reset")}
        </Button>
      </div>
    </PlaygroundFrame>
  );
}

export function LogisticPlayground() {
  const { locale } = useI18n();
  const [w, setW] = useState(4);
  const [b, setB] = useState(-2);
  const [thr, setThr] = useState(0.5);
  const xs = linspace(-2, 6, 80);
  const width = 520;
  const height = 240;
  const pad = 28;
  const xTo = (x: number) => pad + ((x + 2) / 8) * (width - pad * 2);
  const yTo = (y: number) => height - pad - y * (height - pad * 2);
  const points = [
    { x: -0.4, y: 0 },
    { x: 0.2, y: 0 },
    { x: 0.8, y: 0 },
    { x: 1.6, y: 1 },
    { x: 2.4, y: 1 },
    { x: 3.5, y: 1 },
    { x: 1.1, y: 0 },
    { x: 2.0, y: 1 },
  ];
  const acc =
    points.filter((p) => (sigmoid(w * p.x + b) >= thr ? 1 : 0) === p.y)
      .length / points.length;

  return (
    <PlaygroundFrame title={locale === "zh" ? "Sigmoid 与阈值" : "Sigmoid and threshold"}>
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <SliderRow
          label={locale === "zh" ? "权重 w" : "Weight w"}
          value={w}
          min={0.5}
          max={8}
          step={0.1}
          onChange={setW}
          display={w.toFixed(1)}
        />
        <SliderRow
          label={locale === "zh" ? "偏置 b" : "Bias b"}
          value={b}
          min={-6}
          max={4}
          step={0.1}
          onChange={setB}
          display={b.toFixed(1)}
        />
        <SliderRow
          label={locale === "zh" ? "阈值" : "Threshold"}
          value={thr}
          min={0.1}
          max={0.9}
          step={0.01}
          onChange={setThr}
          display={thr.toFixed(2)}
        />
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full rounded-xl bg-muted/40">
        <line
          x1={pad}
          x2={width - pad}
          y1={yTo(thr)}
          y2={yTo(thr)}
          className="stroke-chart-4"
          strokeDasharray="5 4"
        />
        <polyline
          fill="none"
          className="stroke-primary"
          strokeWidth={2.5}
          points={xs.map((x) => `${xTo(x)},${yTo(sigmoid(w * x + b))}`).join(" ")}
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={xTo(p.x)}
            cy={yTo(p.y)}
            r={7}
            className={p.y ? "fill-chart-2" : "fill-chart-5"}
            opacity={0.9}
          />
        ))}
      </svg>
      <p className="mt-2 text-xs text-muted-foreground">
        {locale === "zh" ? "训练点上的准确率" : "Accuracy on the toy points"}:{" "}
        <span className="font-mono">{(acc * 100).toFixed(0)}%</span>
      </p>
    </PlaygroundFrame>
  );
}

function sampleScores() {
  const pos = [
    0.91, 0.84, 0.78, 0.74, 0.71, 0.69, 0.66, 0.64, 0.61, 0.59, 0.57, 0.55, 0.53,
    0.51, 0.49, 0.47, 0.45, 0.42, 0.38, 0.33, 0.88, 0.81, 0.76, 0.72, 0.68, 0.63,
    0.58, 0.52, 0.46, 0.41, 0.86, 0.79, 0.7, 0.62, 0.54, 0.48, 0.44, 0.36, 0.82, 0.67,
  ];
  const neg = [
    0.12, 0.18, 0.22, 0.25, 0.28, 0.31, 0.33, 0.35, 0.37, 0.39, 0.41, 0.43, 0.46,
    0.49, 0.52, 0.56, 0.61, 0.66, 0.21, 0.27, 0.3, 0.34, 0.38, 0.42, 0.45, 0.48,
    0.51, 0.19, 0.24, 0.29, 0.32, 0.36, 0.4, 0.44, 0.47, 0.15, 0.26, 0.58, 0.23, 0.5,
  ];
  return { pos, neg };
}

export function RocPlayground() {
  const { locale } = useI18n();
  const [{ pos, neg }] = useState(sampleScores);
  const [thr, setThr] = useState(0.5);
  const tp = pos.filter((s) => s >= thr).length;
  const fn = pos.length - tp;
  const fp = neg.filter((s) => s >= thr).length;
  const tn = neg.length - fp;
  const tpr = tp / (tp + fn);
  const fpr = fp / (fp + tn);

  const roc = useMemo(() => {
    const ths = linspace(1, 0, 40);
    return ths.map((t) => {
      const tp = pos.filter((s) => s >= t).length;
      const fp = neg.filter((s) => s >= t).length;
      return { fpr: fp / neg.length, tpr: tp / pos.length };
    });
  }, [pos, neg]);

  const auc = useMemo(() => {
    let a = 0;
    for (let i = 1; i < roc.length; i++) {
      a += ((roc[i].fpr - roc[i - 1].fpr) * (roc[i].tpr + roc[i - 1].tpr)) / 2;
    }
    return a;
  }, [roc]);

  const W = 260;
  const H = 220;
  const pad = 28;

  return (
    <PlaygroundFrame title={locale === "zh" ? "阈值扫过 ROC" : "Sweep the ROC"}>
      <SliderRow
        label={locale === "zh" ? "分类阈值" : "Threshold"}
        value={thr}
        min={0.05}
        max={0.95}
        step={0.01}
        onChange={setThr}
        display={thr.toFixed(2)}
      />
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-2 text-center text-sm">
          <div className="rounded-xl bg-chart-2/15 p-3">
            TP
            <div className="font-mono text-lg">{tp}</div>
          </div>
          <div className="rounded-xl bg-destructive/10 p-3">
            FP
            <div className="font-mono text-lg">{fp}</div>
          </div>
          <div className="rounded-xl bg-destructive/10 p-3">
            FN
            <div className="font-mono text-lg">{fn}</div>
          </div>
          <div className="rounded-xl bg-muted p-3">
            TN
            <div className="font-mono text-lg">{tn}</div>
          </div>
          <Stat label="TPR" value={tpr.toFixed(2)} />
          <Stat label="FPR" value={fpr.toFixed(2)} />
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full rounded-xl bg-muted/40">
          <line x1={pad} y1={H - pad} x2={W - pad} y2={pad} className="stroke-border" strokeDasharray="4 4" />
          <polyline
            fill="none"
            className="stroke-primary"
            strokeWidth={2.5}
            points={roc
              .map(
                (p) =>
                  `${pad + p.fpr * (W - pad * 2)},${H - pad - p.tpr * (H - pad * 2)}`,
              )
              .join(" ")}
          />
          <circle
            cx={pad + fpr * (W - pad * 2)}
            cy={H - pad - tpr * (H - pad * 2)}
            r={6}
            className="fill-primary"
          />
          <text x={W / 2} y={H - 8} textAnchor="middle" className="fill-muted-foreground text-[10px]">
            FPR
          </text>
          <text
            x={12}
            y={H / 2}
            className="fill-muted-foreground text-[10px]"
            transform={`rotate(-90 12 ${H / 2})`}
          >
            TPR
          </text>
        </svg>
      </div>
      <p className="mt-2 font-mono text-sm">AUC ≈ {auc.toFixed(3)}</p>
    </PlaygroundFrame>
  );
}

export function PrecisionRecallPlayground() {
  const { locale } = useI18n();
  const [{ pos, neg }] = useState(sampleScores);
  const [thr, setThr] = useState(0.5);
  const tp = pos.filter((s) => s >= thr).length;
  const fn = pos.length - tp;
  const fp = neg.filter((s) => s >= thr).length;
  const tn = neg.length - fp;
  const P = tp + fp === 0 ? 0 : tp / (tp + fp);
  const R = tp + fn === 0 ? 0 : tp / (tp + fn);
  const f1 = P + R === 0 ? 0 : (2 * P * R) / (P + R);
  const acc = (tp + tn) / (pos.length + neg.length);

  return (
    <PlaygroundFrame
      title={locale === "zh" ? "精确率、召回与 F1" : "Precision, recall, F1"}
    >
      <SliderRow
        label={locale === "zh" ? "阈值" : "Threshold"}
        value={thr}
        min={0.05}
        max={0.95}
        step={0.01}
        onChange={setThr}
        display={thr.toFixed(2)}
      />
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label={locale === "zh" ? "精确率" : "Precision"} value={P.toFixed(2)} />
        <Stat label={locale === "zh" ? "召回" : "Recall"} value={R.toFixed(2)} />
        <Stat label="F1" value={f1.toFixed(2)} />
        <Stat label={locale === "zh" ? "准确率" : "Accuracy"} value={acc.toFixed(2)} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-xl bg-chart-2/15 p-4">
          TP <div className="font-mono text-2xl">{tp}</div>
        </div>
        <div className="rounded-xl bg-destructive/10 p-4">
          FP <div className="font-mono text-2xl">{fp}</div>
        </div>
        <div className="rounded-xl bg-destructive/10 p-4">
          FN <div className="font-mono text-2xl">{fn}</div>
        </div>
        <div className="rounded-xl bg-muted p-4">
          TN <div className="font-mono text-2xl">{tn}</div>
        </div>
      </div>
    </PlaygroundFrame>
  );
}

export function EntropyPlayground() {
  const { locale } = useI18n();
  const [red, setRed] = useState(7);
  const [blue, setBlue] = useState(3);
  const total = red + blue;
  const p = total === 0 ? 0 : red / total;
  const H = entropy(p);
  const balls = [
    ...Array.from({ length: red }, (_, i) => ({ id: `r${i}`, c: "var(--chart-1)" })),
    ...Array.from({ length: blue }, (_, i) => ({ id: `b${i}`, c: "var(--chart-3)" })),
  ];

  return (
    <PlaygroundFrame title={locale === "zh" ? "一袋标签的熵" : "Entropy of a bag"}>
      <div className="grid gap-3 sm:grid-cols-2">
        <SliderRow
          label={locale === "zh" ? "第一类个数" : "Class A count"}
          value={red}
          min={0}
          max={12}
          onChange={setRed}
        />
        <SliderRow
          label={locale === "zh" ? "第二类个数" : "Class B count"}
          value={blue}
          min={0}
          max={12}
          onChange={setBlue}
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 rounded-xl bg-muted/50 p-4">
        {balls.map((b) => (
          <span
            key={b.id}
            className="size-7 rounded-full shadow-sm"
            style={{ background: b.c }}
          />
        ))}
        {balls.length === 0 && (
          <span className="text-sm text-muted-foreground">
            {locale === "zh" ? "袋子是空的" : "The bag is empty"}
          </span>
        )}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Stat label={locale === "zh" ? "第一类比例" : "Share of A"} value={p.toFixed(2)} />
        <Stat label={locale === "zh" ? "熵（比特）" : "Entropy (bits)"} value={H.toFixed(3)} />
      </div>
    </PlaygroundFrame>
  );
}

export function ForestPlayground() {
  const { locale } = useI18n();
  const [n, setN] = useState(11);
  const [p, setP] = useState(0.6);
  const majority = binomialMajority(n, p);

  return (
    <PlaygroundFrame
      title={locale === "zh" ? "陪审团多数表决" : "Jury majority vote"}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <SliderRow
          label={locale === "zh" ? "树的数量（奇数）" : "Trees (odd)"}
          value={n}
          min={1}
          max={31}
          step={2}
          onChange={(v) => setN(v % 2 === 0 ? v + 1 : v)}
        />
        <SliderRow
          label={locale === "zh" ? "单树准确率" : "Per-tree accuracy"}
          value={p}
          min={0.51}
          max={0.85}
          step={0.01}
          onChange={setP}
          display={p.toFixed(2)}
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {Array.from({ length: n }, (_, i) => (
          <span
            key={i}
            className="size-8 rounded-md bg-chart-2/80"
            style={{ opacity: 0.4 + (i / n) * 0.6 }}
          />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Stat
          label={locale === "zh" ? "单树" : "One tree"}
          value={`${(p * 100).toFixed(0)}%`}
        />
        <Stat
          label={locale === "zh" ? "多数表决" : "Majority"}
          value={`${(majority * 100).toFixed(1)}%`}
        />
      </div>
    </PlaygroundFrame>
  );
}

export function SplitPlayground() {
  const { locale } = useI18n();
  const [train, setTrain] = useState(60);
  const [val, setVal] = useState(20);
  const test = Math.max(0, 100 - train - val);
  const complexity = 1 - train / 100;
  const trainErr = 0.04 + (1 - train / 100) * 0.08;
  const valErr = 0.08 + Math.abs(train - 70) / 220 + complexity * 0.12;

  return (
    <PlaygroundFrame
      title={locale === "zh" ? "三份数据怎么切" : "How to cut three sets"}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <SliderRow
          label={locale === "zh" ? "训练集 %" : "Train %"}
          value={train}
          min={40}
          max={80}
          onChange={(v) => {
            setTrain(v);
            if (v + val > 95) setVal(95 - v);
          }}
        />
        <SliderRow
          label={locale === "zh" ? "验证集 %" : "Validation %"}
          value={val}
          min={5}
          max={40}
          onChange={(v) => {
            setVal(v);
            if (train + v > 95) setTrain(95 - v);
          }}
        />
      </div>
      <div className="mt-4 flex h-10 overflow-hidden rounded-full text-[11px] font-medium text-primary-foreground">
        <div className="flex items-center justify-center bg-chart-1" style={{ width: `${train}%` }}>
          {locale === "zh" ? "训练" : "Train"} {train}%
        </div>
        <div className="flex items-center justify-center bg-chart-2" style={{ width: `${val}%` }}>
          {locale === "zh" ? "验证" : "Val"} {val}%
        </div>
        <div className="flex items-center justify-center bg-chart-3" style={{ width: `${test}%` }}>
          {locale === "zh" ? "测试" : "Test"} {test}%
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Stat
          label={locale === "zh" ? "训练误差（示意）" : "Train error (toy)"}
          value={trainErr.toFixed(3)}
        />
        <Stat
          label={locale === "zh" ? "验证误差（示意）" : "Val error (toy)"}
          value={valErr.toFixed(3)}
        />
      </div>
    </PlaygroundFrame>
  );
}

export function CvPlayground() {
  const { locale } = useI18n();
  const [k, setK] = useState(5);
  const [fold, setFold] = useState(0);
  const scores = useMemo(
    () => Array.from({ length: 10 }, (_, i) => 0.18 + ((i * 17) % 9) / 100),
    [],
  );
  const used = scores.slice(0, k);
  const mean = used.reduce((a, b) => a + b, 0) / k;

  return (
    <PlaygroundFrame title={locale === "zh" ? "K 折轮转" : "K-fold rotation"}>
      <SliderRow
        label="K"
        value={k}
        min={3}
        max={10}
        onChange={(v) => {
          setK(v);
          setFold(0);
        }}
      />
      <div className="mt-4 grid grid-cols-5 gap-1.5 sm:grid-cols-10">
        {Array.from({ length: k }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setFold(i)}
            className={`h-14 rounded-lg text-xs ${
              i === fold ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            {i === fold
              ? locale === "zh"
                ? "验证"
                : "Val"
              : locale === "zh"
                ? "训练"
                : "Train"}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm">
        {locale === "zh" ? "当前折误差" : "Fold error"}{" "}
        <span className="font-mono">{used[fold]?.toFixed(3)}</span>
        {" · "}
        {locale === "zh" ? "CV 平均" : "CV mean"}{" "}
        <span className="font-mono">{mean.toFixed(3)}</span>
      </p>
    </PlaygroundFrame>
  );
}

export function BiasVariancePlayground() {
  const { locale } = useI18n();
  const [c, setC] = useState(5);
  const xs = linspace(1, 12, 12);
  const bias = xs.map((x) => 0.55 * Math.exp(-0.28 * x) + 0.04);
  const variance = xs.map((x) => 0.02 + 0.018 * (x - 1) ** 1.4);
  const test = xs.map((_, i) => bias[i] + variance[i] + 0.05);
  const W = 520;
  const H = 240;
  const pad = 30;
  const xTo = (x: number) => pad + ((x - 1) / 11) * (W - pad * 2);
  const yTo = (y: number) => H - pad - (y / 0.9) * (H - pad * 2);
  const path = (arr: number[]) =>
    xs.map((x, i) => `${xTo(x)},${yTo(arr[i])}`).join(" ");

  return (
    <PlaygroundFrame
      title={locale === "zh" ? "复杂度轴上的 U 形" : "U-curve vs complexity"}
    >
      <SliderRow
        label={locale === "zh" ? "模型复杂度" : "Complexity"}
        value={c}
        min={1}
        max={12}
        onChange={setC}
      />
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 h-auto w-full rounded-xl bg-muted/40">
        <polyline fill="none" stroke="var(--chart-1)" strokeWidth={2} points={path(bias)} />
        <polyline fill="none" stroke="var(--chart-3)" strokeWidth={2} points={path(variance)} />
        <polyline fill="none" stroke="var(--chart-2)" strokeWidth={2.5} points={path(test)} />
        <line
          x1={xTo(c)}
          x2={xTo(c)}
          y1={pad}
          y2={H - pad}
          className="stroke-primary"
          strokeDasharray="4 3"
        />
        <circle cx={xTo(c)} cy={yTo(test[c - 1])} r={5} className="fill-primary" />
      </svg>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="text-chart-1">Bias²</span>
        <span className="text-chart-3">Variance</span>
        <span className="text-chart-2">{locale === "zh" ? "测试误差" : "Test error"}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Stat label="Bias²" value={bias[c - 1].toFixed(3)} />
        <Stat label="Var" value={variance[c - 1].toFixed(3)} />
        <Stat label="Test" value={test[c - 1].toFixed(3)} />
      </div>
    </PlaygroundFrame>
  );
}

export function DoubleDescentPlayground() {
  const { locale } = useI18n();
  const [p, setP] = useState(12);
  const n = 20;
  const xs = linspace(2, 60, 40);
  const train = xs.map((x) => (x < n ? 0.35 * ((n - x) / n) ** 1.2 : 0));
  const test = xs.map((x) => {
    const peak = Math.exp(-((x - n) ** 2) / 18) * 0.55;
    const first = 0.22 + 0.25 * Math.exp(-x / 8);
    const second = x > n ? 0.18 * Math.exp(-(x - n) / 22) : 0.12;
    return first + peak + second * (x > n ? 1 : 0);
  });
  const W = 520;
  const H = 240;
  const pad = 30;
  const xTo = (x: number) => pad + ((x - 2) / 58) * (W - pad * 2);
  const yTo = (y: number) => H - pad - (y / 0.95) * (H - pad * 2);

  const idx = xs.reduce(
    (best, x, i) => (Math.abs(x - p) < Math.abs(xs[best] - p) ? i : best),
    0,
  );

  return (
    <PlaygroundFrame
      title={locale === "zh" ? "插值点两侧的误差" : "Error around interpolation"}
    >
      <SliderRow
        label={locale === "zh" ? "参数量（示意）" : "Parameters (toy)"}
        value={p}
        min={2}
        max={60}
        onChange={setP}
      />
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 h-auto w-full rounded-xl bg-muted/40">
        <line
          x1={xTo(n)}
          x2={xTo(n)}
          y1={pad}
          y2={H - pad}
          className="stroke-border"
          strokeDasharray="5 4"
        />
        <polyline
          fill="none"
          stroke="var(--chart-4)"
          strokeWidth={2}
          points={xs.map((x, i) => `${xTo(x)},${yTo(train[i])}`).join(" ")}
        />
        <polyline
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          points={xs.map((x, i) => `${xTo(x)},${yTo(test[i])}`).join(" ")}
        />
        <circle cx={xTo(xs[idx])} cy={yTo(test[idx])} r={5} className="fill-primary" />
        <text x={xTo(n) + 6} y={pad + 12} className="fill-muted-foreground text-[10px]">
          n = {n}
        </text>
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Stat label={locale === "zh" ? "训练误差" : "Train"} value={train[idx].toFixed(3)} />
        <Stat label={locale === "zh" ? "测试误差" : "Test"} value={test[idx].toFixed(3)} />
      </div>
    </PlaygroundFrame>
  );
}

export function PolyDescentPlayground() {
  const { locale } = useI18n();
  const [degree, setDegree] = useState(4);
  const truth = (x: number) => Math.sin(2.2 * x) + 0.25 * x;
  const trainX = useMemo(() => linspace(-1, 1, 12), []);
  const testX = useMemo(() => linspace(-1.05, 1.05, 40), []);
  const trainY = useMemo(
    () => trainX.map((x, i) => truth(x) + (i % 3 === 0 ? 0.18 : -0.08)),
    [trainX],
  );
  const coeffs = polyFit(trainX, trainY, degree);
  const trainHat = trainX.map((x) => polyEval(coeffs, x));
  const testY = testX.map(truth);
  const testHat = testX.map((x) => polyEval(coeffs, x));
  const W = 520;
  const H = 260;
  const pad = 24;
  const xTo = (x: number) => pad + ((x + 1.2) / 2.4) * (W - pad * 2);
  const yTo = (y: number) => H / 2 - y * 48;

  return (
    <PlaygroundFrame
      title={locale === "zh" ? "多项式次数与插值" : "Polynomial degree and interpolation"}
    >
      <SliderRow
        label={locale === "zh" ? "次数 d" : "Degree d"}
        value={degree}
        min={1}
        max={14}
        onChange={setDegree}
      />
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 h-auto w-full rounded-xl bg-muted/40">
        <polyline
          fill="none"
          className="stroke-muted-foreground/40"
          strokeDasharray="4 4"
          points={testX.map((x) => `${xTo(x)},${yTo(truth(x))}`).join(" ")}
        />
        <polyline
          fill="none"
          className="stroke-primary"
          strokeWidth={2.2}
          points={linspace(-1.15, 1.15, 80)
            .map((x) => `${xTo(x)},${yTo(clamp(polyEval(coeffs, x), -3, 3))}`)
            .join(" ")}
        />
        {trainX.map((x, i) => (
          <circle key={i} cx={xTo(x)} cy={yTo(trainY[i])} r={4.5} className="fill-foreground" />
        ))}
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Stat label="Train MSE" value={mse(trainY, trainHat).toFixed(3)} />
        <Stat label="Test MSE" value={mse(testY, testHat).toFixed(3)} />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {locale === "zh"
          ? `自由度 d+1 = ${degree + 1}，样本 n = 12。在 12 附近训练误差触零，测试误差往往最差。`
          : `Degrees of freedom d+1 = ${degree + 1}, n = 12. Near 12, train error hits zero and test error is often worst.`}
      </p>
    </PlaygroundFrame>
  );
}

export function NetworkPlayground() {
  const { locale } = useI18n();
  const [hidden, setHidden] = useState(3);
  const [act, setAct] = useState(0.6);
  const W = 520;
  const H = 260;
  const inputs = [80, 130, 180];
  const outputs = [130, 180];
  const hiddens = linspace(50, 210, hidden);

  return (
    <PlaygroundFrame
      title={locale === "zh" ? "前向传播示意" : "A forward pass"}
    >
      <SliderRow
        label={locale === "zh" ? "隐藏单元" : "Hidden units"}
        value={hidden}
        min={1}
        max={6}
        onChange={setHidden}
      />
      <SliderRow
        label={locale === "zh" ? "激活强度" : "Activation"}
        value={act}
        min={0.15}
        max={1}
        step={0.01}
        onChange={setAct}
        display={act.toFixed(2)}
      />
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 h-auto w-full rounded-xl bg-muted/40">
        {inputs.map((y, i) =>
          hiddens.map((hy, j) => (
            <line
              key={`ih${i}${j}`}
              x1={70}
              y1={y}
              x2={260}
              y2={hy}
              stroke="var(--chart-1)"
              strokeOpacity={0.25 + act * 0.4}
            />
          )),
        )}
        {hiddens.map((hy, j) =>
          outputs.map((oy, k) => (
            <line
              key={`ho${j}${k}`}
              x1={260}
              y1={hy}
              x2={450}
              y2={oy}
              stroke="var(--chart-2)"
              strokeOpacity={0.25 + act * 0.4}
            />
          )),
        )}
        {inputs.map((y, i) => (
          <circle key={`i${i}`} cx={70} cy={y} r={14} className="fill-chart-5 stroke-background" strokeWidth={3} />
        ))}
        {hiddens.map((y, i) => (
          <circle
            key={`h${i}`}
            cx={260}
            cy={y}
            r={12 + act * 6}
            className="fill-primary stroke-background"
            strokeWidth={3}
            opacity={0.55 + act * 0.45}
          />
        ))}
        {outputs.map((y, i) => (
          <circle key={`o${i}`} cx={450} cy={y} r={14} className="fill-chart-2 stroke-background" strokeWidth={3} />
        ))}
        <text x={70} y={36} textAnchor="middle" className="fill-muted-foreground text-[11px]">
          x
        </text>
        <text x={260} y={36} textAnchor="middle" className="fill-muted-foreground text-[11px]">
          h = σ(Wx+b)
        </text>
        <text x={450} y={36} textAnchor="middle" className="fill-muted-foreground text-[11px]">
          ŷ
        </text>
      </svg>
    </PlaygroundFrame>
  );
}

function bernoulli(p: number) {
  return Math.random() < p ? 1 : 0;
}

function pickArm(eps: number, q: number[]) {
  if (Math.random() < eps) return Math.floor(Math.random() * q.length);
  let best = 0;
  for (let i = 1; i < q.length; i++) if (q[i] > q[best]) best = i;
  return best;
}

export function BanditPlayground() {
  const { locale } = useI18n();
  const [eps, setEps] = useState(0.15);
  const trueMean = useRef([0.15, 0.35, 0.55, 0.4, 0.7]);
  const [counts, setCounts] = useState([0, 0, 0, 0, 0]);
  const [sums, setSums] = useState([0, 0, 0, 0, 0]);
  const [reward, setReward] = useState(0);
  const [last, setLast] = useState<number | null>(null);
  const q = sums.map((s, i) => (counts[i] ? s / counts[i] : 0));

  function applyPull(arm: number, r: number) {
    setCounts((c) => c.map((v, i) => (i === arm ? v + 1 : v)));
    setSums((s) => s.map((v, i) => (i === arm ? v + r : v)));
    setReward((x) => x + r);
    setLast(arm);
  }

  return (
    <PlaygroundFrame title={locale === "zh" ? "五臂老虎机" : "Five-armed bandit"}>
      <SliderRow
        label="ε"
        value={eps}
        min={0}
        max={0.6}
        step={0.01}
        onChange={setEps}
        display={eps.toFixed(2)}
      />
      <div className="mt-4 grid grid-cols-5 gap-2">
        {q.map((v, i) => (
          <button
            key={i}
            type="button"
            onClick={() => applyPull(i, bernoulli(trueMean.current[i]))}
            className={`rounded-xl border p-3 text-center ${
              last === i ? "border-primary bg-primary/10" : "bg-muted/50"
            }`}
          >
            <div className="text-xs text-muted-foreground">#{i + 1}</div>
            <div className="font-mono text-sm">Q={v.toFixed(2)}</div>
            <div className="text-[10px] text-muted-foreground">{counts[i]} pulls</div>
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Stat
          label={locale === "zh" ? "累积奖励" : "Cumulative reward"}
          value={String(reward)}
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              const arm = pickArm(eps, q);
              applyPull(arm, bernoulli(trueMean.current[arm]));
            }}
          >
            {locale === "zh" ? "ε-greedy 拉一次" : "ε-greedy pull"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setCounts([0, 0, 0, 0, 0]);
              setSums([0, 0, 0, 0, 0]);
              setReward(0);
              setLast(null);
            }}
          >
            {locale === "zh" ? "重置" : "Reset"}
          </Button>
        </div>
      </div>
    </PlaygroundFrame>
  );
}

function makeGroup(shift: number) {
  const basePos = [
    0.9, 0.84, 0.78, 0.72, 0.69, 0.66, 0.63, 0.6, 0.57, 0.54, 0.51, 0.48, 0.45,
    0.42, 0.39, 0.36, 0.86, 0.8, 0.74, 0.68,
  ];
  const baseNeg = [
    0.12, 0.18, 0.22, 0.26, 0.3, 0.33, 0.36, 0.39, 0.42, 0.45, 0.48, 0.52, 0.2,
    0.24, 0.28, 0.32, 0.35, 0.41, 0.16, 0.5,
  ];
  return {
    pos: basePos.map((s) => clamp(s + shift, 0.02, 0.98)),
    neg: baseNeg.map((s) => clamp(s + shift * 0.4, 0.02, 0.98)),
  };
}

export function FairnessPlayground() {
  const { locale } = useI18n();
  const [tA, setTA] = useState(0.5);
  const [tB, setTB] = useState(0.5);
  const groupA = useMemo(() => makeGroup(0.08), []);
  const groupB = useMemo(() => makeGroup(-0.04), []);
  function rates(g: { pos: number[]; neg: number[] }, t: number) {
    const tp = g.pos.filter((s) => s >= t).length / g.pos.length;
    const fp = g.neg.filter((s) => s >= t).length / g.neg.length;
    return { tpr: tp, fpr: fp };
  }
  const a = rates(groupA, tA);
  const b = rates(groupB, tB);

  return (
    <PlaygroundFrame
      title={locale === "zh" ? "两个群体的工作点" : "Two groups, two operating points"}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <SliderRow
          label={locale === "zh" ? "群体 A 阈值" : "Group A threshold"}
          value={tA}
          min={0.15}
          max={0.85}
          step={0.01}
          onChange={setTA}
          display={tA.toFixed(2)}
        />
        <SliderRow
          label={locale === "zh" ? "群体 B 阈值" : "Group B threshold"}
          value={tB}
          min={0.15}
          max={0.85}
          step={0.01}
          onChange={setTB}
          display={tB.toFixed(2)}
        />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border p-3">
          <div className="text-xs text-muted-foreground">A</div>
          <div className="font-mono text-sm">
            TPR {a.tpr.toFixed(2)} · FPR {a.fpr.toFixed(2)}
          </div>
        </div>
        <div className="rounded-xl border p-3">
          <div className="text-xs text-muted-foreground">B</div>
          <div className="font-mono text-sm">
            TPR {b.tpr.toFixed(2)} · FPR {b.fpr.toFixed(2)}
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {locale === "zh"
          ? `TPR 差 ${Math.abs(a.tpr - b.tpr).toFixed(2)}，FPR 差 ${Math.abs(a.fpr - b.fpr).toFixed(2)}。两差都接近 0 时，更接近几率均等。`
          : `ΔTPR ${Math.abs(a.tpr - b.tpr).toFixed(2)}, ΔFPR ${Math.abs(a.fpr - b.fpr).toFixed(2)}. Both near 0 is closer to equality of odds.`}
      </p>
    </PlaygroundFrame>
  );
}

const registry: Record<string, () => React.ReactNode> = {
  "linear-regression": () => <LinearRegressionPlayground />,
  "logistic-regression": () => <LogisticPlayground />,
  "roc-auc": () => <RocPlayground />,
  "precision-recall": () => <PrecisionRecallPlayground />,
  "decision-tree": () => <EntropyPlayground />,
  "random-forest": () => <ForestPlayground />,
  "train-test-validation": () => <SplitPlayground />,
  "cross-validation": () => <CvPlayground />,
  "bias-variance": () => <BiasVariancePlayground />,
  "double-descent": () => <DoubleDescentPlayground />,
  "double-descent-2": () => <PolyDescentPlayground />,
  "neural-networks": () => <NetworkPlayground />,
  "reinforcement-learning": () => <BanditPlayground />,
  "equality-of-odds": () => <FairnessPlayground />,
};

export function ArticlePlayground({ slug }: { slug: string }) {
  const node = registry[slug];
  if (!node) return null;
  return <>{node()}</>;
}
