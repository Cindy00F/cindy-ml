import type { Locale, ThemeName } from "@/lib/messages";

export const CINDY_PREFS_EVENT = "cindy-prefs";

export type CindyPrefs = {
  locale?: Locale;
  theme?: ThemeName;
};

export function emitCindyPrefs(detail: CindyPrefs) {
  window.dispatchEvent(new CustomEvent<CindyPrefs>(CINDY_PREFS_EVENT, { detail }));
}
