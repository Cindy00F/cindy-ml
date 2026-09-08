"use client";

import { tickLabel, type EssayTick } from "@/lib/essay-labels";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function EssayScale({
  ticks,
  activeId,
  onSelect,
}: {
  ticks: EssayTick[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const { locale } = useI18n();
  const activeIndex = Math.max(
    0,
    ticks.findIndex((tick) => tick.id === activeId),
  );

  if (ticks.length < 2) return null;

  return (
    <aside
      className="essay-scale relative z-10 flex h-full w-[7.5rem] shrink-0 flex-col justify-center overflow-hidden border-l border-black/10 bg-[#fcf4e8] px-2 py-8 text-[#1a1a1a] sm:w-[10.5rem] sm:px-3"
      aria-label={locale === "zh" ? "章节刻度" : "Section scale"}
    >
      <div className="pointer-events-none absolute top-10 bottom-10 right-[13px] w-px bg-[#1a1a1a]/25 sm:right-[18px]" />
      <ol className="relative flex flex-col justify-center gap-0.5">
        {ticks.map((tick, i) => {
          const distance = Math.abs(i - activeIndex);
          const isActive = tick.id === activeId || (activeId === null && i === 0);
          const scale = Math.max(0.58, 1 - distance * 0.1);
          const opacity = Math.max(0.32, 1 - distance * 0.15);
          const shift = Math.min(36, distance * 8);
          const label = tickLabel(locale, tick);
          return (
            <li key={tick.id}>
              <button
                type="button"
                onClick={() => onSelect(tick.id)}
                aria-current={isActive ? "true" : undefined}
                title={label}
                className={cn(
                  "group relative flex w-full origin-right items-center justify-end gap-2 py-0.5 text-right transition-[transform,opacity] duration-300 ease-out",
                  isActive ? "text-[#1a1a1a]" : "text-[#1a1a1a]/70",
                )}
                style={{
                  transform: `translateX(${shift}px) scale(${scale})`,
                  opacity,
                }}
              >
                <span
                  className={cn(
                    "max-w-[5.6rem] truncate tracking-wide sm:max-w-[7.2rem]",
                    isActive ? "text-[12px] font-bold sm:text-[13px]" : "text-[10px] font-medium sm:text-[11px]",
                  )}
                >
                  {label}
                </span>
                <span
                  className={cn(
                    "relative z-[1] block h-px bg-[#1a1a1a] transition-all",
                    isActive ? "w-5 sm:w-7" : "w-2.5 opacity-70 sm:w-3.5",
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
