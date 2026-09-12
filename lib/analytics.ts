export type AnalyticsName =
  | "page_view"
  | "article_open"
  | "article_section"
  | "search"
  | "locale"
  | "theme"
  | "mark_read"
  | "essay_next"
  | "essay_prev"
  | "essay_dwell";

export type AnalyticsEvent = {
  id: string;
  t: number;
  name: AnalyticsName;
  path?: string;
  slug?: string;
  section?: string;
  q?: string;
  to?: string;
  from?: string;
  seconds?: number;
};

const STORAGE_KEY = "cindy-events";
const MAX_EVENTS = 800;
const listeners = new Set<() => void>();
const EMPTY: AnalyticsEvent[] = [];

let cache: AnalyticsEvent[] = EMPTY;
let cacheRaw: string | null | undefined;

function emit() {
  listeners.forEach((fn) => fn());
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function subscribeAnalytics(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function loadEvents(): AnalyticsEvent[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cacheRaw) return cache;
    cacheRaw = raw;
    cache = raw ? (JSON.parse(raw) as AnalyticsEvent[]) : EMPTY;
    return cache;
  } catch {
    cacheRaw = null;
    cache = EMPTY;
    return EMPTY;
  }
}

export function emptyEvents(): AnalyticsEvent[] {
  return EMPTY;
}

function persist(events: AnalyticsEvent[]) {
  const next = events.slice(-MAX_EVENTS);
  const raw = JSON.stringify(next);
  cache = next;
  cacheRaw = raw;
  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    /* ignore quota */
  }
  emit();
}

function ship(event: AnalyticsEvent) {
  const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
  if (!endpoint || typeof navigator === "undefined") return;
  try {
    const body = JSON.stringify(event);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
      return;
    }
    void fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    /* ignore */
  }
}

export function track(partial: Omit<AnalyticsEvent, "id" | "t">) {
  if (typeof window === "undefined") return;
  const event: AnalyticsEvent = { id: uid(), t: Date.now(), ...partial };
  persist([...loadEvents(), event]);
  ship(event);
}

export function clearEvents() {
  persist([]);
}

export function summarize(events: AnalyticsEvent[]) {
  const pages = new Map<string, number>();
  const essays = new Map<string, { opens: number; dwell: number }>();
  const searches: string[] = [];
  let reads = 0;
  let locales = 0;
  for (const event of events) {
    if (event.name === "page_view" && event.path) {
      pages.set(event.path, (pages.get(event.path) ?? 0) + 1);
    }
    if (event.name === "article_open" && event.slug) {
      const row = essays.get(event.slug) ?? { opens: 0, dwell: 0 };
      row.opens += 1;
      essays.set(event.slug, row);
    }
    if (event.name === "essay_dwell" && event.slug) {
      const row = essays.get(event.slug) ?? { opens: 0, dwell: 0 };
      row.dwell += event.seconds ?? 0;
      essays.set(event.slug, row);
    }
    if (event.name === "search" && event.q) searches.push(event.q);
    if (event.name === "mark_read") reads += 1;
    if (event.name === "locale") locales += 1;
  }
  return {
    total: events.length,
    pages: [...pages.entries()].sort((a, b) => b[1] - a[1]),
    essays: [...essays.entries()].sort((a, b) => b[1].opens - a[1].opens || b[1].dwell - a[1].dwell),
    searches: searches.slice(-12).reverse(),
    reads,
    locales,
  };
}
