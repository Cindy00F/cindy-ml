"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { LocaleToggle } from "@/components/locale-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_ACCOUNT, useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

function LoginForm() {
  const { t, locale } = useI18n();
  const { login, loginAsGuest, session, ready } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && session) {
      router.replace(params.get("next") || "/dashboard");
    }
  }, [ready, session, router, params]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = login(email, password);
    if (!ok) {
      setError(t("invalidCreds"));
      return;
    }
    router.replace(params.get("next") || "/dashboard");
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
          <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5">
            <div>
              <h1 className="font-heading text-3xl">{t("loginTitle")}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{t("loginSubtitle")}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={DEMO_ACCOUNT.email}
                className="h-10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-10"
                required
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="h-10 w-full">
              {t("signIn")}
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 flex-1"
                onClick={() => {
                  setEmail(DEMO_ACCOUNT.email);
                  setPassword(DEMO_ACCOUNT.password);
                  setError("");
                }}
              >
                {t("fillDemo")}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="h-10 flex-1"
                onClick={() => {
                  loginAsGuest();
                  router.replace(params.get("next") || "/dashboard");
                }}
              >
                {t("guest")}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{t("demoHint")}</p>
          </form>
        </div>
      </section>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center">…</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
