export type ProgressMap = Record<
  string,
  { openedAt: number; completed: boolean }
>;

const STORAGE_KEY = "cindy-progress";
const listeners = new Set<() => void>();
const EMPTY: ProgressMap = {};

let cache: ProgressMap = EMPTY;
let cacheRaw: string | null | undefined;

function emit() {
  listeners.forEach((fn) => fn());
}

export function subscribeProgress(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cacheRaw) return cache;
    cacheRaw = raw;
    cache = raw ? (JSON.parse(raw) as ProgressMap) : EMPTY;
    return cache;
  } catch {
    cacheRaw = null;
    cache = EMPTY;
    return EMPTY;
  }
}

export function emptyProgress(): ProgressMap {
  return EMPTY;
}

export function saveProgress(map: ProgressMap) {
  const raw = JSON.stringify(map);
  cache = map;
  cacheRaw = raw;
  window.localStorage.setItem(STORAGE_KEY, raw);
  emit();
}

export function markOpened(slug: string) {
  const map = { ...loadProgress() };
  const prev = map[slug];
  map[slug] = {
    openedAt: Date.now(),
    completed: prev?.completed ?? false,
  };
  saveProgress(map);
  return map;
}

export function markCompleted(slug: string) {
  const map = { ...loadProgress() };
  map[slug] = {
    openedAt: map[slug]?.openedAt ?? Date.now(),
    completed: true,
  };
  saveProgress(map);
  return map;
}
