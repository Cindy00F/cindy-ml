"use client";

import { useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const SYMBOLS = ["λ", "∑", "π", "∞", "01", "✦", "?", "∴", "ƒ(x)", "eⁱ"];
const COLORS = ["#9b6bdb", "#e65d73", "#168c83", "#d28b19", "#3975d5", "#b7479a"];

type Spark = {
  id: number;
  symbol: string;
  color: string;
  left: number;
  top: number;
  rotation: number;
};

function randomItem<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function makeSparks(): Spark[] {
  return Array.from({ length: 5 }, (_, id) => ({
    id,
    symbol: randomItem(SYMBOLS),
    color: randomItem(COLORS),
    left: 5 + Math.random() * 85,
    top: 8 + Math.random() * 68,
    rotation: Math.round(Math.random() * 36 - 18),
  }));
}

export function CuriosityGhost() {
  const { locale } = useI18n();
  const zh = locale === "zh";
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [collected, setCollected] = useState("✦");
  const [ghostColor, setGhostColor] = useState(COLORS[0]);
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState(0);

  const play = () => {
    const nextSparks = makeSparks();
    setSparks(nextSparks);
    setCollected(randomItem(nextSparks).symbol);
    setGhostColor(randomItem(COLORS));
    setMood((current) => current + 1);
  };

  return (
    <div
      className="fixed right-4 bottom-5 z-[160] min-[701px]:right-[10rem]"
      onPointerEnter={() => {
        setHovered(true);
        play();
      }}
      onPointerLeave={() => setHovered(false)}
    >
      {hovered || open ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-[4.75rem] -left-28 h-[4.5rem] w-48"
        >
          {sparks.map((spark) => (
            <span
              key={spark.id}
              className="motion-safe:animate-bounce absolute inline-flex min-h-7 min-w-7 items-center justify-center rounded-md px-1.5 font-mono text-sm font-bold text-white shadow-md"
              style={{
                left: `${spark.left}%`,
                top: `${spark.top}%`,
                backgroundColor: spark.color,
                transform: `rotate(${spark.rotation}deg)`,
              }}
            >
              {spark.symbol}
            </span>
          ))}
        </div>
      ) : null}

      {open ? (
        <div
          id="curiosity-ghost-note"
          role="status"
          className="absolute right-0 bottom-[4.5rem] w-64 rounded-2xl border border-foreground/10 bg-background/95 p-4 text-sm shadow-xl backdrop-blur"
        >
          <p className="font-medium">
            {zh ? `小幽灵捡到了 ${collected}` : `The little ghost found ${collected}`}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {zh ? "再点一下，看看这次遇到什么。" : "Tap again to see what turns up next."}
          </p>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="mt-2 -ml-2"
            onClick={play}
          >
            <RefreshCw aria-hidden="true" />
            {zh ? "再捡一个" : "Find another"}
          </Button>
        </div>
      ) : null}

      <button
        type="button"
        aria-label={zh ? "和小幽灵玩一玩" : "Play with the little ghost"}
        aria-expanded={open}
        aria-controls="curiosity-ghost-note"
        title={zh ? "和小幽灵玩一玩" : "Play with the little ghost"}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onClick={() => {
          play();
          setOpen((current) => !current);
        }}
        className="group relative inline-flex size-14 items-center justify-center rounded-full border border-foreground/10 bg-background/90 shadow-lg backdrop-blur transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
      >
        <svg
          viewBox="0 0 64 64"
          aria-hidden="true"
          className="size-11 transition-transform duration-300 group-hover:-rotate-6 motion-reduce:transition-none"
        >
          <path
            d="M32 7c-12.4 0-22 9.5-22 22v20.2c0 3 3.5 4.5 5.7 2.4l5.2-5 5.2 5c2.2 2.1 5.7.6 5.7-2.4v-2.1l5.2 5c2.2 2.1 5.7.6 5.7-2.4v-3.1l5.6 4.1c2.2 1.6 5.3 0 5.3-2.8V29C53.6 16.8 44.2 7 32 7Z"
            fill={ghostColor}
            className="transition-colors duration-300"
          />
          {mood % 3 === 1 ? (
            <>
              <path d="M22 28h7" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
              <circle cx="40" cy="28" r="2" fill="#fff" />
            </>
          ) : mood % 3 === 2 ? (
            <>
              <circle cx="24" cy="28" r="2" fill="#fff" />
              <path d="M36 28h7" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="24" cy="28" r="2" fill="#fff" />
              <circle cx="40" cy="28" r="2" fill="#fff" />
            </>
          )}
          <path
            d={mood % 2 === 0 ? "M27 37q5 5 10 0" : "M27 38q5-4 10 0"}
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <Sparkles
            x="40"
            y="8"
            size={12}
            color="white"
            strokeWidth={2.5}
          />
        </svg>
        <span className="sr-only">{zh ? "点我捡一个随机字符" : "Tap to find a random symbol"}</span>
      </button>
    </div>
  );
}
