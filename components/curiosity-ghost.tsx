"use client";

import { useState, type PointerEvent } from "react";
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
  delay: number;
};

const LINES = {
  zh: ["刚捡到一个灵感！", "嘿，你看这个！", "等等，我找到啦！", "再陪我玩一下？"],
  en: ["A tiny spark of inspiration!", "Hey, look what I found!", "Wait, got one!", "One more round?"],
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
    delay: Math.round(Math.random() * 180),
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
  const [line, setLine] = useState(LINES.zh[0]);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });

  const play = () => {
    const nextSparks = makeSparks();
    setSparks(nextSparks);
    setCollected(randomItem(nextSparks).symbol);
    setGhostColor(randomItem(COLORS));
    setLine(randomItem(zh ? LINES.zh : LINES.en));
    setMood((current) => current + 1);
  };

  const followPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    setGaze({ x: Math.max(-1, Math.min(1, x)) * 1.5, y: Math.max(-1, Math.min(1, y)) * 1.5 });
  };

  return (
    <div
      className="fixed right-4 bottom-5 z-[160] min-[701px]:right-[10rem]"
      onPointerEnter={() => {
        setHovered(true);
        play();
      }}
      onPointerMove={followPointer}
      onPointerLeave={() => {
        setHovered(false);
        setGaze({ x: 0, y: 0 });
      }}
    >
      {hovered || open ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-[5.25rem] -left-28 h-[4.5rem] w-48"
        >
          {sparks.map((spark) => (
            <span
              key={`${mood}-${spark.id}`}
              className="curiosity-ghost-spark absolute inline-flex min-h-7 min-w-7 items-center justify-center rounded-md px-1.5 font-mono text-sm font-bold text-white shadow-md"
              style={{
                left: `${spark.left}%`,
                top: `${spark.top}%`,
                backgroundColor: spark.color,
                rotate: `${spark.rotation}deg`,
                animationDelay: `${spark.delay}ms`,
              }}
            >
              {spark.symbol}
            </span>
          ))}
        </div>
      ) : null}

      {hovered || open ? (
        <p
          aria-hidden="true"
          className="curiosity-ghost-line pointer-events-none absolute -top-12 right-10 max-w-48 rounded-2xl rounded-br-sm bg-background px-3 py-2 text-xs font-medium shadow-lg"
        >
          {line}
        </p>
      ) : null}

      {open ? (
        <div
          id="curiosity-ghost-note"
          role="status"
          className="absolute right-0 bottom-[4.5rem] w-64 rounded-2xl border border-foreground/10 bg-background/95 p-4 text-sm shadow-xl backdrop-blur"
        >
          <p className="font-medium">{zh ? `它捡到了 ${collected}` : `It found ${collected}`}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {zh ? "再点一下，看看这次遇到什么。" : "Tap again to see what turns up next."}
          </p>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="group mt-2 -ml-2"
            onClick={play}
          >
            <RefreshCw aria-hidden="true" className="transition-transform group-hover:rotate-180" />
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
        onFocus={() => {
          setHovered(true);
          play();
        }}
        onBlur={() => setHovered(false)}
        onClick={() => {
          play();
          setOpen((current) => !current);
        }}
        className="group relative inline-flex size-14 items-center justify-center rounded-full border border-foreground/10 bg-background/90 shadow-lg backdrop-blur transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
      >
        <svg
          key={mood}
          viewBox="0 0 64 64"
          aria-hidden="true"
          className={`size-11 ${hovered || open ? "curiosity-ghost-excited" : "curiosity-ghost-idle"}`}
        >
          <path
            d="M32 7c-12.4 0-22 9.5-22 22v20.2c0 3 3.5 4.5 5.7 2.4l5.2-5 5.2 5c2.2 2.1 5.7.6 5.7-2.4v-2.1l5.2 5c2.2 2.1 5.7.6 5.7-2.4v-3.1l5.6 4.1c2.2 1.6 5.3 0 5.3-2.8V29C53.6 16.8 44.2 7 32 7Z"
            fill={ghostColor}
            className="transition-colors duration-300"
          />
          <g transform={`translate(${gaze.x} ${gaze.y})`}>
            <circle cx="24" cy="28" r="2" fill="#fff" />
            <circle cx="40" cy="28" r="2" fill="#fff" />
          </g>
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
