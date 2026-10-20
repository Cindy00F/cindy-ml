"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

const COPY = {
  zh: {
    eyebrow: "九键输入 · 日常按键场景",
    title: "按下 926，候选「要、药、摇」谁排前面？",
    play: "播放故事",
    pause: "暂停播放",
    replay: "从头再看",
    steps: [
      {
        label: "只按一次",
        caption: "你想输入拼音 yao。九键上，Y 在 9，A 在 2，O 在 6；每个字母按一次，得到 926。",
      },
      {
        label: "一串数字，不止一个词",
        caption: "926 能拼出 yao，却不能单独决定是“要”“药”还是“摇”。输入法先把可能的拼音和词找出来。",
      },
      {
        label: "上下文给出线索，你来确认",
        caption: "前面已经输入“买”，候选词就可以优先展示常见搭配。它给你选项，不替你决定；点“药”完成输入。",
      },
    ],
    keyLabel: "九键字母",
    candidates: "候选",
    phrase: "买",
    phoneCandidates: ["要", "药", "摇"],
    candidatesList: ["要", "药", "摇"],
    explanation: "按键 → 拼音候选 → 结合上下文排序 → 人来确认",
    note: "这是中文九键拼音输入的简化示意。不同输入法的映射、词库和候选排序会不同。",
  },
  en: {
    eyebrow: "NINE-KEY TYPING · AN EVERYDAY MESSAGE",
    title: "Tap 926: which of 要, 药, and 摇 appears first?",
    play: "Play story",
    pause: "Pause",
    replay: "Replay",
    steps: [
      {
        label: "One tap per letter",
        caption: "To type pinyin yao, tap the keys holding Y, A, and O: 9, 2, 6. One tap per letter gives 926.",
      },
      {
        label: "One sequence, several possibilities",
        caption: "926 can spell yao, but it does not uniquely mean one word. The input method looks up plausible pinyin and words.",
      },
      {
        label: "Context helps; you confirm",
        caption: "After “buy,” the candidate list can prioritize familiar phrases. It offers options, not certainty. Choose the word you mean.",
      },
    ],
    keyLabel: "Letters on each key",
    candidates: "Candidates",
    phrase: "buy ",
    phoneCandidates: ["want", "medicine", "sway"],
    candidatesList: ["要 · want", "药 · medicine", "摇 · sway"],
    explanation: "Key taps → pinyin candidates → context ranking → your choice",
    note: "A simplified Chinese nine-key Pinyin example. Mappings, dictionaries, and ranking vary by input method.",
  },
} as const;

const KEYS = [
  { digit: "1", letters: ".,?!" },
  { digit: "2", letters: "ABC" },
  { digit: "3", letters: "DEF" },
  { digit: "4", letters: "GHI" },
  { digit: "5", letters: "JKL" },
  { digit: "6", letters: "MNO" },
  { digit: "7", letters: "PQRS" },
  { digit: "8", letters: "TUV" },
  { digit: "9", letters: "WXYZ" },
] as const;

export function T9StoryAnimation() {
  const { locale } = useI18n();
  const copy = COPY[locale];
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (step >= copy.steps.length - 1) {
        setPlaying(false);
        return;
      }
      setStep((current) => current + 1);
    }, 2600);
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
    setStep((current) =>
      current >= copy.steps.length - 1 ? 0 : current === 0 ? 1 : current + 1,
    );
    setSelectedCandidate(null);
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
              {locale === "zh" ? "短信 · 新消息" : "MESSAGE · NEW"}
            </p>
            <p className="mt-3 min-h-8 font-mono text-lg tracking-[0.16em] text-[#24382e] dark:text-[#edf0e2]">
              {step === 0 ? (
                <>
                  <span className="animate-pulse motion-reduce:animate-none">▍</span>
                </>
              ) : step === 1 ? (
                "926"
              ) : (
                <>
                  {copy.phrase}
                  <span className="ml-1 rounded bg-[#d8e2d2] px-1.5 py-0.5 text-base dark:bg-[#425547]">
                    {copy.phoneCandidates[selectedCandidate ?? 1]}
                  </span>
                </>
              )}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between px-1 text-[10px] text-[#68766b] dark:text-[#c1cbbd]">
            <span>{copy.keyLabel}</span>
            <span className="font-mono tracking-widest">
              {locale === "zh" ? "九键" : "9-KEY"}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {KEYS.map((key) => {
              const active = step === 0 && ["9", "2", "6"].includes(key.digit);
              return (
                <div
                  key={key.digit}
                  className={`flex h-11 items-center justify-center gap-1 rounded-lg border border-[#68766b]/15 bg-[#f7f7ed] font-mono text-sm shadow-sm transition-colors duration-500 dark:bg-[#3b463f] ${
                    active ? "bg-[#d8e2d2] text-[#8a5438] dark:bg-[#536453]" : ""
                  }`}
                >
                  <span className="font-semibold">{key.digit}</span>
                  <span className="text-[9px] tracking-wider opacity-60">{key.letters}</span>
                </div>
              );
            })}
          </div>
          {step === 0 ? (
            <div className="mt-3 flex justify-center gap-3" aria-label="926">
              {["9", "2", "6"].map((digit, index) => (
                <span
                  key={digit}
                  className={`flex size-7 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-500 ${
                    index === 0
                      ? "border-[#a15f43] bg-[#a15f43] text-white"
                      : "border-[#8c9a8e]/40 text-[#68766b] dark:text-[#c1cbbd]"
                  }`}
                >
                  {digit}
                </span>
              ))}
            </div>
          ) : null}
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
                {copy.candidates}
              </p>
              <div className="flex flex-wrap gap-2">
                {copy.candidatesList.map((candidate, index) => (
                  <button
                    key={candidate}
                    type="button"
                    onClick={() => setSelectedCandidate(index)}
                    aria-pressed={step === 2 && (selectedCandidate ?? 1) === index}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b6748] ${
                      (selectedCandidate ?? 1) === index && step === 2
                        ? "border-[#70816e] bg-[#dce5d7] text-[#354738] dark:bg-[#425547] dark:text-white"
                        : "border-foreground/15 hover:bg-foreground/5"
                    }`}
                  >
                    {candidate}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="px-5 pb-5 sm:px-7 sm:pb-7">
        <p className="rounded-lg bg-foreground/[0.04] px-3 py-2 text-center text-[11px] tracking-wide text-muted-foreground">
          {copy.explanation}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-foreground/10 pt-4">
          <div className="flex gap-1.5" aria-label={locale === "zh" ? "故事进度" : "Story progress"}>
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
