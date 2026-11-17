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

function roadDistance(a: { x: number; y: number }, b: { x: number; y: number }) {
  const sameBank = (a.x < 50) === (b.x < 50);
  if (sameBank) return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  return Math.abs(a.x - 50) + Math.abs(a.y - 50) + Math.abs(b.x - 50) + Math.abs(b.y - 50) + 12;
}

function assignByRoad(sites: Site[], centers: { x: number; y: number }[]) {
  return sites.map((site) => {
    let nearest = 0;
    let best = Infinity;
    centers.forEach((center, i) => {
      const distance = roadDistance(site, center);
      if (distance < best) {
        best = distance;
        nearest = i;
      }
    });
    return nearest;
  });
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
  const [riverOn, setRiverOn] = useState(false);

  const model = useMemo(() => runKmeans(sites, k, seed), [sites, k, seed]);
  const roadAssign = useMemo(() => assignByRoad(sites, model.centers), [sites, model.centers]);
  const assignments = riverOn ? roadAssign : model.assign;
  const sizes = model.centers.map((_, i) => assignments.filter((idx) => idx === i).length);
  const maxSize = Math.max(...sizes);
  const minSize = Math.min(...sizes);
  const changedSites = sites.filter((_, i) => roadAssign[i] !== model.assign[i]).length;
  const routedSiteIndex = riverOn
    ? sites.findIndex((site, i) => roadAssign[i] !== model.assign[i])
    : -1;

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
            {riverOn ? (
              <g aria-hidden="true">
                <path
                  d="M50 -2 C43 13 57 25 49 40 C42 54 57 68 49 82 C44 91 52 97 50 102"
                  fill="none"
                  stroke="#79b8d2"
                  strokeWidth="8"
                  opacity="0.72"
                />
                <path
                  d="M50 41 L50 59"
                  fill="none"
                  stroke="#9c704b"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <text x="52.5" y="52" className="fill-foreground text-[2.4px]">
                  {zh ? "桥" : "bridge"}
                </text>
              </g>
            ) : null}
            {routedSiteIndex >= 0 ? (
              <path
                d={`M${sites[routedSiteIndex].x} ${sites[routedSiteIndex].y} L50 50 L${model.centers[roadAssign[routedSiteIndex]].x} ${model.centers[roadAssign[routedSiteIndex]].y}`}
                fill="none"
                stroke="#b7479a"
                strokeWidth="0.7"
                strokeDasharray="2 1.5"
                opacity="0.85"
                pointerEvents="none"
              />
            ) : null}
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
                fill={COLORS[assignments[i] % COLORS.length]}
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
          <div className="mt-4 flex gap-3 border border-foreground/10 bg-muted/40 p-3">
            <svg
              viewBox="0 0 64 64"
              aria-hidden="true"
              className="curiosity-ghost-idle mt-0.5 size-9 shrink-0"
            >
              <path
                d="M32 7c-12.4 0-22 9.5-22 22v20.2c0 3 3.5 4.5 5.7 2.4l5.2-5 5.2 5c2.2 2.1 5.7.6 5.7-2.4v-2.1l5.2 5c2.2 2.1 5.7.6 5.7-2.4v-3.1l5.6 4.1c2.2 1.6 5.3 0 5.3-2.8V29C53.6 16.8 44.2 7 32 7Z"
                fill="#9b6bdb"
              />
              <circle cx="24" cy="28" r="2" fill="white" />
              <circle cx="40" cy="28" r="2" fill="white" />
              <path d="M27 37q5 5 10 0" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="min-w-0">
              <p className="text-xs font-medium">
                {riverOn
                  ? zh
                    ? `幽灵：隔岸 ${changedSites} 家换了负责人。还要只看直线吗？`
                    : `Ghost: ${changedSites} across-river accounts changed reps. Still trusting the straight line?`
                  : zh
                    ? "幽灵：地图上最近的那家，真要第一个去吗？"
                    : "Ghost: should the closest pin really be your first call?"}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 h-8"
                aria-pressed={riverOn}
                onClick={() => setRiverOn((current) => !current)}
              >
                {riverOn
                  ? zh
                    ? "收起河流，回到直线"
                    : "Hide river, use straight lines"
                  : zh
                    ? "加上河和桥"
                    : "Add the river and bridge"}
              </Button>
            </div>
          </div>
          {riverOn ? (
            <p role="status" className="mt-2 text-xs leading-5 text-muted-foreground">
              {zh
                ? "紫色虚线是经桥的示意路线。这里只重算客户归属，中心仍是 K-means 按直线算出的草图；真实排班还要接入路网时间。"
                : "The purple dash is an illustrative bridge route. Only account ownership is rechecked; centers remain the straight-line K-means sketch. Real schedules need road-network travel times."}
            </p>
          ) : null}
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
            {sizes.map((size, i) => (
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
