"use client";

import { useId, useRef } from "react";
import { useRouter } from "next/navigation";
import { PetCluster } from "@/components/pet-icons";
import { articles } from "@/lib/articles";
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

  if (figure) {
    return (
      <img
        src={withBase(figure)}
        alt={article?.title.zh ?? ""}
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
