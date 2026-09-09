"use client";

import { useEffect, useRef } from "react";
import { tickLabel, type EssayTick } from "@/lib/essay-labels";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function EssayScale({
  ticks,
  activeId,
  onSelect,
  onWheelDelta,
}: {
  ticks: EssayTick[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onWheelDelta?: (deltaY: number) => void;
}) {
  const { locale } = useI18n();
  const rootRef = useRef<HTMLElement>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const activeIndex = Math.max(
    0,
    ticks.findIndex((tick) => tick.id === activeId),
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const jump = (event: Event) => {
      const node = event.target as Node | null;
      const el = node instanceof Element ? node : node?.parentElement;
      const button = el?.closest("[data-tick-id]");
      if (!button || !root.contains(button)) return;
      event.preventDefault();
      event.stopPropagation();
      const id = button.getAttribute("data-tick-id");
      if (id) onSelectRef.current(id);
    };
            root.addEventListener("pointerdown", jump, true);
            root.addEventListener("click", jump, true);
            root.setAttribute("data-cindy-bound", "1");
    return () => {
      root.removeEventListener("pointerdown", jump, true);
      root.removeEventListener("click", jump, true);
    };
  }, [ticks.length]);

  if (ticks.length < 2) return null;

  return (
    <aside
      ref={rootRef}
      className="essay-scale pointer-events-auto absolute inset-y-0 right-0 z-30 hidden w-[9.25rem] flex-col justify-center bg-gradient-to-l from-[#fcf4e8] from-70% to-transparent py-8 pr-3 pl-2 text-[#1a1a1a] min-[951px]:flex dark:from-[#1b1814] dark:text-[#f3ead8]"
      aria-label={locale === "zh" ? "章节刻度" : "Section scale"}
      onWheel={(event) => {
        if (!onWheelDelta) return;
        event.preventDefault();
        onWheelDelta(event.deltaY);
      }}
    >
      <div className="pointer-events-none absolute top-12 bottom-12 right-[14px] w-px bg-[#1a1a1a]/20 dark:bg-[#f3ead8]/25" />
      <ol className="relative flex flex-col justify-center">
        {ticks.map((tick, i) => {
          const distance = Math.abs(i - activeIndex);
          const isActive = tick.id === activeId || (activeId === null && i === 0);
          const label = tickLabel(locale, tick);
          const size = Math.max(11, 14 - distance);
          const opacity = Math.max(0.38, 1 - distance * 0.12);
          return (
            <li key={tick.id} className="h-8">
              <button
                type="button"
                data-tick-id={tick.id}
                ref={(el) => {
                  if (!el) return;
                  el.onclick = (event) => {
                    event.preventDefault();
                    onSelectRef.current(tick.id);
                  };
                  el.onpointerdown = (event) => {
                    event.preventDefault();
                    onSelectRef.current(tick.id);
                  };
                }}
                onWheel={(event) => {
                  if (!onWheelDelta) return;
                  event.preventDefault();
                  onWheelDelta(event.deltaY);
                }}
                aria-current={isActive ? "true" : undefined}
                title={label}
                className={cn(
                  "pointer-events-auto flex h-8 w-full cursor-pointer items-center justify-end gap-2 text-right hover:opacity-100 [&_*]:pointer-events-none",
                  isActive ? "font-bold" : "font-medium",
                )}
                style={{ fontSize: `${size}px`, opacity }}
              >
                <span className="min-w-0 truncate">{label}</span>
                <span
                  className={cn(
                    "relative z-[1] essay-scale-tick block shrink-0 bg-[#1a1a1a] dark:bg-[#f3ead8]",
                    isActive ? "h-[2px] w-5" : "h-px w-2.5 opacity-70",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
