"use client";

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
  const activeIndex = Math.max(
    0,
    ticks.findIndex((tick) => tick.id === activeId),
  );

  if (ticks.length < 2) return null;

  return (
    <aside
      className="essay-scale pointer-events-none absolute inset-y-0 right-0 z-20 hidden w-[9.25rem] flex-col justify-center bg-gradient-to-l from-[#fcf4e8] from-70% to-transparent py-8 pr-3 pl-2 text-[#1a1a1a] min-[701px]:flex"
      aria-label={locale === "zh" ? "章节刻度" : "Section scale"}
      onWheel={(event) => {
        if (!onWheelDelta) return;
        event.preventDefault();
        onWheelDelta(event.deltaY);
      }}
    >
      <div className="pointer-events-none absolute top-12 bottom-12 right-[14px] w-px bg-[#1a1a1a]/20" />
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
                onClick={() => onSelect(tick.id)}
                onWheel={(event) => {
                  if (!onWheelDelta) return;
                  event.preventDefault();
                  onWheelDelta(event.deltaY);
                }}
                aria-current={isActive ? "true" : undefined}
                title={label}
                className={cn(
                  "pointer-events-auto flex h-8 w-full cursor-pointer items-center justify-end gap-2 text-right",
                  isActive ? "font-bold" : "font-medium",
                )}
                style={{ fontSize: `${size}px`, opacity }}
              >
                <span className="min-w-0 truncate">{label}</span>
                <span
                  className={cn(
                    "relative z-[1] block shrink-0 bg-[#1a1a1a]",
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
