"use client";

import Image from "next/image";
import { useId, useRef } from "react";
import { useRouter } from "next/navigation";
import { PetCluster } from "@/components/pet-icons";
import { articles } from "@/lib/articles";
import { articleThumbnails } from "@/lib/article-thumbnails";
import { useI18n } from "@/lib/i18n";
import { withBase } from "@/lib/site";

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
  const figure = articleThumbnails[slug];

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

  if (slug === "game-theory-house") {
    const zh = locale === "zh";
    return (
      <svg
        viewBox="0 0 520 300"
        className={className}
        aria-hidden={!href}
        preserveAspectRatio="xMidYMid meet"
        onClick={go}
      >
        <Frame paper>
          <text x="36" y="48" className="fill-foreground text-[17px]">
            {zh ? "KA 新品合作：谁先投入？" : "KA launch: who invests first?"}
          </text>
          <text x="310" y="78" textAnchor="middle" className="fill-foreground/55 text-[12px]">
            {zh ? "KA 承诺" : "KA commits"}
          </text>
          <text x="430" y="78" textAnchor="middle" className="fill-foreground/55 text-[12px]">
            {zh ? "KA 等待" : "KA waits"}
          </text>
          <text x="38" y="133" className="fill-foreground/55 text-[12px]">
            {zh ? "供应方投入" : "Supplier invests"}
          </text>
          <text x="26" y="213" className="fill-foreground/55 text-[12px]">
            {zh ? "供应方等待" : "Supplier waits"}
          </text>
          {[
            { x: 250, y: 90, label: "4 , 4", color: "#2f6f64" },
            { x: 370, y: 90, label: "−1 , 2", color: "#c45c26" },
            { x: 250, y: 170, label: "2 , −1", color: "#c45c26" },
            { x: 370, y: 170, label: "0 , 0", color: "#2f6f64" },
          ].map((cell) => (
            <g key={`${cell.x}-${cell.y}`}>
              <rect
                x={cell.x}
                y={cell.y}
                width="110"
                height="62"
                rx="4"
                fill="none"
                stroke={cell.color}
                strokeOpacity="0.45"
                strokeWidth="1.5"
              />
              <text
                x={cell.x + 55}
                y={cell.y + 38}
                textAnchor="middle"
                fill={cell.color}
                className="text-[18px]"
              >
                {cell.label}
              </text>
            </g>
          ))}
          <text x="36" y="266" className="fill-foreground/40 text-[11px]">
            {zh ? "示意评分：双方承诺，分阶段投入" : "Illustrative payoffs: commit together, invest in stages"}
          </text>
        </Frame>
      </svg>
    );
  }

  if (slug === "promo-bakery-incrementality") {
    const zh = locale === "zh";
    return (
      <svg
        viewBox="0 0 520 300"
        className={className}
        aria-hidden={!href}
        preserveAspectRatio="xMidYMid meet"
        onClick={go}
      >
        <Frame paper>
          <text x="36" y="48" className="fill-foreground/50 text-[11px] tracking-[3px]">
            {zh ? "一间面包店 · 两家分店 · 三个星期" : "ONE BAKERY · TWO STORES · THREE WEEKS"}
          </text>
          <text x="36" y="78" className="fill-foreground text-[18px]">
            {zh ? "促销排起长队，生意真的变好了吗？" : "Did the queue mean the promotion worked?"}
          </text>
          <path d="M58 221h405" className="stroke-foreground/20" strokeWidth="1.5" />
          {[100, 160, 80].map((value, index) => (
            <g key={index}>
              <rect
                x={154 + index * 105}
                y={221 - value * 0.62}
                width="30"
                height={value * 0.62}
                rx="5"
                fill="#c36e4c"
              />
              <rect
                x={190 + index * 105}
                y={221 - [90, 100, 100][index] * 0.62}
                width="30"
                height={[90, 100, 100][index] * 0.62}
                rx="5"
                fill="#66877a"
              />
              <text
                x={187 + index * 105}
                y="244"
                textAnchor="middle"
                className="fill-foreground/55 text-[10px]"
              >
                {(zh ? ["上周", "活动周", "下一周"] : ["Before", "Offer week", "After"])[index]}
              </text>
            </g>
          ))}
          <path
            d="M165 166c45-19 66-25 98-37 35-13 70 31 103 47"
            fill="none"
            stroke="#a55c40"
            strokeWidth="2"
            strokeDasharray="5 5"
          />
          <text x="36" y="273" className="fill-foreground/45 text-[11px]">
            {zh ? "销量高峰，还是被提前搬来的生意？" : "A real lift—or sales borrowed from next week?"}
          </text>
        </Frame>
      </svg>
    );
  }

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
            {locale === "zh" ? "月末只剩 12 次拜访" : "12 calls left this month"}
          </text>
          <text x="36" y="82" className="fill-foreground/50 text-[11px]">
            {locale === "zh" ? "RFM 把订单变成客户动作" : "Turn order history into account actions"}
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
          <text x="228" y="112" className="fill-foreground/45 text-[11px]">
            {locale === "zh" ? "核心店 · 稳库存" : "Core · protect stock"}
          </text>
          <text x="228" y="158" className="fill-foreground/45 text-[11px]">
            {locale === "zh" ? "沉睡店 · 查原因" : "Dormant · diagnose"}
          </text>
          <text x="228" y="204" className="fill-foreground/45 text-[11px]">
            {locale === "zh" ? "潜力店 · 促复购" : "Growth · earn repeat"}
          </text>
          {[0, 1, 2].map((row) => (
            <g key={row}>
              <rect
                x="228"
                y={122 + row * 46}
                width={row === 1 ? "92" : "150"}
                height="4"
                className={row === 1 ? "fill-[#8a3a4a]/60" : "fill-[#2f6f64]/60"}
              />
              <circle
                cx={row === 1 ? "326" : "384"}
                cy={124 + row * 46}
                r="5"
                fill={row === 1 ? "#8a3a4a" : "#2f6f64"}
              />
            </g>
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
          <text x="36" y="48" className="fill-foreground/55 text-[12px]">
            {locale === "zh"
              ? "代表每天跑 6 家，重点客户还空着？"
              : "Six calls a day, key accounts still uncovered?"}
          </text>
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
    const isBulkRnaSeq = slug === "bulk-rna-seq-pipeline";
    return (
      <Image
        src={withBase(figure)}
        alt={article?.title[locale] ?? ""}
        width={isBulkRnaSeq ? 1348 : 520}
        height={isBulkRnaSeq ? 1080 : 300}
        unoptimized
        className={`${isBulkRnaSeq ? "bg-white object-contain" : "bg-[#fcf4e8] object-cover"} ${className}`}
        style={{ aspectRatio: isBulkRnaSeq ? "1348 / 1080" : "520 / 300" }}
        loading="lazy"
        decoding="async"
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
