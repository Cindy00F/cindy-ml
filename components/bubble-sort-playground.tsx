"use client";

import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaygroundFrame } from "@/components/playground-frame";
import { useI18n } from "@/lib/i18n";

const INITIAL_VALUES = [7, 4, 2, 1, 8, 3, 6, 5];
const NEARLY_SORTED_VALUES = [2, 1, 3, 4, 5, 6, 7, 8];

type SortState = {
  values: number[];
  pass: number;
  compareIndex: number;
  comparisons: number;
  swaps: number;
  swappedThisPass: boolean;
  sortedFrom: number;
  done: boolean;
  message: "ready" | "swap" | "keep" | "sorted";
  lastLeft: number | null;
  lastRight: number | null;
};

function createInitialState(values = INITIAL_VALUES): SortState {
  return {
    values: [...values],
    pass: 0,
    compareIndex: 0,
    comparisons: 0,
    swaps: 0,
    swappedThisPass: false,
    sortedFrom: values.length,
    done: false,
    message: "ready",
    lastLeft: null,
    lastRight: null,
  };
}

function advance(state: SortState): SortState {
  if (state.done) return state;

  const values = [...state.values];
  const leftIndex = state.compareIndex;
  const left = values[leftIndex];
  const right = values[leftIndex + 1];
  const shouldSwap = left > right;

  if (shouldSwap) {
    values[leftIndex] = right;
    values[leftIndex + 1] = left;
  }

  const next: SortState = {
    ...state,
    values,
    comparisons: state.comparisons + 1,
    swaps: state.swaps + Number(shouldSwap),
    swappedThisPass: state.swappedThisPass || shouldSwap,
    message: shouldSwap ? "swap" : "keep",
    lastLeft: left,
    lastRight: right,
  };

  const lastPairIndex = values.length - state.pass - 2;
  if (leftIndex < lastPairIndex) {
    next.compareIndex += 1;
    return next;
  }

  const completedPass = state.pass + 1;
  next.pass = completedPass;
  next.sortedFrom = values.length - completedPass;
  next.compareIndex = 0;

  if (!next.swappedThisPass || completedPass >= values.length - 1) {
    next.done = true;
    next.sortedFrom = 0;
    next.message = "sorted";
  } else {
    next.swappedThisPass = false;
  }

  return next;
}

function Penguin({ value, active }: { value: number; active: boolean }) {
  return (
    <svg
      viewBox="0 0 48 72"
      role="img"
      aria-label={`Penguin ${value}`}
      className={`h-[4.5rem] w-10 shrink-0 transition-transform ${active ? "-translate-y-1" : ""}`}
    >
      <ellipse cx="24" cy="65" rx="16" ry="3" className="fill-foreground/10" />
      <ellipse cx="24" cy="44" rx="15" ry="22" fill="#263449" />
      <ellipse cx="24" cy="48" rx="10" ry="15" fill="#f5f1e9" />
      <circle cx="24" cy="21" r="14" fill="#263449" />
      <ellipse cx="24" cy="24" rx="9" ry="8" fill="#f5f1e9" />
      <circle cx="21" cy="22" r="1.4" fill="#18212e" />
      <circle cx="27" cy="22" r="1.4" fill="#18212e" />
      <path d="m22 26 2 2 2-2" fill="#e69b44" />
      <path d="M11 35c8 4 18 4 26 0v5c-8 4-18 4-26 0z" fill="#ba6357" />
      <text
        x="24"
        y="52"
        textAnchor="middle"
        className="fill-[#263449] font-mono text-[11px] font-bold"
      >
        {value}
      </text>
      <path d="M15 65c2-2 5-2 8 0m2 0c3-2 6-2 8 0" fill="none" stroke="#e69b44" strokeWidth="2.5" />
    </svg>
  );
}

export function BubbleSortPlayground() {
  const { locale } = useI18n();
  const zh = locale === "zh";
  const [state, setState] = useState(createInitialState);
  const [playing, setPlaying] = useState(false);
  const isPlaying = playing && !state.done;

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setTimeout(() => {
      setState((current) => advance(current));
    }, 850);
    return () => window.clearTimeout(timer);
  }, [isPlaying, state]);

  const reset = () => {
    setPlaying(false);
    setState(createInitialState());
  };

  const loadExample = (values: number[]) => {
    setPlaying(false);
    setState(createInitialState(values));
  };

  const message =
    state.message === "ready"
      ? zh
        ? "从队首开始：只比较挨在一起的两只企鹅。"
        : "Start at the front: compare only neighboring penguins."
      : state.message === "sorted"
        ? zh
          ? "队伍排好了！没有交换的一轮，说明可以提前停下。"
          : "The line is sorted! A pass with no swaps means we can stop early."
        : state.message === "swap"
          ? zh
            ? `${state.lastLeft} 比 ${state.lastRight} 大，交换位置。`
            : `${state.lastLeft} is greater than ${state.lastRight}; swap them.`
          : zh
            ? `${state.lastLeft} 不大于 ${state.lastRight}，这对不动。`
            : `${state.lastLeft} is not greater than ${state.lastRight}; keep this pair.`;

  return (
    <PlaygroundFrame
      title={zh ? "企鹅排队 · 冒泡排序" : "Penguins in line · Bubble sort"}
      hint={
        zh
          ? "点击“下一步”逐次比较，或自动播放；黄色是当前比较的一对，绿色是已经排好的位置。"
          : "Step through each comparison or play automatically. Yellow marks the current pair; green marks positions already sorted."
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl bg-[#e9eff3] px-2 py-3 dark:bg-[#263449]/45">
          <div className="flex items-end justify-center gap-0.5">
            {state.values.map((value, index) => {
              const isActive =
                !state.done &&
                (index === state.compareIndex || index === state.compareIndex + 1);
              const isSorted = index >= state.sortedFrom;
              return (
                <div
                  key={value}
                  className={`flex min-w-0 flex-1 flex-col items-center rounded-lg py-1 ${
                    isActive ? "bg-[#e9c46a]/45" : isSorted ? "bg-[#8bb59c]/25" : ""
                  }`}
                >
                  <Penguin value={value} active={isActive} />
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 min-h-10 text-center text-sm leading-5" aria-live="polite">
            {message}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              if (state.done) return;
              setPlaying(!isPlaying);
            }}
            disabled={state.done}
          >
            {isPlaying ? <Pause /> : <Play />}
            {isPlaying ? (zh ? "暂停" : "Pause") : zh ? "自动播放" : "Auto play"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setState((current) => advance(current))}
            disabled={state.done || isPlaying}
          >
            <StepForward />
            {zh ? "下一步" : "Next step"}
          </Button>
          <Button size="sm" variant="ghost" onClick={reset}>
            <RotateCcw />
            {zh ? "重来" : "Reset"}
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>{zh ? "试试队列：" : "Try a line:"}</span>
          <Button size="sm" variant="outline" onClick={() => loadExample(INITIAL_VALUES)}>
            {zh ? "图片里的数字" : "Picture example"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => loadExample(NEARLY_SORTED_VALUES)}>
            {zh ? "几乎排好" : "Nearly sorted"}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="rounded-lg bg-muted/60 px-3 py-2">
            {zh ? "已比较" : "Comparisons"}{" "}
            <span className="font-mono tabular-nums text-foreground">{state.comparisons}</span>
          </div>
          <div className="rounded-lg bg-muted/60 px-3 py-2">
            {zh ? "已交换" : "Swaps"}{" "}
            <span className="font-mono tabular-nums text-foreground">{state.swaps}</span>
          </div>
        </div>
      </div>
    </PlaygroundFrame>
  );
}
