"use client";

import { useCallback, useEffect, useRef, useState, type WheelEvent } from "react";
import Script from "next/script";
import { EssayScale } from "@/components/essay-scale";
import { CINDY_PREFS_EVENT, type CindyPrefs } from "@/lib/client-prefs";
import { cleanHeading, shouldSkipTick, type EssayTick } from "@/lib/essay-labels";
import type { Locale, ThemeName } from "@/lib/messages";
import { BASE_PATH } from "@/lib/site";
import { originalEssayTicks } from "@/lib/original-essays";

const EMPTY_TICKS: EssayTick[] = [];

const HIDE_CHROME = `
  html {
    box-sizing: border-box;
    height: auto !important;
    min-height: 100%;
    overflow-x: hidden;
    overflow-y: auto !important;
    scrollbar-width: none;
    scroll-behavior: auto !important;
  }
  body { height: auto !important; min-height: 100%; overflow-y: visible !important; }
  html::-webkit-scrollbar, body::-webkit-scrollbar { width: 0 !important; height: 0 !important; }
  body > header, header, #intro__date, #intro-date { display: none !important; }
  #toc {
    position: absolute !important;
    left: -9999px !important;
    width: 1px !important;
    height: 1px !important;
    overflow: hidden !important;
    display: flex !important;
  }
  figure { top: 0 !important; }
  @media (min-width: 701px) {
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

function installCindyBridge(doc: Document) {
  if (doc.querySelector(`script[src="${BASE_PATH}/essays/cindy-bridge.js"]`)) return;
  const host = doc.body ?? doc.documentElement;
  const i18n = doc.createElement("script");
  i18n.src = `${BASE_PATH}/essays/cindy-i18n.js`;
  i18n.id = "cindy-i18n";
  i18n.async = false;
  const script = doc.createElement("script");
  script.src = `${BASE_PATH}/essays/cindy-bridge.js`;
  script.id = "cindy-bridge";
  script.async = false;
  host.appendChild(i18n);
  host.appendChild(script);
}

function hideOriginalChrome(doc: Document) {
  if (!doc.getElementById("cindy-chrome-style")) {
    const style = doc.createElement("style");
    style.id = "cindy-chrome-style";
    style.textContent = HIDE_CHROME;
    doc.head?.appendChild(style);
  }
  if (!doc.querySelector(`link[href="${BASE_PATH}/essays/cindy-shell.css"]`)) {
    const link = doc.createElement("link");
    link.rel = "stylesheet";
    link.href = `${BASE_PATH}/essays/cindy-shell.css`;
    doc.head?.appendChild(link);
  }
  installCindyBridge(doc);
}

function sendPrefs(win: Window | null, locale: Locale, theme: ThemeName) {
  win?.postMessage({ type: "cindy-prefs", locale, theme }, "*");
}

function jumpToSection(win: Window | null, doc: Document | null, id: string) {
  if (!win || !doc) return;
  const node = doc.getElementById(id) ?? doc.querySelector<HTMLElement>(`section[id="${id}"]`);
  if (!node) return;
  const root = doc.scrollingElement ?? doc.documentElement;
  const y = Math.max(0, node.getBoundingClientRect().top + (win.scrollY || root.scrollTop || 0) - 8);
  win.scrollTo(0, y);
  root.scrollTop = y;
  doc.documentElement.scrollTop = y;
  if (doc.body) doc.body.scrollTop = y;
  sendGo(win, id);
  const tocLink = doc.querySelector<HTMLAnchorElement>(
    `#toc a[href="#${id}"], #toc a[data-page="${id}"]`,
  );
  if (tocLink) {
    doc.querySelectorAll("#toc a").forEach((link) => link.classList.remove("selected"));
    tocLink.classList.add("selected");
  }
}

function sendGo(win: Window, id: string) {
  win.postMessage({ type: "cindy-go", id }, "*");
  const go = (win as Window & { __cindyGo?: (sectionId: string) => boolean }).__cindyGo;
  go?.(id);
}

export function OriginalEssay({
  folder,
  locale,
  theme,
}: {
  folder: string;
  locale: Locale;
  theme: ThemeName;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const boundDoc = useRef<Document | null>(null);
  const prefsRef = useRef({ locale, theme });
  const srcRef = useRef(`${BASE_PATH}/essays/${folder}/index.html?lang=${locale}&theme=${theme}`);
  const known = originalEssayTicks[folder] ?? EMPTY_TICKS;
  const [ticks, setTicks] = useState<EssayTick[]>(known);
  const [activeId, setActiveId] = useState<string | null>(known[0]?.id ?? null);
  const [prefs, setPrefs] = useState({ locale, theme });
  const observers = useRef<Array<{ disconnect: () => void }>>([]);

  prefsRef.current = prefs;

  useEffect(() => {
    setPrefs({ locale, theme });
  }, [locale, theme]);

  useEffect(() => {
    const onPrefs = (event: Event) => {
      const detail = (event as CustomEvent<CindyPrefs>).detail ?? {};
      setPrefs((current) => ({
        locale: detail.locale ?? current.locale,
        theme: detail.theme ?? current.theme,
      }));
    };
    window.addEventListener(CINDY_PREFS_EVENT, onPrefs);
    return () => window.removeEventListener(CINDY_PREFS_EVENT, onPrefs);
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "cindy-tick" && typeof event.data.id === "string") {
        setActiveId(event.data.id);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

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
    sendPrefs(iframe?.contentWindow ?? null, prefsRef.current.locale, prefsRef.current.theme);

    if (boundDoc.current === doc) return;
    teardown();
    boundDoc.current = doc;
    hideOriginalChrome(doc);
    sendPrefs(iframe?.contentWindow ?? null, prefsRef.current.locale, prefsRef.current.theme);

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
        window.top!.location.href = `${BASE_PATH}/dashboard/`;
      }
    };
    doc.addEventListener("click", onClick);
    observers.current.push({
      disconnect: () => doc.removeEventListener("click", onClick),
    });

    const collect = () => {
      hideOriginalChrome(doc);
      const next = ticksFromDom(doc);
      if (next.length >= 2) setTicks(next);
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

  useEffect(() => {
    document.documentElement.dataset.cindyEssay = "hydrated";
  }, []);

  useEffect(() => {
    sendPrefs(iframeRef.current?.contentWindow ?? null, prefs.locale, prefs.theme);
  }, [prefs]);

  const onSelect = useCallback((id: string) => {
    const iframe = iframeRef.current;
    const win = iframe?.contentWindow ?? null;
    const doc = iframe?.contentDocument ?? null;
    setActiveId(id);
    if (!win || !doc) return;
    jumpToSection(win, doc, id);
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const node = event.target as Node | null;
      const el = node instanceof Element ? node : node?.parentElement;
      const id = el?.closest("[data-tick-id]")?.getAttribute("data-tick-id");
      if (!id) return;
      onSelect(id);
    };
    document.addEventListener("pointerdown", handler, true);
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("pointerdown", handler, true);
      document.removeEventListener("click", handler, true);
    };
  }, [onSelect]);

  const onHostWheel = (event: WheelEvent<HTMLDivElement>) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.scrollBy(0, event.deltaY);
  };

  return (
    <div
      className="original-essay relative z-0 min-h-0 w-full flex-1 bg-[#fcf4e8] text-[#1a1a1a] dark:bg-[#1b1814] dark:text-[#f3ead8]"
      onWheel={onHostWheel}
    >
      <Script id="cindy-scale-jump" strategy="afterInteractive">{`
        document.addEventListener("click", function (event) {
          var node = event.target;
          var el = node && node.closest ? node : node && node.parentElement;
          var btn = el && el.closest ? el.closest("[data-tick-id]") : null;
          if (!btn) return;
          var id = btn.getAttribute("data-tick-id");
          var iframe = document.querySelector(".original-essay iframe");
          if (!id || !iframe || !iframe.contentWindow) return;
          var win = iframe.contentWindow;
          var doc = iframe.contentDocument;
          var go = win.__cindyGo;
          if (typeof go === "function") go(id);
          else if (doc) {
            var section = doc.getElementById(id);
            if (section) {
              var y = section.getBoundingClientRect().top + (win.scrollY || 0) - 8;
              win.scrollTo(0, y);
            }
          }
          win.postMessage({ type: "cindy-go", id: id }, "*");
        }, true);
      `}</Script>
      <iframe
        ref={iframeRef}
        title="MLU-Explain essay"
        src={srcRef.current}
        className="absolute inset-y-0 left-0 z-0 h-full w-full border-0 bg-[#fcf4e8] min-[701px]:w-[calc(100%-9.25rem)] dark:bg-[#1b1814]"
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
