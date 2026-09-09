"use client";

import { useId, useRef } from "react";
import { PetCluster } from "@/components/pet-icons";
import { articles } from "@/lib/articles";

function Frame({
  children,
  title,
  paper,
  clipId,
}: {
  children: React.ReactNode;
  title?: string;
  paper?: boolean;
  clipId?: string;
}) {
  return (
    <>
      <rect width="520" height="300" className="fill-background" />
      <rect
        x="16"
        y="16"
        width="488"
        height="268"
        className={paper ? "pet-frame-paper stroke-foreground/20" : "fill-none stroke-foreground/25"}
      />
      {paper && clipId ? (
        <defs>
          <clipPath id={clipId}>
            <rect x="16" y="16" width="488" height="268" />
          </clipPath>
        </defs>
      ) : null}
      {title ? (
        <text
          x="36"
          y="48"
          className="fill-foreground"
          fontSize="13"
          fontFamily="var(--font-outfit), var(--font-noto-sans-sc), sans-serif"
        >
          {title}
        </text>
      ) : null}
      {paper && clipId ? <g clipPath={`url(#${clipId})`}>{children}</g> : children}
    </>
  );
}

function drawing(
  slug: string,
  title: string,
  opts: { playable?: boolean; clipId: string; onDragged?: () => void },
) {
  switch (slug) {
    case "train-test-validation":
      return (
        <Frame paper clipId={opts.clipId}>
          <PetCluster draggable={opts.playable} onDragged={opts.onDragged} />
        </Frame>
      );
    case "linear-regression":
      return (
        <Frame title={title}>
          <line x1="48" x2="480" y1="250" y2="250" className="stroke-foreground/25" />
          <line x1="48" x2="48" y1="70" y2="250" className="stroke-foreground/25" />
          <line x1="70" y1="230" x2="460" y2="96" className="stroke-foreground" strokeWidth="1.7" />
          {[
            [90, 210],
            [150, 188],
            [210, 160],
            [270, 150],
            [330, 128],
            [390, 118],
            [440, 92],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="5" className="fill-foreground" />
          ))}
        </Frame>
      );
    case "logistic-regression":
      return (
        <Frame title={title}>
          <line x1="48" x2="480" y1="250" y2="250" className="stroke-foreground/25" />
          <polyline
            fill="none"
            className="stroke-foreground"
            strokeWidth="1.7"
            points="60,230 120,226 180,214 240,180 300,120 360,88 420,78 470,74"
          />
          <line x1="48" x2="480" y1="160" y2="160" className="stroke-foreground/30" strokeDasharray="4 4" />
        </Frame>
      );
    case "neural-networks":
      return (
        <Frame title={title}>
          {[70, 70, 70].map((x, layer) =>
            Array.from({ length: layer === 1 ? 4 : 3 }, (_, i) => {
              const cx = 90 + layer * 150;
              const cy = 110 + i * 44 + (layer === 1 ? 0 : 22);
              return <circle key={`${layer}-${i}`} cx={cx} cy={cy} r="14" className="fill-none stroke-foreground" />;
            }),
          )}
          {[0, 1, 2].map((a) =>
            [0, 1, 2, 3].map((b) => (
              <line
                key={`ab${a}${b}`}
                x1="104"
                y1={132 + a * 44}
                x2="226"
                y2={110 + b * 44}
                className="stroke-foreground/25"
              />
            )),
          )}
        </Frame>
      );
    case "roc-auc":
      return (
        <Frame title={title}>
          <line x1="80" x2="440" y1="250" y2="250" className="stroke-foreground/25" />
          <line x1="80" x2="80" y1="80" y2="250" className="stroke-foreground/25" />
          <line x1="80" y1="250" x2="440" y2="80" className="stroke-foreground/20" strokeDasharray="5 4" />
          <polyline
            fill="none"
            className="stroke-foreground"
            strokeWidth="1.8"
            points="80,250 140,200 190,150 250,120 320,100 390,88 440,80"
          />
        </Frame>
      );
    case "cross-validation":
      return (
        <Frame title={title}>
          {Array.from({ length: 5 }, (_, fold) =>
            Array.from({ length: 5 }, (_, i) => (
              <rect
                key={`${fold}-${i}`}
                x={48 + i * 86}
                y={80 + fold * 38}
                width="78"
                height="28"
                className={i === fold ? "fill-foreground" : "fill-none stroke-foreground/50"}
              />
            )),
          )}
        </Frame>
      );
    case "precision-recall":
      return (
        <Frame title={title}>
          <rect x="90" y="80" width="150" height="90" className="fill-foreground/10 stroke-foreground" />
          <rect x="240" y="80" width="150" height="90" className="fill-none stroke-foreground" />
          <rect x="90" y="170" width="150" height="90" className="fill-none stroke-foreground" />
          <rect x="240" y="170" width="150" height="90" className="fill-foreground/10 stroke-foreground" />
          <text x="145" y="132" className="fill-foreground" fontSize="14">
            TP
          </text>
          <text x="295" y="132" className="fill-foreground" fontSize="14">
            FP
          </text>
          <text x="145" y="222" className="fill-foreground" fontSize="14">
            FN
          </text>
          <text x="295" y="222" className="fill-foreground" fontSize="14">
            TN
          </text>
        </Frame>
      );
    case "random-forest":
      return (
        <Frame title={title}>
          {[0, 1, 2].map((t) => (
            <g key={t} transform={`translate(${70 + t * 145} 70)`}>
              <line x1="50" x2="50" y1="40" y2="190" className="stroke-foreground" />
              <line x1="50" x2="18" y1="80" y2="120" className="stroke-foreground" />
              <line x1="50" x2="86" y1="80" y2="120" className="stroke-foreground" />
              <line x1="18" x2="4" y1="120" y2="160" className="stroke-foreground" />
              <line x1="18" x2="36" y1="120" y2="160" className="stroke-foreground" />
              <circle cx="50" cy="40" r="8" className="fill-background stroke-foreground" />
            </g>
          ))}
        </Frame>
      );
    case "decision-tree":
      return (
        <Frame title={title}>
          <circle cx="260" cy="80" r="16" className="fill-none stroke-foreground" />
          <line x1="260" y1="96" x2="160" y2="150" className="stroke-foreground" />
          <line x1="260" y1="96" x2="360" y2="150" className="stroke-foreground" />
          <circle cx="160" cy="166" r="16" className="fill-none stroke-foreground" />
          <circle cx="360" cy="166" r="16" className="fill-none stroke-foreground" />
          <line x1="160" y1="182" x2="110" y2="236" className="stroke-foreground" />
          <line x1="160" y1="182" x2="210" y2="236" className="stroke-foreground" />
          <rect x="96" y="236" width="28" height="20" className="fill-none stroke-foreground" />
          <rect x="196" y="236" width="28" height="20" className="fill-none stroke-foreground" />
        </Frame>
      );
    case "bias-variance":
      return (
        <Frame title={title}>
          <circle cx="260" cy="160" r="78" className="fill-none stroke-foreground/30" />
          <circle cx="260" cy="160" r="48" className="fill-none stroke-foreground/50" />
          <circle cx="260" cy="160" r="16" className="fill-none stroke-foreground" />
          {[
            [248, 148],
            [270, 152],
            [255, 170],
            [272, 168],
            [260, 158],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" className="fill-foreground" />
          ))}
        </Frame>
      );
    case "double-descent":
    case "double-descent-2":
      return (
        <Frame title={title}>
          <line x1="48" x2="480" y1="250" y2="250" className="stroke-foreground/25" />
          <line x1="48" x2="48" y1="70" y2="250" className="stroke-foreground/25" />
          <polyline
            fill="none"
            className="stroke-foreground"
            strokeWidth="1.7"
            points="60,90 140,200 220,120 280,70 340,150 400,210 470,110"
          />
          <line x1="280" x2="280" y1="70" y2="250" className="stroke-foreground/30" strokeDasharray="4 4" />
        </Frame>
      );
    case "reinforcement-learning":
      return (
        <Frame title={title}>
          <circle cx="140" cy="160" r="36" className="fill-none stroke-foreground" />
          <rect x="320" y="124" width="72" height="72" className="fill-none stroke-foreground" />
          <path d="M176 160 H318" className="stroke-foreground" markerEnd="url(#arrow)" />
          <path d="M356 210 C 260 260 180 240 140 196" className="fill-none stroke-foreground" />
          <text x="230" y="148" className="fill-foreground" fontSize="11">
            action
          </text>
          <text x="210" y="250" className="fill-foreground" fontSize="11">
            reward
          </text>
        </Frame>
      );
    case "equality-of-odds":
      return (
        <Frame title={title}>
          <line x1="80" x2="240" y1="240" y2="240" className="stroke-foreground/25" />
          <line x1="80" x2="80" y1="80" y2="240" className="stroke-foreground/25" />
          <polyline fill="none" className="stroke-foreground" strokeWidth="1.6" points="80,240 120,160 180,120 240,90" />
          <line x1="280" x2="440" y1="240" y2="240" className="stroke-foreground/25" />
          <line x1="280" x2="280" y1="80" y2="240" className="stroke-foreground/25" />
          <polyline fill="none" className="stroke-foreground" strokeWidth="1.6" points="280,240 330,190 380,140 440,110" />
          <text x="140" y="268" className="fill-foreground/60" fontSize="11">
            group A
          </text>
          <text x="340" y="268" className="fill-foreground/60" fontSize="11">
            group B
          </text>
        </Frame>
      );
    default:
      return (
        <Frame title={title}>
          <polyline
            fill="none"
            className="stroke-foreground"
            strokeWidth="1.6"
            points="60,200 120,160 180,180 240,120 300,140 360,90 440,110"
          />
        </Frame>
      );
  }
}

export function ArticleThumb({
  slug,
  className = "",
  playable = false,
}: {
  slug: string;
  className?: string;
  playable?: boolean;
}) {
  const article = articles.find((a) => a.slug === slug);
  const clipId = useId().replace(/:/g, "");
  const skipNav = useRef(false);

  return (
    <svg
      viewBox="0 0 520 300"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      onClick={(e) => {
        if (!skipNav.current) return;
        e.preventDefault();
        e.stopPropagation();
        skipNav.current = false;
      }}
    >
      {drawing(slug, article?.title.en ?? "", {
        playable,
        clipId: `pet-frame-${clipId}`,
        onDragged: () => {
          skipNav.current = true;
        },
      })}
    </svg>
  );
}
