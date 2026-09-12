"use client";

import { useId, useRef } from "react";
import { useRouter } from "next/navigation";
import { PetCluster } from "@/components/pet-icons";
import { articles } from "@/lib/articles";
import { useI18n } from "@/lib/i18n";
import { withBase } from "@/lib/site";

const FIGURES: Record<string, string> = {
  "neural-networks": "/thumbs/neural-networks.png",
  "equality-of-odds": "/thumbs/equality-of-odds.png",
  "logistic-regression": "/thumbs/logistic-regression.png",
  "linear-regression": "/thumbs/linear-regression.jpg",
  "reinforcement-learning": "/thumbs/reinforcement-learning.jpg",
  "roc-auc": "/thumbs/roc-auc.png",
  "cross-validation": "/thumbs/cross-validation.png",
  "precision-recall": "/thumbs/precision-recall.png",
  "random-forest": "/thumbs/random-forest.png",
  "decision-tree": "/thumbs/decision-tree.png",
  "bias-variance": "/thumbs/bias-variance.png",
  "double-descent": "/thumbs/double-descent.png",
  "double-descent-2": "/thumbs/double-descent-2.png",
};

function Frame({
  children,
  paper,
  clipId,
}: {
  children: React.ReactNode;
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
      {paper && clipId ? <g clipPath={`url(#${clipId})`}>{children}</g> : children}
    </>
  );
}

export function ArticleThumb({
  slug,
  className = "",
  playable = false,
  href,
}: {
  slug: string;
  className?: string;
  playable?: boolean;
  href?: string;
}) {
  const router = useRouter();
  const { locale } = useI18n();
  const article = articles.find((a) => a.slug === slug);
  const clipId = useId().replace(/:/g, "");
  const draggedAt = useRef(0);
  const figure = FIGURES[slug];

  const go = (event: { preventDefault: () => void; stopPropagation: () => void }) => {
    if (Date.now() - draggedAt.current < 500) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (href) {
      event.preventDefault();
      router.push(href);
    }
  };

  if (slug === "rfm-pharmacy") {
    return (
      <svg
        viewBox="0 0 520 300"
        className={className}
        aria-hidden={!href}
        preserveAspectRatio="xMidYMid meet"
        onClick={go}
      >
        <Frame paper>
          <text x="36" y="58" className="fill-foreground text-[18px]">
            RFM
          </text>
          <text x="36" y="82" className="fill-foreground/50 text-[11px]">
            城南康宁 545 · 核心
          </text>
          {[
            { x: 36, h: 120 },
            { x: 86, h: 88 },
            { x: 136, h: 150 },
          ].map((bar) => (
            <rect
              key={bar.x}
              x={bar.x}
              y={230 - bar.h}
              width="32"
              height={bar.h}
              className="fill-foreground/70"
            />
          ))}
          <text x="42" y="248" className="fill-foreground/45 text-[11px]">
            R
          </text>
          <text x="92" y="248" className="fill-foreground/45 text-[11px]">
            F
          </text>
          <text x="142" y="248" className="fill-foreground/45 text-[11px]">
            M
          </text>
          {[
            [240, 70],
            [300, 110],
            [360, 90],
            [420, 150],
            [280, 180],
            [390, 200],
          ].map(([x, y], i) => (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="48"
              height="22"
              className={i % 2 ? "fill-foreground/25" : "fill-foreground/55"}
            />
          ))}
        </Frame>
      </svg>
    );
  }

  if (slug === "kmeans-territory") {
    return (
      <svg
        viewBox="0 0 520 300"
        className={className}
        aria-hidden={!href}
        preserveAspectRatio="xMidYMid meet"
        onClick={go}
      >
        <Frame paper>
          {[
            { x: 90, y: 80, c: "#c45c26" },
            { x: 130, y: 120, c: "#c45c26" },
            { x: 70, y: 140, c: "#c45c26" },
            { x: 280, y: 90, c: "#2f6f64" },
            { x: 330, y: 70, c: "#2f6f64" },
            { x: 360, y: 130, c: "#2f6f64" },
            { x: 200, y: 190, c: "#3d5a99" },
            { x: 240, y: 220, c: "#3d5a99" },
            { x: 170, y: 230, c: "#3d5a99" },
            { x: 400, y: 200, c: "#8a3a4a" },
            { x: 440, y: 170, c: "#8a3a4a" },
          ].map((p) => (
            <circle key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} r="7" fill={p.c} />
          ))}
          {[
            { x: 100, y: 110, c: "#c45c26" },
            { x: 330, y: 100, c: "#2f6f64" },
            { x: 210, y: 210, c: "#3d5a99" },
            { x: 420, y: 190, c: "#8a3a4a" },
          ].map((p) => (
            <rect key={`c-${p.x}`} x={p.x - 8} y={p.y - 8} width="16" height="16" fill={p.c} className="stroke-foreground" />
          ))}
        </Frame>
      </svg>
    );
  }

  if (figure) {
    return (
      <img
        src={withBase(figure)}
        alt={article?.title[locale] ?? ""}
        className={`bg-[#fcf4e8] object-cover ${className}`}
        style={{ aspectRatio: "520 / 300" }}
        onClick={go}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 520 300"
      className={className}
      aria-hidden={!href}
      preserveAspectRatio="xMidYMid meet"
      onDragStart={(e) => e.preventDefault()}
      onClick={go}
    >
      <Frame paper clipId={`pet-frame-${clipId}`}>
        <PetCluster
          draggable={playable}
          onDragged={() => {
            draggedAt.current = Date.now();
          }}
        />
      </Frame>
    </svg>
  );
}
