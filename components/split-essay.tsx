"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CatIcon, DogIcon } from "@/components/pet-icons";
import { MarkReadButton } from "@/components/mark-read-button";
import type { Article, ArticleSection, LocaleText } from "@/lib/articles";
import { clamp, fitLogistic, logisticProb, mean } from "@/lib/math";
import { PETS, SPLIT_COLOR, type Pet, type SplitName } from "@/lib/pets";
import type { Locale } from "@/lib/messages";

export type FeatureSet = "none" | "weight" | "fluffiness" | "both";

const W_MIN = -1.2;
const W_MAX = 8.4;
const F_MIN = -2.2;
const F_MAX = 9.2;
const SVG_W = 640;
const SVG_H = 420;
const PAD = 52;
const INK = "#232f3e";
const SETS: FeatureSet[] = ["none", "weight", "fluffiness", "both"];

type Stage = 0 | 1 | 2 | 3 | 4 | 5 | 6;

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
  const w = fitLogistic(
    train.map((p) => featuresFor(p, set, mw, sw, mf, sf)),
    train.map((p) => (p.animal === "dog" ? 1 : 0)),
  );
  return { w, mw, sw, mf, sf };
}
function rand(id: number, salt: number) {
  const x = Math.sin(id * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function introPos(p: Pet): { x: number; y: number } {
  const a = rand(p.id, 1) * Math.PI * 2;
  const r = 28 + rand(p.id, 2) * 128;
  return {
    x: SVG_W / 2 + Math.cos(a) * r,
    y: SVG_H / 2 + 8 + Math.sin(a) * r * 0.58,
  };
}

function clusterPos(pets: Pet[]) {
  const groups: Record<SplitName, Pet[]> = { train: [], validation: [], test: [] };
  pets.forEach((p) => groups[p.split].push(p));
  const cx: Record<SplitName, number> = { train: SVG_W * 0.2, validation: SVG_W * 0.5, test: SVG_W * 0.8 };
  const out: Record<number, { x: number; y: number }> = {};
  (Object.keys(groups) as SplitName[]).forEach((k) => {
    const arr = groups[k];
    const cols = Math.ceil(Math.sqrt(arr.length * 1.1));
    arr.forEach((p, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const jitterX = (rand(p.id, 4) - 0.5) * 10;
      const jitterY = (rand(p.id, 5) - 0.5) * 8;
      out[p.id] = {
        x: cx[k] + (c - (cols - 1) / 2) * 34 + jitterX,
        y: SVG_H * 0.46 + (r - 1.4) * 36 + jitterY,
      };
    });
  });
  return out;
}

function useTweenedPositions(
  pets: Pet[],
  targetFor: (p: Pet) => { x: number; y: number },
  key: string,
  live: boolean,
) {
  const [layout, setLayout] = useState<Record<number, { x: number; y: number }>>(() =>
    Object.fromEntries(pets.map((p) => [p.id, targetFor(p)])),
  );
  const fromRef = useRef(layout);

  useEffect(() => {
    if (live) {
      fromRef.current = Object.fromEntries(pets.map((p) => [p.id, targetFor(p)]));
      return;
    }
    const from = fromRef.current;
    const to = Object.fromEntries(pets.map((p) => [p.id, targetFor(p)]));
    let raf = 0;
    const t0 = performance.now();
    const dur = 850;
    const ease = (t: number) => 1 - (1 - t) ** 3;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = ease(t);
      const cur: Record<number, { x: number; y: number }> = {};
      for (const p of pets) {
        const a = from[p.id] ?? to[p.id];
        const b = to[p.id];
        cur[p.id] = { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e };
      }
      setLayout(cur);
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // targetFor is recreated each render; key/live/pets drive the tween.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, live, pets]);

  return layout;
}

function petVisible(split: SplitName, stage: Stage) {
  if (stage <= 1) return true;
  if (stage === 2 || stage === 3) return split === "train";
  if (stage === 4) return split !== "test";
  return true;
}

function counts(pets: Pet[], split: SplitName, model: ReturnType<typeof fitOnTrain>, set: FeatureSet) {
  const rows = pets.filter((p) => p.split === split);
  let catRight = 0;
  let catWrong = 0;
  let dogRight = 0;
  let dogWrong = 0;
  for (const p of rows) {
    const pred = logisticProb(model.w, featuresFor(p, set, model.mw, model.sw, model.mf, model.sf)) >= 0.5 ? "dog" : "cat";
    if (p.animal === "cat") {
      if (pred === "cat") catRight += 1;
      else catWrong += 1;
    } else if (pred === "dog") dogRight += 1;
    else dogWrong += 1;
  }
  const n = rows.length || 1;
  return { catRight, catWrong, dogRight, dogWrong, acc: (catRight + dogRight) / n };
}

const TOC: { id: string; zh: string; en: string }[] = [
  { id: "intro", zh: "引言", en: "Intro" },
  { id: "split", zh: "划分", en: "Split" },
  { id: "train", zh: "训练", en: "Train" },
  { id: "model", zh: "模型", en: "Model" },
  { id: "validation", zh: "验证", en: "Val" },
  { id: "test", zh: "测试", en: "Test" },
  { id: "summary", zh: "小结", en: "Summary" },
];

export function SplitEssay({
  article,
  locale,
  labels,
  prev,
  next,
}: {
  article: Article;
  locale: Locale;
  labels: {
    back: string;
    next: string;
    prev: string;
    markDone: string;
    marked: string;
    sourceNote: string;
    reset: string;
  };
  prev: { slug: string; title: LocaleText } | null;
  next: { slug: string; title: LocaleText } | null;
}) {
  const zh = locale === "zh";
  const [stage, setStage] = useState<Stage>(0);
  const [pets, setPets] = useState<Pet[]>(PETS);
  const [feature, setFeature] = useState<FeatureSet>("weight");
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ id: number } | null>(null);
  const clusters = useMemo(() => clusterPos(PETS), []);

  const models = useMemo(() => {
    const out = {} as Record<FeatureSet, ReturnType<typeof fitOnTrain>>;
    for (const s of SETS) out[s] = fitOnTrain(pets, s);
    return out;
  }, [pets]);
  const model = models[feature];

  const scatter = stage >= 3;
  const showButtons = stage >= 3;
  const showTable = stage >= 4;
  const showAxes = stage >= 3;
  const showClusters = stage === 1 || stage === 2;

  const featureLabel: Record<FeatureSet, string> = {
    none: zh ? "无" : "None",
    weight: zh ? "体重" : "Weight",
    fluffiness: zh ? "毛量" : "Fluffiness",
    both: zh ? "两者" : "Both",
  };

  const boundary = useMemo(() => {
    if (!scatter) return null;
    const { w, mw, sw, mf, sf } = model;
    if (feature === "none" || w.length === 0) return null;
    if (feature === "weight") {
      const wn = w.length > 1 && Math.abs(w[1]) > 1e-6 ? -w[0] / w[1] : 0;
      return { type: "v" as const, x: xOf(mw + wn * sw) };
    }
    if (feature === "fluffiness") {
      const fn = w.length > 1 && Math.abs(w[1]) > 1e-6 ? -w[0] / w[1] : 0;
      return { type: "h" as const, y: yOf(mf + fn * sf) };
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
  }, [model, feature, scatter]);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-split-stage]"));
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!hit) return;
        const i = Number(hit.target.getAttribute("data-split-stage"));
        if (!Number.isNaN(i)) setStage(i as Stage);
      },
      { threshold: [0.45, 0.6, 0.75], rootMargin: "-10% 0px -25% 0px" },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  function pos(p: Pet) {
    if (scatter) return { x: xOf(p.weight), y: yOf(p.fluffiness) };
    if (stage === 0) return introPos(p);
    return clusters[p.id] ?? introPos(p);
  }

  const layout = useTweenedPositions(pets, pos, String(stage), dragging);

  const tableSplits: SplitName[] =
    stage >= 5 ? ["train", "validation", "test"] : stage >= 4 ? ["train", "validation"] : ["train"];

  return (
    <div className="split-essay">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-[3vw] pt-2">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100">
          <ArrowLeft className="size-4" />
          {labels.back}
        </Link>
        <nav className="hidden flex-wrap justify-end gap-x-4 gap-y-1 text-[11px] tracking-wide md:flex">
          {TOC.map((item, i) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={stage === i ? "font-semibold opacity-100" : "opacity-45 hover:opacity-80"}
            >
              {zh ? item.zh : item.en}
            </a>
          ))}
        </nav>
      </div>

      <div className="split-scrolly">
        <figure className="split-figure">
          <div
            className="split-buttons"
            style={{ opacity: showButtons ? 1 : 0, pointerEvents: showButtons ? "auto" : "none" }}
          >
            <p>{zh ? "选择特征" : "Select feature"}</p>
            {SETS.map((s) => (
              <button
                key={s}
                type="button"
                className={feature === s ? "active" : ""}
                onClick={() => setFeature(s)}
              >
                {featureLabel[s]}
              </button>
            ))}
            <button type="button" className="quiet" onClick={() => setPets(PETS)}>
              {labels.reset}
            </button>
          </div>

          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="split-chart"
            onPointerMove={(e) => {
              if (!drag.current || !scatter) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const cx = ((e.clientX - rect.left) / rect.width) * SVG_W;
              const cy = ((e.clientY - rect.top) / rect.height) * SVG_H;
              const next = fromSvg(cx, cy);
              const id = drag.current.id;
              setPets((ps) => ps.map((p) => (p.id === id ? { ...p, ...next } : p)));
            }}
            onPointerUp={() => {
              drag.current = null;
              setDragging(false);
            }}
            onPointerLeave={() => {
              drag.current = null;
              setDragging(false);
            }}
          >
            {showClusters
              ? (["train", "validation", "test"] as SplitName[]).map((k) => {
                  const hidden = k !== "train" && stage === 2;
                  const cx = k === "train" ? SVG_W * 0.2 : k === "validation" ? SVG_W * 0.5 : SVG_W * 0.8;
                  return (
                    <g key={k} opacity={hidden ? 0 : 1} className="split-fade">
                      <rect
                        x={cx - 92}
                        y={SVG_H * 0.22}
                        width="184"
                        height="250"
                        rx="18"
                        fill="transparent"
                        stroke={SPLIT_COLOR[k]}
                        strokeWidth="2"
                      />
                      <text
                        x={cx}
                        y={SVG_H * 0.22 + 28}
                        textAnchor="middle"
                        fill={SPLIT_COLOR[k]}
                        fontSize="16"
                        fontWeight="700"
                        fontFamily="var(--font-outfit), sans-serif"
                      >
                        {k === "train" ? (zh ? "训练集" : "Training") : k === "validation" ? (zh ? "验证集" : "Validation") : zh ? "测试集" : "Test"}
                      </text>
                    </g>
                  );
                })
              : null}

            {showAxes ? (
              <g className="split-fade">
                <line x1={PAD} x2={SVG_W - PAD} y1={SVG_H - PAD} y2={SVG_H - PAD} stroke={INK} strokeOpacity="0.35" />
                <line x1={PAD} x2={PAD} y1={PAD} y2={SVG_H - PAD} stroke={INK} strokeOpacity="0.35" />
                <text x={SVG_W / 2} y={SVG_H - 14} textAnchor="middle" fill={INK} fontSize="13" opacity="0.7">
                  {zh ? "体重 weight" : "weight"}
                </text>
                <text
                  x={16}
                  y={SVG_H / 2}
                  textAnchor="middle"
                  fill={INK}
                  fontSize="13"
                  opacity="0.7"
                  transform={`rotate(-90 16 ${SVG_H / 2})`}
                >
                  {zh ? "毛量 fluffiness" : "fluffiness"}
                </text>
              </g>
            ) : null}

            {boundary?.type === "v" ? (
              <line x1={boundary.x} x2={boundary.x} y1={PAD} y2={SVG_H - PAD} stroke={INK} strokeWidth="2" />
            ) : null}
            {boundary?.type === "h" ? (
              <line x1={PAD} x2={SVG_W - PAD} y1={boundary.y} y2={boundary.y} stroke={INK} strokeWidth="2" />
            ) : null}
            {boundary?.type === "d" ? (
              <line
                x1={boundary.a.x}
                y1={boundary.a.y}
                x2={boundary.b.x}
                y2={boundary.b.y}
                stroke={INK}
                strokeWidth="2"
              />
            ) : null}

            {pets.map((p) => {
              const { x, y } = dragging ? pos(p) : (layout[p.id] ?? pos(p));
              const on = petVisible(p.split, stage);
              const fill = stage === 0 ? INK : SPLIT_COLOR[p.split];
              return (
                <g
                  key={p.id}
                  className="split-pet"
                  transform={`translate(${x} ${y})`}
                  opacity={on ? 1 : 0}
                  style={{
                    pointerEvents: on && scatter ? "auto" : "none",
                    cursor: scatter ? "grab" : "default",
                  }}
                  onPointerDown={(e) => {
                    if (!scatter) return;
                    e.preventDefault();
                    (e.currentTarget as SVGGElement).setPointerCapture(e.pointerId);
                    drag.current = { id: p.id };
                    setDragging(true);
                  }}
                >
                  <g transform="translate(-17 -17)">
                    {p.animal === "cat" ? <CatIcon fill={fill} size={34} /> : <DogIcon fill={fill} size={34} />}
                  </g>
                </g>
              );
            })}
          </svg>

          <div
            className="split-table-wrap"
            style={{ opacity: showTable ? 1 : 0, pointerEvents: showTable ? "auto" : "none" }}
          >
            <table>
              <thead>
                <tr>
                  <th>{zh ? "数据集" : "dataset"}</th>
                  <th>{zh ? "特征" : "feature"}</th>
                  <th>{zh ? "猫对" : "cat right"}</th>
                  <th>{zh ? "猫错" : "cat wrong"}</th>
                  <th>{zh ? "狗对" : "dog right"}</th>
                  <th>{zh ? "狗错" : "dog wrong"}</th>
                  <th>{zh ? "准确率" : "accuracy"}</th>
                </tr>
              </thead>
              <tbody>
                {tableSplits.map((split) => {
                  const row = counts(pets, split, model, feature);
                  return (
                    <tr key={split}>
                      <td>{split === "train" ? (zh ? "训练" : "train") : split === "validation" ? (zh ? "验证" : "validation") : zh ? "测试" : "test"}</td>
                      <td>{featureLabel[feature]}</td>
                      <td>{row.catRight}</td>
                      <td>{row.catWrong}</td>
                      <td>{row.dogRight}</td>
                      <td>{row.dogWrong}</td>
                      <td>{(row.acc * 100).toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </figure>

        <div className="split-article">
          {article.sections.map((section, i) => (
            <EssaySection
              key={section.id}
              section={section}
              locale={locale}
              index={i as Stage}
              featureLabel={featureLabel}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-[4vw] pb-20 pt-8">
        <p className="text-center text-3xl">🐾</p>
        <p className="mt-4 text-center text-xs leading-6 opacity-60">
          {zh
            ? "改编自 MLU-Explain · Train, Test, and Validation Sets（CC BY-SA 4.0）。猫狗图标原作 Adrien Coquet、Maurício Brito。"
            : "Adapted from MLU-Explain · Train, Test, and Validation Sets (CC BY-SA 4.0). Animal icons after Adrien Coquet & Maurício Brito."}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#232f3e]/15 pt-6">
          <MarkReadButton slug={article.slug} markLabel={labels.markDone} doneLabel={labels.marked} />
          <a
            className="text-xs underline underline-offset-4 opacity-70"
            href={`https://mlu-explain.github.io/${article.sourcePath}/`}
            target="_blank"
            rel="noreferrer"
          >
            {labels.sourceNote} MLU-Explain
          </a>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {prev ? (
            <Link href={`/articles/${prev.slug}`} className="border border-[#232f3e]/20 p-4 hover:bg-black/5">
              <div className="flex items-center gap-1 text-xs opacity-60">
                <ArrowLeft className="size-3" />
                {labels.prev}
              </div>
              <div className="mt-1 text-lg font-semibold">{prev.title[locale]}</div>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link href={`/articles/${next.slug}`} className="border border-[#232f3e]/20 p-4 text-right hover:bg-black/5">
              <div className="flex items-center justify-end gap-1 text-xs opacity-60">
                {labels.next}
                <ArrowRight className="size-3" />
              </div>
              <div className="mt-1 text-lg font-semibold">{next.title[locale]}</div>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function EssaySection({
  section,
  locale,
  index,
  featureLabel,
}: {
  section: ArticleSection;
  locale: Locale;
  index: Stage;
  featureLabel: Record<FeatureSet, string>;
}) {
  const zh = locale === "zh";
  return (
    <section id={section.id} data-split-stage={index} className="split-step">
      <div className="split-step-card">
        <h2>{section.heading[locale]}</h2>
        {index === 0 ? (
          <p className="split-byline">{zh ? "视觉文章 · 猫、狗、逻辑回归" : "A visual essay · cats, dogs, logistic regression"}</p>
        ) : null}
        {section.body[locale].split("\n").map((para) => (
          <p key={para.slice(0, 48)}>{para}</p>
        ))}
        {index === 0 ? (
          <p className="split-pets-legend">
            <span>
              {zh ? "猫" : "Cats"} <CatIcon fill={INK} size={28} />
            </span>
            <span>
              {zh ? "狗" : "Dogs"} <DogIcon fill={INK} size={28} />
            </span>
          </p>
        ) : null}
        {index === 3 ? (
          <p className="split-hint">
            {zh
              ? `当前特征：${featureLabel.weight} / ${featureLabel.fluffiness} / ${featureLabel.both}。把训练里的动物拖到新位置。`
              : "Pick a feature, then drag training animals to a new place."}
          </p>
        ) : null}
      </div>
    </section>
  );
}
