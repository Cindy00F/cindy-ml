"use client";

import { useI18n } from "@/lib/i18n";

const COPY = {
  zh: {
    title: "??????????????????",
    panels: [
      {
        title: "??????",
        bubbleA: "???????????",
        bubbleB: "????????????",
        caption: "?????????KA ????????????",
      },
      {
        title: "??????",
        bubbleA: "????????",
        bubbleB: "????????",
        caption: "????????????????????????",
      },
      {
        title: "?????????",
        bubbleA: "?????????",
        bubbleB: "????????",
        caption: "??????????????????????????",
      },
    ],
    note: "???????????????????????????????",
  },
  en: {
    title: "Why is each side waiting for the other to move?",
    panels: [
      {
        title: "Each side weighs its risk",
        bubbleA: "Who commits to stores first?",
        bubbleB: "Will supply be ready?",
        caption: "The supplier fears wasted spend; the KA fears committing without support.",
      },
      {
        title: "So the launch stalls",
        bubbleA: "Waiting on the store plan.",
        bubbleB: "Waiting on support.",
        caption: "Both reduce risk, but the launch window passes and no pilot starts.",
      },
      {
        title: "Make the pilot mutual",
        bubbleA: "Set stores and review gates.",
        bubbleB: "Stage the support.",
        caption: "Agree owners, dates, and stop rules?then scale only on evidence.",
      },
    ],
    note: "Check market, supply, contract, and compliance conditions; this is not a sales forecast.",
  },
} as const;

function StakeholderSketch({ step, locale }: { step: number; locale: "zh" | "en" }) {
  const left = step === 1 ? "#c45c26" : "#2f6f64";
  const right = step === 1 ? "#2f6f64" : "#c45c26";
  const panel = COPY[locale].panels[step];

  return (
    <svg viewBox="0 0 300 154" role="img" aria-hidden="true" className="h-36 w-full">
      <path d="M18 137h264" className="stroke-foreground/15" strokeWidth="2" />
      {step === 2 ? (
        <g className="fill-none stroke-foreground/30" strokeWidth="3">
          <path d="M103 72h94m-86 0V43h78v29M125 72V54h16v18m18 0V54h16v18" />
          <path d="m117 35 26-15 27 15" />
          <path d="M92 80h116" strokeDasharray="4 5" />
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
              0{index + 1} ? {panel.title}
            </p>
            <StakeholderSketch step={index} locale={locale} />
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{panel.caption}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">{copy.note}</p>
    </figure>
  );
}
