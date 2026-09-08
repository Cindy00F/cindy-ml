"use client";

import { articles } from "@/lib/articles";

export function ArticleThumb({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const article = articles.find((a) => a.slug === slug);
  const seed = slug.length;
  return (
    <svg
      viewBox="0 0 520 300"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="520" height="300" className="fill-muted" />
      <rect x="24" y="24" width="472" height="252" className="fill-background stroke-foreground/20" />
      {Array.from({ length: 6 }, (_, i) => (
        <line
          key={`h${i}`}
          x1="48"
          x2="472"
          y1={70 + i * 32}
          y2={70 + i * 32}
          className="stroke-foreground/10"
        />
      ))}
      <polyline
        fill="none"
        className="stroke-foreground"
        strokeWidth="1.6"
        points={Array.from({ length: 12 }, (_, i) => {
          const x = 56 + i * 36;
          const y = 210 - ((Math.sin(i * 0.7 + seed) + 1) * 70 + (i % 3) * 8);
          return `${x},${y}`;
        }).join(" ")}
      />
      {Array.from({ length: 8 }, (_, i) => (
        <rect
          key={`b${i}`}
          x={56 + i * 52}
          y={230 - ((i * 17 + seed * 9) % 90)}
          width="18"
          height={(i * 17 + seed * 9) % 90}
          className="fill-foreground/70"
        />
      ))}
      <text
        x="36"
        y="48"
        className="fill-foreground"
        fontSize="13"
        fontFamily="ui-serif, Georgia, serif"
      >
        {article?.title.en}
      </text>
    </svg>
  );
}
