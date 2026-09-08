"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EssayScale } from "@/components/essay-scale";
import { cleanHeading, shouldSkipTick, type EssayTick } from "@/lib/essay-labels";

const HIDE_CHROME = `
  body > header { display: none !important; }
  #toc { display: none !important; }
  header nav ul, header #toc { display: none !important; }
  figure { top: 0 !important; }
  #scrolly > figure, .sticky-figure, figure[style] { top: 0 !important; }
`;

function uniqueTicks(ticks: EssayTick[]) {
  const seen = new Set<string>();
  const out: EssayTick[] = [];
  for (const tick of ticks) {
    const key = tick.id || tick.en.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(tick);
  }
  return out;
}

function ticksFromToc(doc: Document): EssayTick[] {
  const links = [...doc.querySelectorAll<HTMLAnchorElement>("#toc a[href^='#']")];
  const ticks: EssayTick[] = [];
  for (const link of links) {
    const id = (link.getAttribute("href") ?? "").replace("#", "") || link.dataset.page || "";
    const en = cleanHeading(link.textContent ?? "");
    if (!id || shouldSkipTick(id, en)) continue;
    ticks.push({ id, en });
  }
  return uniqueTicks(ticks);
}

function ticksFromDom(doc: Document): EssayTick[] {
  const fromToc = ticksFromToc(doc);
  if (fromToc.length >= 2) return fromToc;

  const ticks: EssayTick[] = [];
  const sections = [
    ...doc.querySelectorAll<HTMLElement>(
      "article > section[id], #scrolly article > section[id], body > section[id]",
    ),
  ];
  for (const section of sections) {
    if (section.closest("figure")) continue;
    const heading = section.querySelector("h1, h2, h3");
    const en = cleanHeading(heading?.textContent ?? section.id.replace(/-/g, " "));
    if (shouldSkipTick(section.id, en)) continue;
    ticks.push({ id: section.id, en });
  }
  if (ticks.length >= 2) return uniqueTicks(ticks);

  const headings = [
    ...doc.querySelectorAll<HTMLElement>(
      "h1.body-header, h1.intro-sub, h2:not(.logo), h3.subheader, h3.sectionheader, h3.center-text.subheader",
    ),
  ];
  headings.forEach((heading, i) => {
    const en = cleanHeading(heading.textContent ?? "");
    if (shouldSkipTick(heading.id, en)) return;
    if (!heading.id) heading.id = `cindy-tick-${i}`;
    ticks.push({ id: heading.id, en });
  });
  return uniqueTicks(ticks);
}

function selectedIdFromToc(doc: Document) {
  const selected =
    doc.querySelector<HTMLAnchorElement>("#toc a.selected") ??
    doc.querySelector<HTMLAnchorElement>("#toc .selected a") ??
    doc.querySelector<HTMLAnchorElement>("#toc li.selected a");
  if (!selected) return null;
  return (selected.getAttribute("href") ?? "").replace("#", "") || selected.dataset.page || null;
}

export function OriginalEssay({ folder }: { folder: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ticks, setTicks] = useState<EssayTick[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const observers = useRef<Array<{ disconnect: () => void }>>([]);

  const teardown = useCallback(() => {
    for (const observer of observers.current) observer.disconnect();
    observers.current = [];
  }, []);

  const bindIframe = useCallback(() => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!doc?.body) return;

    teardown();

    if (!doc.getElementById("cindy-chrome-style")) {
      const style = doc.createElement("style");
      style.id = "cindy-chrome-style";
      style.textContent = HIDE_CHROME;
      doc.head.appendChild(style);
    }

    const onClick = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest?.("a, .cardSpan") as HTMLElement | null;
      if (!link) return;
      const href = link.getAttribute?.("href") ?? "";
      if (
        link.classList.contains("cardSpan") ||
        href === "https://mlu-explain.github.io/" ||
        href === "https://mlu-explain.github.io"
      ) {
        event.preventDefault();
        window.top!.location.href = "/dashboard";
      }
    };
    doc.addEventListener("click", onClick);
    observers.current.push({
      disconnect: () => doc.removeEventListener("click", onClick),
    });

    const poll = window.setInterval(() => collect(), 300);
    window.setTimeout(() => window.clearInterval(poll), 5000);

    const collect = () => {
      const next = ticksFromDom(doc);
      setTicks(next);
      const fromToc = selectedIdFromToc(doc);
      setActiveId((current) => fromToc ?? current ?? next[0]?.id ?? null);
      return next;
    };

    let found = collect();

    const mutation = new MutationObserver(() => {
      found = collect();
    });
    mutation.observe(doc.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    observers.current.push(mutation);

    const win = iframe.contentWindow;
    if (win) {
      const onScroll = () => {
        const fromToc = selectedIdFromToc(doc);
        if (fromToc) {
          setActiveId(fromToc);
          return;
        }
        const nodes = found.length
          ? found
              .map((tick) => doc.getElementById(tick.id))
              .filter((node): node is HTMLElement => Boolean(node))
          : [];
        if (!nodes.length) return;
        const mid = win.innerHeight * 0.28;
        let best = nodes[0];
        let bestDist = Infinity;
        for (const node of nodes) {
          const top = node.getBoundingClientRect().top;
          const dist = Math.abs(top - mid);
          if (top <= win.innerHeight * 0.55 && dist < bestDist) {
            best = node;
            bestDist = dist;
          }
        }
        if (best?.id) setActiveId(best.id);
      };
      win.addEventListener("scroll", onScroll, { passive: true });
      observers.current.push({
        disconnect: () => win.removeEventListener("scroll", onScroll),
      });
      onScroll();
    }
  }, [teardown]);

  useEffect(() => {
    return () => teardown();
  }, [teardown]);

  const onSelect = (id: string) => {
    const doc = iframeRef.current?.contentDocument;
    const node = doc?.getElementById(id);
    if (!node) return;
    setActiveId(id);
    node.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="original-essay flex h-[calc(100svh-3rem)] min-h-0 flex-1 bg-[#fcf4e8] text-[#1a1a1a]">
      <iframe
        ref={iframeRef}
        title="MLU-Explain essay"
        src={`/essays/${folder}/index.html`}
        className="h-full min-w-0 flex-1 border-0 bg-[#fcf4e8]"
        onLoad={bindIframe}
      />
      <EssayScale ticks={ticks} activeId={activeId} onSelect={onSelect} />
    </div>
  );
}
