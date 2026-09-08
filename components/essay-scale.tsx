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
      className="essay-scale relative flex h-full w-[3.15rem] shrink-0 flex-col justify-center overflow-hidden border-l border-black/10 bg-[#fcf4e8] px-1 py-6 text-[#1a1a1a] md:w-[10.75rem] md:px-3"
      aria-label={locale === "zh" ? "章节刻度" : "Section scale"}
    >
      <div className="pointer-events-none absolute top-8 bottom-8 right-[11px] w-px bg-foreground/20 md:right-[18px]" />
      <ol className="relative flex flex-col justify-center gap-1">
        {ticks.map((tick, i) => {
          const distance = Math.abs(i - activeIndex);
          const isActive = tick.id === activeId || (activeId === null && i === 0);
          const scale = Math.max(0.62, 1 - distance * 0.09);
          const opacity = Math.max(0.28, 1 - distance * 0.14);
          const shift = Math.min(28, distance * 7);
          const label = tickLabel(locale, tick);
          return (
            <li key={tick.id}>
              <button
                type="button"
                onClick={() => onSelect(tick.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "group relative flex w-full items-center justify-end gap-2 py-0.5 text-right origin-right transition-[transform,opacity] duration-300 ease-out",
                  isActive ? "text-foreground" : "text-foreground/70",
                )}
                style={{
                  transform: `translateX(${shift}px) scale(${scale})`,
                  opacity,
                }}
              >
                <span
                  className={cn(
                    "hidden max-w-[7.4rem] truncate font-medium tracking-wide md:inline",
                    isActive ? "text-[13px] font-bold" : "text-[11px]",
                  )}
                >
                  {label}
                </span>
                <span
                  className={cn(
                    "relative z-[1] block h-px bg-foreground transition-all",
                    isActive ? "w-5 md:w-7" : "w-2.5 opacity-70 md:w-3.5",
                  )}
                />
                <span className="sr-only md:hidden">{label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
