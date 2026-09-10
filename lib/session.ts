import { cookies } from "next/headers";
import { DEMO_ACCOUNT, type Locale, type Session, type ThemeName } from "@/lib/messages";
import { IS_STATIC } from "@/lib/site";

export const SESSION_COOKIE = "cindy-session";
export const LOCALE_COOKIE = "cindy-locale";
export const THEME_COOKIE = "cindy-theme";

export async function getSession(): Promise<Session | null> {
  if (IS_STATIC) {
    return { email: DEMO_ACCOUNT.email, name: DEMO_ACCOUNT.name };
  }
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Session;
    if (parsed?.email) return parsed;
  } catch {
    return null;
  }
  return null;
}

export async function setSessionCookie(session: Session) {
  (await cookies()).set(SESSION_COOKIE, JSON.stringify(session), {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getLocale(): Promise<Locale> {
  if (IS_STATIC) return "zh";
  return (await cookies()).get(LOCALE_COOKIE)?.value === "en" ? "en" : "zh";
}

export async function getTheme(): Promise<ThemeName> {
  if (IS_STATIC) return "light";
  return (await cookies()).get(THEME_COOKIE)?.value === "dark" ? "dark" : "light";
}

export { DEMO_ACCOUNT };
