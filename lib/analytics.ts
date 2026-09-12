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
  locale?: string;
  host?: string;
};

const CSV_HEADER = "id,time,name,path,slug,section,q,to,from,seconds,locale,host";
const SYNCED_KEY = "cindy-events-synced";
const GITHUB_REPO =
  process.env.NEXT_PUBLIC_ANALYTICS_GITHUB_REPO || "Cindy00F/cindy-ml";
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_ANALYTICS_GITHUB_TOKEN || "";

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

function csvCell(value: string | number | undefined) {
  if (value == null || value === "") return "";
  const text = String(value).replace(/\r?\n/g, " ").slice(0, 200);
  if (/[",]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function eventsToCsv(events: AnalyticsEvent[]) {
  const lines = events.map((event) =>
    [
      event.id,
      event.t ? new Date(event.t).toISOString() : "",
      event.name,
      event.path,
      event.slug,
      event.section,
      event.q,
      event.to,
      event.from,
      event.seconds,
      event.locale,
      event.host,
    ]
      .map(csvCell)
      .join(","),
  );
  return `${CSV_HEADER}\n${lines.join("\n")}\n`;
}

function readSynced(): Set<string> {
  try {
    const raw = window.localStorage.getItem(SYNCED_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeSynced(ids: Set<string>) {
  try {
    window.localStorage.setItem(SYNCED_KEY, JSON.stringify([...ids].slice(-MAX_EVENTS)));
  } catch {
    /* ignore */
  }
}

let flushTimer: number | null = null;
let flushing = false;
let leaveBound = false;

function bindLeaveFlush() {
  if (leaveBound || typeof window === "undefined") return;
  leaveBound = true;
  window.addEventListener("pagehide", () => {
    void flushToGithub();
  });
}

async function flushToGithub() {
  if (flushing || typeof window === "undefined") return;
  const token = GITHUB_TOKEN;
  if (!token) return;
  const synced = readSynced();
  const pending = loadEvents().filter((event) => !synced.has(event.id)).slice(0, 30);
  if (!pending.length) return;
  flushing = true;
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/dispatches`, {
      method: "POST",
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ event_type: "cindy-track", client_payload: { events: pending } }),
      keepalive: true,
    });
    if (res.ok || res.status === 204) {
      for (const event of pending) synced.add(event.id);
      writeSynced(synced);
    }
  } catch {
    /* keep local; retry next time */
  } finally {
    flushing = false;
  }
}

function scheduleGithubFlush() {
  if (!GITHUB_TOKEN || typeof window === "undefined") return;
  bindLeaveFlush();
  if (flushTimer != null) return;
  flushTimer = window.setTimeout(() => {
    flushTimer = null;
    void flushToGithub();
  }, 4000);
}

export function canSyncGithub() {
  return Boolean(GITHUB_TOKEN);
}

export function githubCsvUrl() {
  return `https://raw.githubusercontent.com/${GITHUB_REPO}/main/data/events.csv`;
}

export function githubFileUrl() {
  return `https://github.com/${GITHUB_REPO}/blob/main/data/events.csv`;
}

export async function syncEventsToGithub() {
  await flushToGithub();
}

export function track(partial: Omit<AnalyticsEvent, "id" | "t" | "locale" | "host">) {
  if (typeof window === "undefined") return;
  let locale = "";
  try {
    locale = localStorage.getItem("cindy-locale") || "";
  } catch {
    /* ignore */
  }
  const event: AnalyticsEvent = {
    id: uid(),
    t: Date.now(),
    locale: locale === "en" ? "en" : "zh",
    host: window.location.host,
    ...partial,
  };
  persist([...loadEvents(), event]);
  scheduleGithubFlush();
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
