"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { DEMO_ACCOUNT, type Locale, type ThemeName } from "@/lib/messages";
import {
  clearSessionCookie,
  LOCALE_COOKIE,
  setSessionCookie,
  THEME_COOKIE,
} from "@/lib/session";
import { safeNextPath } from "@/lib/paths";

export async function loginAction(formData: FormData) {
  const next = safeNextPath(formData.get("next"));
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (email !== DEMO_ACCOUNT.email || password !== DEMO_ACCOUNT.password) {
    const login = next === "/dashboard" ? "/login?error=1" : `/login?error=1&next=${encodeURIComponent(next)}`;
    redirect(login);
  }
  await setSessionCookie({
    email: DEMO_ACCOUNT.email,
    name: DEMO_ACCOUNT.name,
  });
  redirect(next);
}

export async function guestAction(formData: FormData) {
  const next = safeNextPath(formData.get("next"));
  await setSessionCookie({
    email: DEMO_ACCOUNT.email,
    name: DEMO_ACCOUNT.name,
  });
  redirect(next);
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}

export async function setLocaleAction(formData: FormData) {
  const locale = formData.get("locale") === "en" ? "en" : "zh";
  (await cookies()).set(LOCALE_COOKIE, locale as Locale, {
    path: "/",
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
}

export async function setThemeAction(formData: FormData) {
  const theme = formData.get("theme") === "dark" ? "dark" : "light";
  (await cookies()).set(THEME_COOKIE, theme as ThemeName, {
    path: "/",
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
}
