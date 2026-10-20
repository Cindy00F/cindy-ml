"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

const COPY = {
  zh: {
    eyebrow: "精品茶零售 · 从一杯到一盒",
    title: "顾客喝完一杯，为什么愿意带走一盒茶？",
    play: "播放故事",
    pause: "暂停播放",
    replay: "从头再看",
    steps: [
      {
        label: "她只想坐下来喝杯茶",
        caption: "周五下班，林林和朋友走进一家茶空间。她想喝杯茶、坐一会儿；朋友开始看茶单和茶礼。同一家店，来店理由并不一样。",
      },
      {
        label: "喜欢的味道，怎么带回家？",
        caption: "林林喜欢伯爵茶的香气。故事里的店员先问她自己喝还是送人，再按日常冲泡的需要介绍茶品，而不是直接推最贵的礼盒。",
      },
      {
        label: "一杯体验，接上一盒茶",
        caption: "林林带走了适合自己的茶。一次成交不是复购保证；门店还要看体验转化、零售毛利，以及顾客自愿加入后是否愿意再来。",
      },
    ],
    menuTitle: "今天想怎么喝？",
    drink: "店内茶饮",
    retail: "带回家的茶",
    teaName: "伯爵茶拿铁",
    options: ["自己喝", "送朋友"],
    products: ["日常茶品", "茶礼盒"],
    journey: "到店体验 → 选到合适的茶 → 自愿再来",
    note: "品牌、人物和购买情节均为教学创作，不代表任何公司的真实顾客或经营数据。",
    progress: "故事进度",
    message: "门店体验 · 顾客选择",
  },
  en: {
    eyebrow: "SPECIALTY TEA RETAIL · FROM A CUP TO A BOX",
    title: "After one cup, why would a customer take tea home?",
    play: "Play story",
    pause: "Pause",
    replay: "Replay",
    steps: [
      {
        label: "She only wants a place to sit and have tea",
        caption: "After work on Friday, Lin and a friend walk into a specialty tea shop. She wants a cup and a seat; her friend starts browsing teas and gifts. Same store, different reasons for visiting.",
      },
      {
        label: "How can a flavor she likes travel home?",
        caption: "Lin likes the Earl Grey aroma. In this illustrative scene, the staff member asks whether it is for her or a gift, then suggests an everyday tea instead of pushing the priciest set.",
      },
      {
        label: "Connect one cup to tea at home",
        caption: "Lin takes home a tea that suits her. One sale does not guarantee loyalty; the store still needs to learn from trial conversion, retail margin, and opt-in repeat visits.",
      },
    ],
    menuTitle: "How would you like your tea?",
    drink: "ENJOY IN STORE",
    retail: "TAKE TEA HOME",
    teaName: "Earl Grey tea latte",
    options: ["For myself", "As a gift"],
    products: ["Everyday tea", "Tea gift set"],
    journey: "Visit → Find a tea that fits → Choose to return",
    note: "The brand, customer, and purchase journey are fictional teaching examples, not any company’s actual sales data.",
    progress: "Story progress",
    message: "IN-STORE EXPERIENCE · CUSTOMER CHOICE",
  },
} as const;

export function TeaRetailStoryAnimation() {
  const { locale } = useI18n();
  const copy = COPY[locale];
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [occasion, setOccasion] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (step >= copy.steps.length - 1) {
        setPlaying(false);
        return;
      }
      setStep((current) => current + 1);
    }, 3200);
    return () => window.clearTimeout(timer);
  }, [copy.steps.length, playing, step]);

  const selectStep = (index: number) => {
    setPlaying(false);
    setStep(index);
  };

  const play = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    setStep((current) => (current >= copy.steps.length - 1 ? 0 : current + 1));
    setOccasion(0);
    setPlaying(true);
  };

  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-foreground/10 bg-[#f3efe7] text-[#273532] dark:bg-[#202927] dark:text-[#f2eee5]">
      <div className="px-5 pt-5 sm:px-7 sm:pt-7">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-[#9b6748] uppercase">
          {copy.eyebrow}
        </p>
        <figcaption className="font-heading mt-2 max-w-xl text-xl leading-snug sm:text-2xl">
          {copy.title}
        </figcaption>
      </div>

      <div className="grid gap-5 px-5 py-6 sm:grid-cols-[1fr_1fr] sm:gap-8 sm:px-7">
        <div className="mx-auto w-full max-w-[280px] rounded-[2rem] border-[5px] border-[#59645e] bg-[#e1e6dd] p-3 shadow-lg dark:border-[#79867e] dark:bg-[#303a35]">
          <div className="rounded-xl border border-[#52675c]/20 bg-[#f8f8ee] p-3 dark:bg-[#26312b]">
            <p className="text-[10px] tracking-wide text-[#68766b] dark:text-[#c1cbbd]">
              {copy.message}
            </p>
            <p className="mt-2 font-heading text-xl tracking-wide text-[#24382e] dark:text-[#edf0e2]">
              {locale === "zh" ? "茶空间" : "TEA ROOM"}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[copy.drink, copy.retail].map((item, index) => (
                <div
                  key={item}
                  className={`rounded-lg border px-2 py-2.5 text-center text-[10px] leading-4 transition-colors ${
                    (step === 0 ? index === 0 : index === 1)
                      ? "border-[#70816e]/40 bg-[#dce5d7] text-[#354738] dark:bg-[#425547] dark:text-white"
                      : "border-foreground/10 text-foreground/60"
                  }`}
                >
                  <span className="block text-base" aria-hidden="true">
                    {index === 0 ? "♨" : "▤"}
                  </span>
                  {item}
                </div>
              ))}
            </div>
            {step === 0 ? (
              <div className="mt-3 rounded-lg bg-[#efe3d7] px-3 py-2 text-center dark:bg-[#45392e]">
                <span className="text-[10px] text-[#8d684d]">
                  {locale === "zh" ? "一杯慢慢喝的茶" : "A cup to enjoy here"}
                </span>
              </div>
            ) : step === 1 ? (
              <div className="mt-3 rounded-lg bg-[#efe3d7] px-3 py-2 text-center dark:bg-[#45392e]">
                <p className="text-[10px] text-[#8d684d]">{copy.teaName}</p>
                <p className="mt-1 text-[10px] text-[#68766b] dark:text-[#c1cbbd]">
                  {locale === "zh" ? "喜欢这个香气？" : "Like this aroma?"}
                </p>
              </div>
            ) : (
              <div className="mt-3 rounded-lg bg-[#efe3d7] px-3 py-2 text-center dark:bg-[#45392e]">
                <p className="text-[10px] text-[#8d684d]">
                  {copy.options[occasion]}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#354738] dark:text-[#edf0e2]">
                  {copy.products[occasion]}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex min-h-[13rem] flex-col justify-center">
          <p className="text-xs font-semibold tracking-wide text-[#9b6748]">
            0{step + 1} · {copy.steps[step].label}
          </p>
          <p aria-live="polite" className="mt-2 text-sm leading-6">
            {copy.steps[step].caption}
          </p>
          {step >= 1 ? (
            <div className="mt-5">
              <p className="mb-2 text-[10px] tracking-wide text-muted-foreground">
                {copy.menuTitle}
              </p>
              <div className="flex flex-wrap gap-2">
                {copy.options.map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setOccasion(index)}
                    aria-pressed={step === 2 && occasion === index}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b6748] ${
                      occasion === index && step === 2
                        ? "border-[#70816e] bg-[#dce5d7] text-[#354738] dark:bg-[#425547] dark:text-white"
                        : "border-foreground/15 hover:bg-foreground/5"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="px-5 pb-5 sm:px-7 sm:pb-7">
        <p className="rounded-lg bg-foreground/[0.04] px-3 py-2 text-center text-[11px] tracking-wide text-muted-foreground">
          {copy.journey}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-foreground/10 pt-4">
          <div className="flex gap-1.5" aria-label={copy.progress}>
            {copy.steps.map((scene, index) => (
              <button
                key={scene.label}
                type="button"
                onClick={() => selectStep(index)}
                aria-label={`${index + 1}. ${scene.label}`}
                aria-current={step === index ? "step" : undefined}
                className={`h-2.5 rounded-full transition-all motion-reduce:transition-none ${
                  step === index ? "w-8 bg-[#9b6748]" : "w-2.5 bg-foreground/20"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={play}
            className="rounded-full bg-[#34443d] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#4a6054] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b6748] dark:bg-[#dce5d7] dark:text-[#26352d]"
          >
            {playing ? copy.pause : step === copy.steps.length - 1 ? copy.replay : copy.play}
          </button>
        </div>
        <p className="mt-3 text-[10px] leading-4 text-muted-foreground">{copy.note}</p>
      </div>
    </figure>
  );
}
