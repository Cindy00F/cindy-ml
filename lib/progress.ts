export type ProgressMap = Record<
  string,
  { openedAt: number; completed: boolean }
>;

const STORAGE_KEY = "wangchen-progress";
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

export function subscribeProgress(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function emptyProgress(): ProgressMap {
  return {};
}

export function saveProgress(map: ProgressMap) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  emit();
}

export function markOpened(slug: string) {
  const map = loadProgress();
  const prev = map[slug];
  map[slug] = {
    openedAt: Date.now(),
    completed: prev?.completed ?? false,
  };
  saveProgress(map);
  return map;
}

export function markCompleted(slug: string) {
  const map = loadProgress();
  map[slug] = {
    openedAt: map[slug]?.openedAt ?? Date.now(),
    completed: true,
  };
  saveProgress(map);
  return map;
}
