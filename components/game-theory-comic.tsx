"use client";

import { useI18n } from "@/lib/i18n";

const COPY = {
  zh: {
    title: "买房这局，怎么走到这一步？",
    panels: [
      {
        title: "先各自算账",
        bubbleA: "月供会不会太重？",
        bubbleB: "产权和风险呢？",
        caption: "两个人都在考虑自己的成本。",
      },
      {
        title: "于是都先等等",
        bubbleA: "你不买，我也不买。",
        bubbleB: "那就先不买吧。",
        caption: "按示意收益表，结果是 (0, 0)：稳定，但不是双方更好的结果。",
      },
      {
        title: "把合作条件谈清",
        bubbleA: "预算、产权先说好。",
        bubbleB: "风险和责任写下来。",
        caption: "可信的约定，才可能让双方走向 (2, 2)。",
      },
    ],
    note: "分数仅用于解释模型，不代表真实买房收益。",
  },
  en: {
    title: "How does this housing game play out?",
    panels: [
      {
        title: "Count the costs",
        bubbleA: "Can we afford it?",
        bubbleB: "Who owns it?",
        caption: "Each person weighs their own costs.",
      },
      {
        title: "So both wait",
        bubbleA: "If you don't buy, I won't.",
        bubbleB: "Let's wait, then.",
        caption: "The illustrative outcome is (0, 0): stable, but not best for both.",
      },
      {
        title: "Make cooperation credible",
        bubbleA: "Agree on a budget?",
        bubbleB: "Write down ownership.",
        caption: "A credible agreement can make (2, 2) attainable.",
      },
    ],
    note: "Payoffs are illustrative, not real housing values.",
  },
} as const;

function CoupleSketch({ step, locale }: { step: number; locale: "zh" | "en" }) {
  const left = step === 1 ? "#c45c26" : "#2f6f64";
  const right = step === 1 ? "#2f6f64" : "#c45c26";
  const panel = COPY[locale].panels[step];

  return (
    <svg viewBox="0 0 300 154" role="img" aria-hidden="true" className="h-36 w-full">
      <path d="M18 137h264" className="stroke-foreground/15" strokeWidth="2" />
      {step === 2 ? (
        <g className="fill-none stroke-foreground/30" strokeWidth="3">
          <path d="M105 62v-18h90v18M116 44V28h68v16" />
          <path d="M124 62v-9h16v9m20 0v-9h16v9" />
        </g>
      ) : null}
      <g stroke={left} strokeWidth="4" strokeLinecap="round" fill="none">
        <circle cx="72" cy="91" r="15" fill="white" />
        <path d="M72 107v24m0-15-18 12m18-12 16 10m-16 5-10 12m10-12 10 12" />
      </g>
      <g stroke={right} strokeWidth="4" strokeLinecap="round" fill="none">
        <circle cx="228" cy="91" r="15" fill="white" />
        <path d="M228 107v24m0-15-16 10m16-10 18-12m-18 27-10 12m10-12 10 12" />
      </g>
      <g>
        <rect x="9" y="9" width="132" height="46" rx="11" fill="white" stroke={left} strokeOpacity=".55" />
        <path d="m57 55-7 9 20-9" fill="white" stroke={left} strokeOpacity=".55" strokeLinejoin="round" />
        <text x="75" y="28" textAnchor="middle" className="fill-foreground text-[9px]">
          {panel.bubbleA}
        </text>
        <rect x="159" y="9" width="132" height="46" rx="11" fill="white" stroke={right} strokeOpacity=".55" />
        <path d="m240 55 7 9-20-9" fill="white" stroke={right} strokeOpacity=".55" strokeLinejoin="round" />
        <text x="225" y="28" textAnchor="middle" className="fill-foreground text-[9px]">
          {panel.bubbleB}
        </text>
      </g>
      {step === 0 ? (
        <g className="fill-[#c45c26]">
          <path d="M48 79c-3-5 2-9 6-6 1-5 9-3 8 2 5 1 4 8-2 8h-8c-4 0-6-2-4-4Z" />
          <path d="M238 73c-3-5 2-9 6-6 1-5 9-3 8 2 5 1 4 8-2 8h-8c-4 0-6-2-4-4Z" />
        </g>
      ) : null}
      {step === 1 ? (
        <g className="fill-foreground/40">
          <path d="M63 75h18v3H63zm156 0h18v3h-18z" />
        </g>
      ) : null}
      {step === 2 ? (
        <g className="fill-[#2f6f64]">
          <path d="m63 78 5 5 10-12 3 3-13 15-8-8z" />
          <path d="m219 78 5 5 10-12 3 3-13 15-8-8z" />
        </g>
      ) : null}
    </svg>
  );
}

export function GameTheoryComic() {
  const { locale } = useI18n();
  const copy = COPY[locale];

  return (
    <figure className="my-8 rounded-xl border border-foreground/10 bg-[#fcf8f1] p-4 sm:p-5">
      <figcaption className="font-heading mb-4 text-lg">{copy.title}</figcaption>
      <div className="grid gap-3 md:grid-cols-3">
        {copy.panels.map((panel, index) => (
          <div key={panel.title} className="rounded-lg border border-foreground/10 bg-background/80 p-3">
            <p className="text-xs font-semibold text-muted-foreground">
              0{index + 1} · {panel.title}
            </p>
            <CoupleSketch step={index} locale={locale} />
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{panel.caption}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">{copy.note}</p>
    </figure>
  );
}
