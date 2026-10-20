"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

const COPY = {
  zh: {
    eyebrow: "一间面包店 · 两家分店 · 三个星期",
    title: "那场排起长队的促销，真的多卖了吗？",
    play: "播放故事",
    pause: "暂停",
    replay: "再看一遍",
    steps: [
      {
        label: "活动当天",
        caption: "河岸店排起了队。店主阿禾看着收银机：今天卖了 160 份，比平时多 60 份！",
      },
      {
        label: "隔壁那家店",
        caption: "街角店没有做促销，销量却也从 90 涨到 100。天气转凉，两家店都更好卖了。",
      },
      {
        label: "下一周",
        caption: "促销一停，河岸店掉到 80。把前后两周一起看：热闹的一周，可能借走了下一周的生意。",
      },
    ],
    river: "河岸店 · 做活动",
    corner: "街角店 · 没活动",
    unit: "每周销量（示意份数）",
    weeks: ["上周", "活动周", "下一周"],
    takeaway: "活动周看起来多卖 60；对照店也涨了 10，估算新增约 50。把下一周一起算，三周净增约 20。",
    caveat: "这是讲解用的示意数据；因果判断还需要可比门店、稳定趋势和真实利润数据。",
  },
  en: {
    eyebrow: "ONE BAKERY · TWO STORES · THREE WEEKS",
    title: "Did the queue mean the promotion sold more?",
    play: "Play story",
    pause: "Pause",
    replay: "Watch again",
    steps: [
      {
        label: "Promotion week",
        caption: "A line forms at Riverside. Owner Ahe checks the till: 160 loaves—60 more than usual!",
      },
      {
        label: "The other store",
        caption: "Corner Street ran no offer, yet sales rose from 90 to 100. Cooler weather lifted both stores.",
      },
      {
        label: "The week after",
        caption: "When the offer ends, Riverside falls to 80. That busy week may have borrowed sales from the next.",
      },
    ],
    river: "Riverside · promotion",
    corner: "Corner St. · no offer",
    unit: "Weekly loaves (illustrative)",
    weeks: ["Before", "Offer week", "After"],
    takeaway: "The offer week appears +60; the comparison store also rose +10, suggesting about +50. Across all three weeks, the net lift is about +20.",
    caveat: "Illustrative data only. Causal claims need comparable stores, stable trends, and actual profit data.",
  },
} as const;

const RIVERSIDE = [100, 160, 80];
const CORNER = [90, 100, 100];

export function PromoStoryAnimation() {
  const { locale } = useI18n();
  const copy = COPY[locale];
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (step >= copy.steps.length - 1) {
        setPlaying(false);
        return;
      }
      setStep((current) => current + 1);
    }, 3600);
    return () => window.clearTimeout(timer);
  }, [copy.steps.length, playing, step]);

  const selectStep = (index: number) => {
    setPlaying(false);
    setStep(index);
  };

  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-foreground/10 bg-[#f5efe5] text-[#263832] dark:bg-[#202b29] dark:text-[#f3ecdf]">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-7 sm:pt-7">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] text-[#a55c40] uppercase">
            {copy.eyebrow}
          </p>
          <figcaption className="font-heading mt-2 max-w-xl text-xl leading-snug sm:text-2xl">
            {copy.title}
          </figcaption>
        </div>
        <span className="rounded-full border border-current/15 px-3 py-1 text-[10px] tracking-wide opacity-65">
          {copy.unit}
        </span>
      </div>

      <div className="px-3 pt-3 sm:px-6">
        <div className="mb-1 flex flex-wrap gap-x-4 gap-y-1 px-4 text-xs">
          <span className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[#c36e4c]" />
            {copy.river}
          </span>
          <span className={`inline-flex items-center gap-2 transition-opacity motion-reduce:transition-none ${step === 0 ? "opacity-40" : ""}`}>
            <span className="size-2.5 rounded-full bg-[#66877a]" />
            {copy.corner}
          </span>
        </div>
        <svg
          viewBox="0 0 640 310"
          role="img"
          aria-labelledby="promo-chart-title promo-chart-description"
          className="h-auto w-full"
        >
          <title id="promo-chart-title">{copy.title}</title>
          <desc id="promo-chart-description">{copy.steps[step].caption}</desc>
          <path d="M35 252H605" className="stroke-[#263832]/15 dark:stroke-[#f3ecdf]/20" />
          <path d="M75 54V252" className="stroke-[#263832]/10 dark:stroke-[#f3ecdf]/15" />
          {[0, 1, 2].map((index) => {
            const riverVisible = step === 2 || index < 2;
            const cornerVisible = step >= 1 && (step === 2 || index < 2);
            const weekVisible = step === 2 || index < 2;
            const riverHeight = RIVERSIDE[index] * 0.78;
            const cornerHeight = CORNER[index] * 0.78;
            const x = 135 + index * 175;
            return (
              <g key={copy.weeks[index]}>
                <rect
                  x={x}
                  y={252 - riverHeight}
                  width="42"
                  height={riverHeight}
                  rx="5"
                  fill="#c36e4c"
                  className={`transition-opacity duration-700 ease-out motion-reduce:transition-none ${
                    riverVisible ? "opacity-100" : "opacity-0"
                  }`}
                />
                <text
                  x={x + 21}
                  y={244 - riverHeight}
                  textAnchor="middle"
                  className={`fill-[#a55c40] text-[14px] font-semibold transition-opacity duration-700 motion-reduce:transition-none ${
                    riverVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {RIVERSIDE[index]}
                </text>
                <rect
                  x={x + 48}
                  y={252 - cornerHeight}
                  width="42"
                  height={cornerHeight}
                  rx="5"
                  fill="#66877a"
                  className={`transition-opacity duration-700 ease-out motion-reduce:transition-none ${
                    cornerVisible ? "opacity-100" : "opacity-0"
                  }`}
                />
                <text
                  x={x + 69}
                  y={244 - cornerHeight}
                  textAnchor="middle"
                  className={`fill-[#527365] text-[14px] font-semibold transition-opacity duration-700 motion-reduce:transition-none dark:fill-[#9fc4b4] ${
                    cornerVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {CORNER[index]}
                </text>
                <text
                  x={x + 45}
                  y="275"
                  textAnchor="middle"
                  className={`fill-[#263832]/60 text-[14px] transition-opacity duration-700 motion-reduce:transition-none dark:fill-[#f3ecdf]/65 ${
                    weekVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {copy.weeks[index]}
                </text>
              </g>
            );
          })}
          {step === 1 ? (
            <g>
            <path
              d="M204 182 Q292 166 379 174"
              fill="none"
              stroke="#527365"
              strokeWidth="2"
              strokeDasharray="5 6"
            />
            <text
              x="380"
              y="160"
              className="fill-[#527365] text-[14px] font-semibold"
            >
              {locale === "zh" ? "共同 +10" : "shared +10"}
            </text>
            </g>
          ) : null}
          {step === 0 ? (
            <g transform="translate(238 38)">
              <path d="M0 22h54v31H0z" fill="#e3b88e" />
              <path d="M-5 23 27 2l32 21" fill="#c36e4c" />
              <rect x="9" y="31" width="14" height="22" rx="6" fill="#fff4dc" />
              <rect x="31" y="31" width="15" height="12" rx="5" fill="#fff4dc" />
              <path d="M15 14c5-7 14-7 19 0-2 7-6 10-10 10s-7-3-9-10Z" fill="#8d6045" />
              <path d="M18 14c4 2 8 2 13 0" fill="none" stroke="#f0c98b" strokeWidth="2" />
            </g>
          ) : null}
          {step === 2 ? (
            <g>
              <path d="M480 166H588" stroke="#a55c40" strokeWidth="1.5" strokeDasharray="3 4" />
              <path d="M480 166V190" stroke="#a55c40" strokeWidth="1.5" strokeDasharray="3 4" />
              <text x="486" y="153" className="fill-[#a55c40] text-[14px]">
                {locale === "zh" ? "估计 110" : "estimate 110"}
              </text>
              <text x="452" y="184" className="fill-[#a55c40] text-[14px] font-semibold">
                −30
              </text>
            </g>
          ) : null}
        </svg>
      </div>

      <div className="px-5 pb-5 sm:px-7 sm:pb-7">
        <div aria-live="polite" className="min-h-[4.5rem]">
          <p className="text-xs font-semibold tracking-wide text-[#a55c40]">
            0{step + 1} · {copy.steps[step].label}
          </p>
          <p className="mt-1 text-sm leading-6">{copy.steps[step].caption}</p>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#263832]/10 pt-4 dark:border-[#f3ecdf]/15">
          <div className="flex gap-1.5" aria-label={locale === "zh" ? "故事进度" : "Story progress"}>
            {copy.steps.map((scene, index) => (
              <button
                key={scene.label}
                type="button"
                onClick={() => selectStep(index)}
                aria-label={`${index + 1}. ${scene.label}`}
                aria-current={step === index ? "step" : undefined}
                className={`h-2.5 rounded-full transition-all motion-reduce:transition-none ${
                  step === index ? "w-8 bg-[#a55c40]" : "w-2.5 bg-[#263832]/20 dark:bg-[#f3ecdf]/25"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              if (playing) {
                setPlaying(false);
                return;
              }
              if (step === copy.steps.length - 1) setStep(0);
              setPlaying(true);
            }}
            className="rounded-full bg-[#263832] px-4 py-2 text-xs font-semibold text-[#fffaf1] transition-colors hover:bg-[#3d584e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a55c40] dark:bg-[#f3ecdf] dark:text-[#263832]"
          >
            {playing ? copy.pause : step === copy.steps.length - 1 ? copy.replay : copy.play}
          </button>
        </div>
        {step === 2 ? (
          <p className="mt-4 border-l-2 border-[#a55c40]/60 pl-3 text-xs leading-5 opacity-80">
            {copy.takeaway}
          </p>
        ) : null}
        <p className="mt-3 text-[10px] leading-4 opacity-55">{copy.caveat}</p>
      </div>
    </figure>
  );
}
