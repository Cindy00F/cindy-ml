import type { Locale, ThemeName } from "@/lib/messages";

export const CINDY_PREFS_EVENT = "cindy-prefs";

export type CindyPrefs = {
  locale?: Locale;
  theme?: ThemeName;
};

export function writeCindyCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; Path=/; SameSite=Lax`;
}

export function emitCindyPrefs(detail: CindyPrefs) {
  if (detail.locale) writeCindyCookie("cindy-locale", detail.locale);
  if (detail.theme) writeCindyCookie("cindy-theme", detail.theme);
  window.dispatchEvent(new CustomEvent<CindyPrefs>(CINDY_PREFS_EVENT, { detail }));
}
