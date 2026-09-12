"use client";

import { useMemo, useState } from "react";
import { PlaygroundFrame } from "@/components/playground-frame";
import { Slider } from "@/components/ui/slider";
import { useI18n } from "@/lib/i18n";

type Store = {
  id: string;
  name: string;
  kind: "chain" | "solo";
  recency: number;
  freq: number;
  money: number;
};

const STORES: Store[] = [
  { id: "a", name: "城南康宁", kind: "chain", recency: 8, freq: 22, money: 186 },
  { id: "b", name: "大学路回春", kind: "chain", recency: 12, freq: 18, money: 142 },
  { id: "c", name: "新区益民", kind: "chain", recency: 21, freq: 9, money: 98 },
  { id: "d", name: "站前便民", kind: "solo", recency: 6, freq: 14, money: 41 },
  { id: "e", name: "老街张记", kind: "solo", recency: 74, freq: 4, money: 19 },
  { id: "f", name: "河东医保店", kind: "chain", recency: 15, freq: 20, money: 167 },
  { id: "g", name: "工业园药房", kind: "chain", recency: 33, freq: 7, money: 88 },
  { id: "h", name: "滨江健康", kind: "chain", recency: 48, freq: 16, money: 121 },
  { id: "i", name: "中学路堂", kind: "solo", recency: 11, freq: 6, money: 22 },
  { id: "j", name: "机场路店", kind: "chain", recency: 90, freq: 11, money: 76 },
  { id: "k", name: "社区旁店", kind: "solo", recency: 19, freq: 8, money: 28 },
  { id: "l", name: "夜市口单体", kind: "solo", recency: 5, freq: 3, money: 9 },
  { id: "m", name: "高铁新城", kind: "chain", recency: 4, freq: 5, money: 54 },
  { id: "n", name: "县医院对面", kind: "chain", recency: 17, freq: 15, money: 133 },
  { id: "o", name: "乡镇卫生院旁", kind: "solo", recency: 61, freq: 5, money: 16 },
  { id: "p", name: "景区旅游店", kind: "solo", recency: 112, freq: 2, money: 7 },
];

const SEGMENTS = {
  core: { zh: "核心药店", en: "Core", fill: "#2f6f64" },
  grow: { zh: "潜力药店", en: "Grow", fill: "#3d5a99" },
  sleep: { zh: "沉睡大户", en: "Sleeping", fill: "#8a3a4a" },
  regular: { zh: "常规药店", en: "Regular", fill: "#7a6236" },
  edge: { zh: "边缘药店", en: "Edge", fill: "#6b6b6b" },
} as const;

type Seg = keyof typeof SEGMENTS;

function quintile(values: number[], value: number, invert = false) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  let rank = sorted.findIndex((item) => item >= value);
  if (rank < 0) rank = n - 1;
  const q = Math.min(4, Math.floor((rank / n) * 5));
  const score = q + 1;
  return invert ? 6 - score : score;
}

function segmentOf(r: number, f: number, m: number): Seg {
  if (r >= 4 && f >= 4 && m >= 4) return "core";
  if (r >= 4 && m >= 4 && f <= 3) return "grow";
  if (r <= 2 && m >= 4) return "sleep";
  if (r <= 2 && f <= 2 && m <= 2) return "edge";
  if (m <= 2 && f <= 2) return "edge";
  return "regular";
}

export function RfmPlayground() {
  const { locale } = useI18n();
  const zh = locale === "zh";
  const [focus, setFocus] = useState("a");
  const [recencyBoost, setRecencyBoost] = useState(0);

  const scored = useMemo(() => {
    const rows = STORES.map((store) => ({
      ...store,
      recency: Math.max(1, store.recency + recencyBoost),
    }));
    const rVals = rows.map((row) => row.recency);
    const fVals = rows.map((row) => row.freq);
    const mVals = rows.map((row) => row.money);
    return rows.map((row) => {
      const r = quintile(rVals, row.recency, true);
      const f = quintile(fVals, row.freq);
      const m = quintile(mVals, row.money);
      return { ...row, r, f, m, seg: segmentOf(r, f, m) };
    });
  }, [recencyBoost]);

  const current = scored.find((row) => row.id === focus) ?? scored[0];
  const counts = scored.reduce(
    (acc, row) => {
      acc[row.seg] += 1;
      return acc;
    },
    { core: 0, grow: 0, sleep: 0, regular: 0, edge: 0 } as Record<Seg, number>,
  );

  return (
    <PlaygroundFrame title={zh ? "十六家零售药店的 RFM" : "RFM on sixteen pharmacies"}>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr>
                <th className="pb-2 font-normal">{zh ? "药店" : "Pharmacy"}</th>
                <th className="pb-2 font-normal">{zh ? "最近进货" : "Recency"}</th>
                <th className="pb-2 font-normal">{zh ? "年次数" : "Freq"}</th>
                <th className="pb-2 font-normal">{zh ? "年金额" : "Money"}</th>
                <th className="pb-2 font-normal">RFM</th>
                <th className="pb-2 font-normal">{zh ? "分层" : "Segment"}</th>
              </tr>
            </thead>
            <tbody>
              {scored.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setFocus(row.id)}
                  className={`cursor-pointer border-t border-foreground/10 ${
                    row.id === focus ? "bg-foreground/5" : "hover:bg-foreground/[0.03]"
                  }`}
                >
                  <td className="py-1.5">
                    {row.name}
                    <span className="ml-1 text-[11px] text-muted-foreground">
                      {row.kind === "chain" ? (zh ? "连锁" : "chain") : zh ? "单体" : "indie"}
                    </span>
                  </td>
                  <td className="py-1.5 tabular-nums">{row.recency}{zh ? " 天" : "d"}</td>
                  <td className="py-1.5 tabular-nums">{row.freq}</td>
                  <td className="py-1.5 tabular-nums">{row.money}{zh ? " 万" : " ×¥10k"}</td>
                  <td className="py-1.5 font-mono tabular-nums">
                    {row.r}
                    {row.f}
                    {row.m}
                  </td>
                  <td className="py-1.5" style={{ color: SEGMENTS[row.seg].fill }}>
                    {SEGMENTS[row.seg][locale]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <p className="text-sm leading-7 text-muted-foreground">
            {zh
              ? `${current.name}：R=${current.r}（越近越高），F=${current.f}，M=${current.m}。合起来是 ${current.r}${current.f}${current.m}，分在「${SEGMENTS[current.seg].zh}」。`
              : `${current.name}: R=${current.r} (higher = more recent), F=${current.f}, M=${current.m}. Code ${current.r}${current.f}${current.m}, segment “${SEGMENTS[current.seg].en}”.`}
          </p>
          <svg viewBox="0 0 280 120" className="mt-4 w-full max-w-sm" aria-hidden>
            {[
              { key: "R", value: current.r, x: 30 },
              { key: "F", value: current.f, x: 115 },
              { key: "M", value: current.m, x: 200 },
            ].map((bar) => (
              <g key={bar.key}>
                <text x={bar.x + 18} y="16" className="fill-current text-[12px]">
                  {bar.key}
                </text>
                {[1, 2, 3, 4, 5].map((step) => (
                  <rect
                    key={step}
                    x={bar.x}
                    y={108 - step * 16}
                    width="36"
                    height="14"
                    className={step <= bar.value ? "fill-foreground/80" : "fill-foreground/10"}
                  />
                ))}
              </g>
            ))}
          </svg>
          <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
            {(Object.keys(SEGMENTS) as Seg[]).map((key) => (
              <div key={key} className="flex items-center justify-between border border-foreground/10 px-2 py-1.5">
                <span style={{ color: SEGMENTS[key].fill }}>{SEGMENTS[key][locale]}</span>
                <span className="tabular-nums">{counts[key]}</span>
              </div>
            ))}
          </div>
          <label className="mt-5 grid gap-1.5 text-xs">
            <div className="flex justify-between">
              <span>{zh ? "把今天往后推几天（看分层怎么变）" : "Shift every recency later"}</span>
              <span className="tabular-nums">+{recencyBoost}{zh ? " 天" : "d"}</span>
            </div>
            <Slider
              value={[recencyBoost]}
              min={0}
              max={80}
              step={1}
              onValueChange={(value) => setRecencyBoost(Array.isArray(value) ? value[0] ?? 0 : value)}
            />
          </label>
        </div>
      </div>
    </PlaygroundFrame>
  );
}
