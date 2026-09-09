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

function nextPath(formData: FormData) {
  const raw = String(formData.get("next") ?? "/dashboard");
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (email !== DEMO_ACCOUNT.email || password !== DEMO_ACCOUNT.password) {
    redirect("/login?error=1");
  }
  await setSessionCookie({
    email: DEMO_ACCOUNT.email,
    name: DEMO_ACCOUNT.name,
  });
  redirect("/dashboard");
}

export async function guestAction() {
  await setSessionCookie({
    email: DEMO_ACCOUNT.email,
    name: DEMO_ACCOUNT.name,
  });
  redirect("/dashboard");
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
  redirect(nextPath(formData));
}

export async function setThemeAction(formData: FormData) {
  const theme = formData.get("theme") === "dark" ? "dark" : "light";
  (await cookies()).set(THEME_COOKIE, theme as ThemeName, {
    path: "/",
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
  redirect(nextPath(formData));
}
