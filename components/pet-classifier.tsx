"use client";

import { useMemo, useRef, useState } from "react";
import { PETS, SPLIT_COLOR, type Pet, type SplitName } from "@/lib/pets";
import { clamp, fitLogistic, logisticProb, mean } from "@/lib/math";
import { useI18n } from "@/lib/i18n";

export type FeatureSet = "none" | "weight" | "fluffiness" | "both";
export type ViewSplit = "all" | SplitName;

const W_MIN = -1.2;
const W_MAX = 8.4;
const F_MIN = -2.2;
const F_MAX = 9.2;
const SVG_W = 560;
const SVG_H = 340;
const PAD = 42;

function xOf(weight: number) {
  return PAD + ((weight - W_MIN) / (W_MAX - W_MIN)) * (SVG_W - PAD * 2);
}
function yOf(fluff: number) {
  return SVG_H - PAD - ((fluff - F_MIN) / (F_MAX - F_MIN)) * (SVG_H - PAD * 2);
}
function fromSvg(cx: number, cy: number) {
  return {
    weight: clamp(W_MIN + ((cx - PAD) / (SVG_W - PAD * 2)) * (W_MAX - W_MIN), W_MIN, W_MAX),
    fluffiness: clamp(
      F_MIN + ((SVG_H - PAD - cy) / (SVG_H - PAD * 2)) * (F_MAX - F_MIN),
      F_MIN,
      F_MAX,
    ),
  };
}

function stdev(xs: number[]) {
  const m = mean(xs);
  const v = mean(xs.map((x) => (x - m) ** 2));
  return Math.sqrt(v) || 1;
}

function featuresFor(p: Pet, set: FeatureSet, mw: number, sw: number, mf: number, sf: number) {
  const wn = (p.weight - mw) / sw;
  const fn = (p.fluffiness - mf) / sf;
  if (set === "none") return [1];
  if (set === "weight") return [1, wn];
  if (set === "fluffiness") return [1, fn];
  return [1, wn, fn];
}

function fitOnTrain(pets: Pet[], set: FeatureSet) {
  const train = pets.filter((p) => p.split === "train");
  const mw = mean(train.map((p) => p.weight));
  const sw = stdev(train.map((p) => p.weight));
  const mf = mean(train.map((p) => p.fluffiness));
  const sf = stdev(train.map((p) => p.fluffiness));
  const X = train.map((p) => featuresFor(p, set, mw, sw, mf, sf));
  const y = train.map((p) => (p.animal === "dog" ? 1 : 0));
  const w = fitLogistic(X, y);
  return { w, mw, sw, mf, sf };
}

function accuracy(pets: Pet[], split: SplitName, model: ReturnType<typeof fitOnTrain>, set: FeatureSet) {
  const rows = pets.filter((p) => p.split === split);
  if (!rows.length) return 0;
  let ok = 0;
  for (const p of rows) {
    const x = featuresFor(p, set, model.mw, model.sw, model.mf, model.sf);
    const pred = logisticProb(model.w, x) >= 0.5 ? "dog" : "cat";
    if (pred === p.animal) ok += 1;
  }
  return ok / rows.length;
}

function CatMark() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M-7 -2 L-5 -11 L-1 -4" />
      <path d="M7 -2 L5 -11 L1 -4" />
      <circle cx="0" cy="1" r="7.2" />
      <path d="M-2 2.5 L0 3.5 L2 2.5" />
    </g>
  );
}

function DogMark() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M-8 -1 Q-10 -8 -4 -6" />
      <path d="M8 -1 Q10 -8 4 -6" />
      <circle cx="0" cy="1" r="7.2" />
      <path d="M-1.5 3 L1.5 3" />
    </g>
  );
}

export function PetClassifier() {
  const { locale } = useI18n();
  const zh = locale === "zh";
  const [pets, setPets] = useState<Pet[]>(PETS);
  const [feature, setFeature] = useState<FeatureSet>("weight");
  const [view, setView] = useState<ViewSplit>("all");
  const drag = useRef<{ id: number } | null>(null);

  const sets: FeatureSet[] = ["none", "weight", "fluffiness", "both"];
  const models = useMemo(() => {
    const out = {} as Record<FeatureSet, ReturnType<typeof fitOnTrain>>;
    for (const s of sets) out[s] = fitOnTrain(pets, s);
    return out;
  }, [pets]);

  const table = useMemo(() => {
    return sets.map((s) => ({
      set: s,
      train: accuracy(pets, "train", models[s], s),
      validation: accuracy(pets, "validation", models[s], s),
      test: accuracy(pets, "test", models[s], s),
    }));
  }, [pets, models]);

  const bestVal = Math.max(...table.map((r) => r.validation));
  const model = models[feature];

  const boundary = useMemo(() => {
    const { w, mw, sw, mf, sf } = model;
    if (feature === "none" || w.length === 0) return null;
    if (feature === "weight") {
      const wn = w.length > 1 && Math.abs(w[1]) > 1e-6 ? -w[0] / w[1] : 0;
      const weight = mw + wn * sw;
      const x = xOf(weight);
      return { type: "v" as const, x };
    }
    if (feature === "fluffiness") {
      const fn = w.length > 1 && Math.abs(w[1]) > 1e-6 ? -w[0] / w[1] : 0;
      const fluff = mf + fn * sf;
      const y = yOf(fluff);
      return { type: "h" as const, y };
    }
    const w0 = w[0] ?? 0;
    const w1 = w[1] ?? 0;
    const w2 = w[2] ?? 0;
    if (Math.abs(w2) < 1e-6) {
      const wn = Math.abs(w1) > 1e-6 ? -w0 / w1 : 0;
      return { type: "v" as const, x: xOf(mw + wn * sw) };
    }
    const pts = [W_MIN, W_MAX].map((weight) => {
      const wn = (weight - mw) / sw;
      const fn = -(w0 + w1 * wn) / w2;
      return { x: xOf(weight), y: yOf(mf + fn * sf) };
    });
    return { type: "d" as const, a: pts[0], b: pts[1] };
  }, [model, feature]);

  function movePet(id: number, cx: number, cy: number) {
    const next = fromSvg(cx, cy);
    setPets((ps) => ps.map((p) => (p.id === id ? { ...p, ...next } : p)));
  }

  const featureLabel: Record<FeatureSet, string> = {
    none: zh ? "无" : "None",
    weight: zh ? "体重" : "Weight",
    fluffiness: zh ? "毛量" : "Fluffiness",
    both: zh ? "两者" : "Both",
  };
  const viewLabel: Record<ViewSplit, string> = {
    all: zh ? "全部" : "All",
    train: zh ? "训练" : "Train",
    validation: zh ? "验证" : "Val",
    test: zh ? "测试" : "Test",
  };

  return (
    <div className="border border-foreground/15 bg-background">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/15 px-4 py-3">
        <p className="text-xs tracking-wide text-muted-foreground">
          {zh ? "选择特征，看逻辑回归的分界线。拖动动物会改训练结果。" : "Pick a feature. Drag animals — the boundary retrains on the training set."}
        </p>
        <button
          type="button"
          className="text-xs underline underline-offset-4"
          onClick={() => setPets(PETS)}
        >
          {zh ? "重置" : "Reset"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 px-4 py-3">
        <span className="self-center text-xs text-muted-foreground">{zh ? "特征" : "Features"}</span>
        {sets.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFeature(s)}
            className={`px-3 py-1 text-xs ${
              feature === s
                ? "bg-foreground text-background"
                : "border border-foreground/30 hover:border-foreground"
            }`}
          >
            {featureLabel[s]}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 px-4 pb-3">
        <span className="self-center text-xs text-muted-foreground">{zh ? "查看" : "View"}</span>
        {(["all", "train", "validation", "test"] as ViewSplit[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setView(s)}
            className={`px-3 py-1 text-xs ${
              view === s
                ? "bg-foreground text-background"
                : "border border-foreground/30 hover:border-foreground"
            }`}
          >
            {viewLabel[s]}
          </button>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="h-auto w-full touch-none select-none bg-[#fafafa] dark:bg-[#161616]"
        onPointerMove={(e) => {
          if (!drag.current) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const cx = ((e.clientX - rect.left) / rect.width) * SVG_W;
          const cy = ((e.clientY - rect.top) / rect.height) * SVG_H;
          movePet(drag.current.id, cx, cy);
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerLeave={() => {
          drag.current = null;
        }}
      >
        <line x1={PAD} x2={SVG_W - PAD} y1={SVG_H - PAD} y2={SVG_H - PAD} className="stroke-foreground/25" />
        <line x1={PAD} x2={PAD} y1={PAD} y2={SVG_H - PAD} className="stroke-foreground/25" />
        <text x={SVG_W / 2} y={SVG_H - 12} textAnchor="middle" className="fill-foreground/50" fontSize="11">
          {zh ? "体重" : "weight"}
        </text>
        <text
          x={16}
          y={SVG_H / 2}
          textAnchor="middle"
          className="fill-foreground/50"
          fontSize="11"
          transform={`rotate(-90 16 ${SVG_H / 2})`}
        >
          {zh ? "毛量" : "fluffiness"}
        </text>

        {boundary?.type === "v" ? (
          <line x1={boundary.x} x2={boundary.x} y1={PAD} y2={SVG_H - PAD} className="stroke-foreground" strokeWidth="1.8" />
        ) : null}
        {boundary?.type === "h" ? (
          <line x1={PAD} x2={SVG_W - PAD} y1={boundary.y} y2={boundary.y} className="stroke-foreground" strokeWidth="1.8" />
        ) : null}
        {boundary?.type === "d" ? (
          <line
            x1={boundary.a.x}
            y1={boundary.a.y}
            x2={boundary.b.x}
            y2={boundary.b.y}
            className="stroke-foreground"
            strokeWidth="1.8"
          />
        ) : null}

        {pets.map((p) => {
          const active = view === "all" || p.split === view;
          const cx = xOf(p.weight);
          const cy = yOf(p.fluffiness);
          return (
            <g
              key={p.id}
              transform={`translate(${cx} ${cy})`}
              opacity={active ? 1 : 0.18}
              className="cursor-grab text-foreground"
              onPointerDown={(e) => {
                e.preventDefault();
                (e.currentTarget as SVGGElement).setPointerCapture(e.pointerId);
                drag.current = { id: p.id };
              }}
            >
              <circle r="11" fill={SPLIT_COLOR[p.split]} opacity="0.18" />
              {p.animal === "cat" ? <CatMark /> : <DogMark />}
            </g>
          );
        })}
      </svg>

      <div className="flex flex-wrap gap-4 px-4 py-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full" style={{ background: SPLIT_COLOR.train }} />
          {zh ? "训练" : "Train"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full" style={{ background: SPLIT_COLOR.validation }} />
          {zh ? "验证" : "Validation"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full" style={{ background: SPLIT_COLOR.test }} />
          {zh ? "测试" : "Test"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <svg viewBox="-12 -16 24 28" className="h-5 w-5">
            <CatMark />
          </svg>
          {zh ? "猫" : "Cat"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <svg viewBox="-12 -16 24 28" className="h-5 w-5">
            <DogMark />
          </svg>
          {zh ? "狗" : "Dog"}
        </span>
      </div>

      <div className="overflow-x-auto border-t border-foreground/15">
        <table className="w-full text-left text-sm">
          <thead className="text-xs tracking-wide text-muted-foreground">
            <tr className="border-b border-foreground/10">
              <th className="px-4 py-2 font-normal">{zh ? "模型" : "Model"}</th>
              <th className="px-4 py-2 font-normal">{zh ? "训练" : "Train"}</th>
              <th className="px-4 py-2 font-normal">{zh ? "验证" : "Val"}</th>
              <th className="px-4 py-2 font-normal">{zh ? "测试" : "Test"}</th>
            </tr>
          </thead>
          <tbody>
            {table.map((row) => {
              const on = row.set === feature;
              const best = row.validation === bestVal;
              return (
                <tr
                  key={row.set}
                  className={`cursor-pointer border-b border-foreground/5 ${on ? "bg-foreground text-background" : "hover:bg-muted/60"}`}
                  onClick={() => setFeature(row.set)}
                >
                  <td className="px-4 py-2">
                    {featureLabel[row.set]}
                    {best && !on ? (
                      <span className="ml-2 text-[10px] tracking-wide text-muted-foreground">
                        {zh ? "验证最优" : "best val"}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-2 font-mono tabular-nums">{(row.train * 100).toFixed(1)}%</td>
                  <td className="px-4 py-2 font-mono tabular-nums">{(row.validation * 100).toFixed(1)}%</td>
                  <td className="px-4 py-2 font-mono tabular-nums">{(row.test * 100).toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
