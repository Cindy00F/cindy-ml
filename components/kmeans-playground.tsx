"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlaygroundFrame } from "@/components/playground-frame";
import { Slider } from "@/components/ui/slider";
import { useI18n } from "@/lib/i18n";

type Site = { id: string; name: string; x: number; y: number; kind: "hospital" | "pharmacy" };

const SITES: Site[] = [
  { id: "1", name: "市一院", x: 18, y: 22, kind: "hospital" },
  { id: "2", name: "中医院", x: 26, y: 30, kind: "hospital" },
  { id: "3", name: "城东康宁", x: 22, y: 38, kind: "pharmacy" },
  { id: "4", name: "工学院店", x: 14, y: 44, kind: "pharmacy" },
  { id: "5", name: "开发区医院", x: 78, y: 18, kind: "hospital" },
  { id: "6", name: "高铁药房", x: 86, y: 26, kind: "pharmacy" },
  { id: "7", name: "新区益民", x: 72, y: 32, kind: "pharmacy" },
  { id: "8", name: "物流园店", x: 90, y: 38, kind: "pharmacy" },
  { id: "9", name: "大学附属", x: 20, y: 72, kind: "hospital" },
  { id: "10", name: "大学路堂", x: 28, y: 80, kind: "pharmacy" },
  { id: "11", name: "学生街店", x: 16, y: 84, kind: "pharmacy" },
  { id: "12", name: "南门便民", x: 34, y: 88, kind: "pharmacy" },
  { id: "13", name: "老城二院", x: 48, y: 48, kind: "hospital" },
  { id: "14", name: "钟楼药店", x: 44, y: 56, kind: "pharmacy" },
  { id: "15", name: "县医院", x: 58, y: 62, kind: "hospital" },
  { id: "16", name: "对面大药房", x: 62, y: 70, kind: "pharmacy" },
  { id: "17", name: "江北社区", x: 70, y: 78, kind: "pharmacy" },
  { id: "18", name: "滨江店", x: 80, y: 72, kind: "pharmacy" },
  { id: "19", name: "西郊卫生院", x: 8, y: 58, kind: "hospital" },
  { id: "20", name: "乡镇店", x: 6, y: 68, kind: "pharmacy" },
  { id: "21", name: "机场路店", x: 88, y: 12, kind: "pharmacy" },
  { id: "22", name: "河东医保", x: 54, y: 24, kind: "pharmacy" },
  { id: "23", name: "妇幼", x: 40, y: 20, kind: "hospital" },
  { id: "24", name: "夜市口", x: 38, y: 40, kind: "pharmacy" },
];

const COLORS = ["#c45c26", "#2f6f64", "#3d5a99", "#8a3a4a", "#7a6236", "#6b4ea1"];

function dist2(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

function runKmeans(points: Site[], k: number, seed: number) {
  const picks: { x: number; y: number }[] = [];
  const first = points[seed % points.length];
  picks.push({ x: first.x, y: first.y });
  while (picks.length < k) {
    let best = points[0];
    let bestD = -1;
    for (const point of points) {
      const d = Math.min(...picks.map((center) => dist2(point, center)));
      if (d > bestD) {
        bestD = d;
        best = point;
      }
    }
    picks.push({ x: best.x, y: best.y });
  }
  let centers = picks;
  let assign = points.map(() => 0);
  for (let step = 0; step < 18; step += 1) {
    assign = points.map((point) => {
      let idx = 0;
      let best = Infinity;
      centers.forEach((center, i) => {
        const d = dist2(point, center);
        if (d < best) {
          best = d;
          idx = i;
        }
      });
      return idx;
    });
    centers = centers.map((_, i) => {
      const members = points.filter((_, j) => assign[j] === i);
      if (!members.length) return centers[i];
      return {
        x: members.reduce((sum, item) => sum + item.x, 0) / members.length,
        y: members.reduce((sum, item) => sum + item.y, 0) / members.length,
      };
    });
  }
  const inertia = points.reduce((sum, point, i) => sum + dist2(point, centers[assign[i]]), 0);
  const sizes = centers.map((_, i) => assign.filter((idx) => idx === i).length);
  return { centers, assign, inertia, sizes };
}

export function KmeansPlayground() {
  const { locale } = useI18n();
  const zh = locale === "zh";
  const [k, setK] = useState(4);
  const [seed, setSeed] = useState(1);
  const [sites, setSites] = useState(SITES);
  const [drag, setDrag] = useState<string | null>(null);

  const model = useMemo(() => runKmeans(sites, k, seed), [sites, k, seed]);
  const maxSize = Math.max(...model.sizes);
  const minSize = Math.min(...model.sizes);

  const move = (id: string, clientX: number, clientY: number, svg: SVGSVGElement) => {
    const box = svg.getBoundingClientRect();
    const x = Math.max(4, Math.min(96, ((clientX - box.left) / box.width) * 100));
    const y = Math.max(6, Math.min(94, ((clientY - box.top) / box.height) * 100));
    setSites((current) => current.map((site) => (site.id === id ? { ...site, x, y } : site)));
  };

  return (
    <PlaygroundFrame title={zh ? "一座城里的医院和药店" : "Hospitals and pharmacies in one city"}>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <svg
          viewBox="0 0 100 100"
          className="h-auto w-full cursor-crosshair border border-foreground/15 bg-[#fcf4e8] dark:bg-[#1b1814]"
          onPointerMove={(event) => {
            if (!drag) return;
            move(drag, event.clientX, event.clientY, event.currentTarget);
          }}
          onPointerUp={() => setDrag(null)}
          onPointerLeave={() => setDrag(null)}
        >
          <text x="6" y="8" className="fill-foreground/40 text-[3.2px]">
            {zh ? "江北 / 老城 / 大学城 / 开发区" : "north / old town / campus / zone"}
          </text>
          {sites.map((site, i) => (
            <g
              key={site.id}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                setDrag(site.id);
              }}
              className="cursor-grab"
            >
              <circle
                cx={site.x}
                cy={site.y}
                r={site.kind === "hospital" ? 2.4 : 1.7}
                fill={COLORS[model.assign[i] % COLORS.length]}
                className="stroke-background"
                strokeWidth="0.4"
              />
              <text x={site.x + 2.2} y={site.y + 1} className="fill-foreground/70 text-[2.4px]">
                {site.name}
              </text>
            </g>
          ))}
          {model.centers.map((center, i) => (
            <g key={`c-${i}`}>
              <rect
                x={center.x - 2.2}
                y={center.y - 2.2}
                width="4.4"
                height="4.4"
                fill={COLORS[i % COLORS.length]}
                className="stroke-foreground"
                strokeWidth="0.35"
              />
              <text x={center.x + 2.8} y={center.y - 1.6} className="fill-foreground text-[2.6px]">
                {zh ? `代表 ${i + 1}` : `rep ${i + 1}`}
              </text>
            </g>
          ))}
        </svg>
        <div className="text-sm leading-7">
          <p className="text-muted-foreground">
            {zh
              ? `K-means 按直线距离把点分给最近的中心，再把中心挪到该组的平均位置，重复到稳定。方块是代表驻点，圆点是医院或药店。`
              : `K-means assigns each site to the nearest center, then moves the center to the mean, and repeats. Squares are reps; circles are sites.`}
          </p>
          <label className="mt-4 grid gap-1.5 text-xs">
            <div className="flex justify-between">
              <span>{zh ? "代表人数 K" : "Number of reps K"}</span>
              <span className="tabular-nums">{k}</span>
            </div>
            <Slider
              value={[k]}
              min={2}
              max={6}
              step={1}
              onValueChange={(value) => setK(Array.isArray(value) ? value[0] ?? 4 : value)}
            />
          </label>
          <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => setSeed((n) => n + 1)}>
            {zh ? "换一组初始中心" : "Reseed centers"}
          </Button>
          <ul className="mt-4 space-y-1 text-xs">
            {model.sizes.map((size, i) => (
              <li key={i} className="flex items-center justify-between">
                <span style={{ color: COLORS[i] }}>
                  {zh ? `代表 ${i + 1}` : `Rep ${i + 1}`}
                </span>
                <span className="tabular-nums">
                  {size} {zh ? "家" : "sites"}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            {zh
              ? `组内距离平方和 ${model.inertia.toFixed(0)}。最多 ${maxSize} 家，最少 ${minSize} 家。K-means 不管工作量是否均匀，也不懂过江要绕路。`
              : `WCSS ${model.inertia.toFixed(0)}. Largest territory ${maxSize}, smallest ${minSize}. K-means does not balance workload or know a river is a detour.`}
          </p>
        </div>
      </div>
    </PlaygroundFrame>
  );
}
