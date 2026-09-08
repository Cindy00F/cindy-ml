"use client";

import { articles } from "@/lib/articles";

const palettes: Record<string, [string, string, string]> = {
  "neural-networks": ["#c45c26", "#e8b298", "#5c2a12"],
  "equality-of-odds": ["#2f6f64", "#9dcdc4", "#12332e"],
  "logistic-regression": ["#3d5a99", "#b7c6e8", "#1b2a4a"],
  "linear-regression": ["#b4532a", "#f0c3a8", "#4a1f10"],
  "reinforcement-learning": ["#6b4ea1", "#d0c0ee", "#2c1d4a"],
  "roc-auc": ["#8a3a4a", "#e4b4bc", "#3a151c"],
  "cross-validation": ["#2d6a4f", "#a8d4c0", "#123226"],
  "train-test-validation": ["#b08900", "#ead889", "#4a3800"],
  "precision-recall": ["#9c4a1a", "#efc3a4", "#3e1c0a"],
  "random-forest": ["#1f6b3a", "#a4d4b4", "#0d2f19"],
  "decision-tree": ["#4a7c2c", "#c5e0a8", "#1d330e"],
  "bias-variance": ["#7a3e6d", "#e0b8d6", "#35182f"],
  "double-descent": ["#1f4e79", "#a9c6e3", "#0c243a"],
  "double-descent-2": ["#153e66", "#97b8d6", "#081f35"],
};

export function ArticleThumb({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const article = articles.find((a) => a.slug === slug);
  const [a, b, c] = palettes[slug] ?? ["#c45c26", "#e8b298", "#5c2a12"];
  return (
    <svg
      viewBox="0 0 360 200"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`g-${slug}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a} />
          <stop offset="100%" stopColor={c} />
        </linearGradient>
      </defs>
      <rect width="360" height="200" fill={`url(#g-${slug})`} />
      <g opacity="0.35" fill={b}>
        {Array.from({ length: 18 }, (_, i) => (
          <circle
            key={i}
            cx={30 + ((i * 47) % 320)}
            cy={40 + ((i * 31) % 140)}
            r={6 + (i % 4) * 2}
          />
        ))}
      </g>
      <path
        d="M20 150 C 80 60, 140 170, 200 90 S 300 40, 340 110"
        fill="none"
        stroke={b}
        strokeWidth="3"
        opacity="0.9"
      />
      <text
        x="24"
        y="178"
        fill="white"
        fontSize="13"
        opacity="0.85"
        fontFamily="ui-sans-serif, system-ui"
      >
        {article?.title.en}
      </text>
    </svg>
  );
}
