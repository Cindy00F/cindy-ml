"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { LocaleToggle } from "@/components/locale-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_ACCOUNT, useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function nextPath() {
  if (typeof window === "undefined") return "/dashboard";
  const next = new URLSearchParams(window.location.search).get("next");
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/dashboard";
  return next;
}

export default function LoginPage() {
  const { t, locale } = useI18n();
  const { login, loginAsGuest, session } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState(DEMO_ACCOUNT.email);
  const [password, setPassword] = useState(DEMO_ACCOUNT.password);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) router.replace(nextPath());
  }, [session, router]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ok = login(email, password);
    if (!ok) {
      setError(t("invalidCreds"));
      return;
    }
    router.replace(nextPath());
  }

  function enterAsGuest() {
    loginAsGuest();
    router.replace(nextPath());
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-foreground text-background lg:flex">
        <div className="login-grid absolute inset-0 opacity-40 mix-blend-soft-light" />
        <div className="relative z-10 flex flex-col justify-between p-10">
          <div className="flex items-center gap-3">
            <BrandMark className="size-10" />
            <div>
              <div className="font-heading text-2xl leading-none">{t("brand")}</div>
              <div className="text-xs tracking-[0.22em] uppercase opacity-70">
                {t("brandEn")}
              </div>
            </div>
          </div>
          <div className="max-w-md">
            <p className="font-heading text-4xl leading-tight">
              {locale === "zh"
                ? "把模型里那些说不清的弯，摊在桌上。"
                : "Lay the stubborn bends of a model out on the table."}
            </p>
            <p className="mt-4 text-sm leading-6 opacity-80">{t("loginSubtitle")}</p>
          </div>
          <p className="text-xs opacity-60">{t("noPhilips")}</p>
        </div>
        <svg
          viewBox="0 0 640 720"
          className="absolute right-[-80px] bottom-[-40px] h-[78%] w-auto opacity-80"
          aria-hidden
        >
          <path
            d="M40 520 C 140 220, 240 580, 340 300 S 520 180, 620 360"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-background"
            opacity="0.5"
          />
          {[
            [90, 430],
            [170, 360],
            [250, 410],
            [330, 300],
            [410, 250],
            [490, 280],
            [560, 330],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="8" className="fill-background" opacity="0.85" />
          ))}
        </svg>
      </section>

      <section className="flex flex-col bg-background">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2 lg:hidden">
            <BrandMark className="size-8" />
            <span className="font-heading text-xl">{t("brand")}</span>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <LocaleToggle />
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-16">
          <form noValidate onSubmit={onSubmit} className="w-full max-w-sm space-y-5">
            <div>
              <h1 className="font-heading text-3xl">{t("loginTitle")}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{t("loginSubtitle")}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10"
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <button
              type="submit"
              className={cn(buttonVariants({ variant: "default" }), "h-10 w-full")}
            >
              {t("signIn")}
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                className={cn(buttonVariants({ variant: "outline" }), "h-10 flex-1")}
                onClick={() => {
                  setEmail(DEMO_ACCOUNT.email);
                  setPassword(DEMO_ACCOUNT.password);
                  setError("");
                }}
              >
                {t("fillDemo")}
              </button>
              <button
                type="button"
                className={cn(buttonVariants({ variant: "secondary" }), "h-10 flex-1")}
                onClick={enterAsGuest}
              >
                {t("guest")}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">{t("demoHint")}</p>
          </form>
        </div>
      </section>
    </div>
  );
}
