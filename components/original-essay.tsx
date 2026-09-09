"use client";

import { useCallback, useEffect, useRef, useState, type WheelEvent } from "react";
import { EssayScale } from "@/components/essay-scale";
import { cleanHeading, shouldSkipTick, type EssayTick } from "@/lib/essay-labels";
import { originalEssayTicks } from "@/lib/original-essays";

const EMPTY_TICKS: EssayTick[] = [];

const HIDE_CHROME = `
  html {
    box-sizing: border-box;
    height: auto !important;
    min-height: 100%;
    padding-right: 9.25rem !important;
    overflow-x: hidden;
    overflow-y: auto !important;
    scrollbar-width: none;
  }
  body { height: auto !important; min-height: 100%; overflow-y: visible !important; }
  html::-webkit-scrollbar, body::-webkit-scrollbar { width: 0 !important; height: 0 !important; }
  @media (max-width: 700px) { html { padding-right: 0 !important; } }
  body > header, header { display: none !important; }
  #toc {
    position: absolute !important;
    left: -9999px !important;
    width: 1px !important;
    height: 1px !important;
    overflow: hidden !important;
    display: flex !important;
  }
  figure { top: 0 !important; }
  #intro-mobile { display: none !important; }
  #scrolly { display: flex !important; flex-direction: row-reverse !important; }
  #scrolly > * { flex: 1; }
  article > section[data-index] {
    min-height: 100vh;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    height: auto !important;
    box-sizing: border-box;
    padding-top: 18vh;
    padding-bottom: 28vh;
  }
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

function hideOriginalChrome(doc: Document) {
  if (!doc.getElementById("cindy-chrome-style")) {
    const style = doc.createElement("style");
    style.id = "cindy-chrome-style";
    style.textContent = HIDE_CHROME;
    doc.head?.appendChild(style);
  }
  if (!doc.querySelector('link[href="/essays/cindy-shell.css"]')) {
    const link = doc.createElement("link");
    link.rel = "stylesheet";
    link.href = "/essays/cindy-shell.css";
    doc.head?.appendChild(link);
  }
}

export function OriginalEssay({ folder }: { folder: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const boundDoc = useRef<Document | null>(null);
  const known = originalEssayTicks[folder] ?? EMPTY_TICKS;
  const [ticks, setTicks] = useState<EssayTick[]>(known);
  const [activeId, setActiveId] = useState<string | null>(known[0]?.id ?? null);
  const observers = useRef<Array<{ disconnect: () => void }>>([]);

  const teardown = useCallback(() => {
    for (const observer of observers.current) observer.disconnect();
    observers.current = [];
    boundDoc.current = null;
  }, []);

  const bindIframe = useCallback(() => {
    const iframe = iframeRef.current;
    let doc: Document | null = null;
    try {
      doc = iframe?.contentDocument ?? null;
    } catch {
      return;
    }
    if (!doc?.body || !doc.head) return;

    hideOriginalChrome(doc);

    if (boundDoc.current === doc) return;
    teardown();
    boundDoc.current = doc;
    hideOriginalChrome(doc);

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

    const collect = () => {
      hideOriginalChrome(doc);
      const next = ticksFromDom(doc);
      if (next.length >= 2) {
        setTicks(next);
        const fromToc = selectedIdFromToc(doc);
        setActiveId((current) => fromToc ?? current ?? next[0]?.id ?? null);
      }
      return next.length >= 2 ? next : known;
    };

    let found = collect();

    const mutation = new MutationObserver(() => {
      found = collect();
    });
    mutation.observe(doc.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
    observers.current.push(mutation);

    const win = iframe?.contentWindow;
    if (win) {
      const onScroll = () => {
        const fromToc = selectedIdFromToc(doc);
        if (fromToc) {
          setActiveId(fromToc);
          return;
        }
        const nodes = found
          .map((tick) => doc.getElementById(tick.id))
          .filter((node): node is HTMLElement => Boolean(node));
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
  }, [known, teardown]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const tryBind = () => bindIframe();
    iframe.addEventListener("load", tryBind);
    tryBind();
    const poll = window.setInterval(tryBind, 250);
    const stop = window.setTimeout(() => window.clearInterval(poll), 8000);

    return () => {
      iframe.removeEventListener("load", tryBind);
      window.clearInterval(poll);
      window.clearTimeout(stop);
      teardown();
    };
  }, [bindIframe, teardown]);

  const onSelect = (id: string) => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    const win = iframe?.contentWindow;
    if (!doc || !win) return;
    setActiveId(id);
    const tocLink = doc.querySelector<HTMLAnchorElement>(
      `#toc a[href="#${id}"], #toc a[data-page="${id}"]`,
    );
    tocLink?.classList.add("selected");
    const node = doc.getElementById(id);
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      win.location.hash = id;
    }
  };

  const onHostWheel = (event: WheelEvent<HTMLDivElement>) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.scrollBy(0, event.deltaY);
  };

  return (
    <div
      className="original-essay relative min-h-0 w-full flex-1 bg-[#fcf4e8] text-[#1a1a1a]"
      onWheel={onHostWheel}
    >
      <iframe
        ref={iframeRef}
        title="MLU-Explain essay"
        src={`/essays/${folder}/index.html`}
        className="absolute inset-0 h-full w-full border-0 bg-[#fcf4e8]"
      />
      <EssayScale
        ticks={ticks}
        activeId={activeId}
        onSelect={onSelect}
        onWheelDelta={(deltaY) => iframeRef.current?.contentWindow?.scrollBy(0, deltaY)}
      />
    </div>
  );
}
