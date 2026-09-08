import { guestAction, loginAction } from "@/app/actions";
import { BrandMark } from "@/components/brand-mark";
import { LocaleToggle } from "@/components/locale-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_ACCOUNT, messages } from "@/lib/messages";
import { getLocale, getSession, getTheme } from "@/lib/session";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/dashboard");

  const locale = await getLocale();
  const theme = await getTheme();
  const t = messages[locale];
  const params = await searchParams;
  const error = params.error === "1";

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-foreground text-background lg:flex">
        <div className="login-grid absolute inset-0 opacity-40 mix-blend-soft-light" />
        <div className="relative z-10 flex flex-col justify-between p-10">
          <div className="flex items-center gap-3">
            <BrandMark className="size-10" />
            <div>
              <div className="font-heading text-2xl leading-none">{t.brand}</div>
              <div className="text-xs tracking-[0.22em] uppercase opacity-70">
                {t.brandEn}
              </div>
            </div>
          </div>
          <div className="max-w-md">
            <p className="font-heading text-4xl leading-tight">
              {locale === "zh"
                ? "把模型里那些说不清的弯，摊在桌上。"
                : "Lay the stubborn bends of a model out on the table."}
            </p>
            <p className="mt-4 text-sm leading-6 opacity-80">{t.loginSubtitle}</p>
          </div>
          <p className="text-xs opacity-60">{t.noPhilips}</p>
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
            <span className="font-heading text-xl">{t.brand}</span>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <LocaleToggle locale={locale} />
            <ThemeToggle theme={theme} />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-16">
          <div className="w-full max-w-sm space-y-5">
            <div>
              <h1 className="font-heading text-3xl">{t.loginTitle}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{t.loginSubtitle}</p>
            </div>
            <form action={loginAction} method="post" className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  defaultValue={DEMO_ACCOUNT.email}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  defaultValue={DEMO_ACCOUNT.password}
                  className="h-10"
                />
              </div>
              {error ? <p className="text-sm text-destructive">{t.invalidCreds}</p> : null}
              <button
                type="submit"
                className={cn(buttonVariants({ variant: "default" }), "h-10 w-full")}
              >
                {t.signIn}
              </button>
            </form>
            <div className="flex gap-2">
              <form action={loginAction} method="post" className="flex-1">
                <input type="hidden" name="email" value={DEMO_ACCOUNT.email} />
                <input type="hidden" name="password" value={DEMO_ACCOUNT.password} />
                <button
                  type="submit"
                  className={cn(buttonVariants({ variant: "outline" }), "h-10 w-full")}
                >
                  {t.fillDemo}
                </button>
              </form>
              <form action={guestAction} method="post" className="flex-1">
                <button
                  type="submit"
                  className={cn(buttonVariants({ variant: "secondary" }), "h-10 w-full")}
                >
                  {t.guest}
                </button>
              </form>
            </div>
            <p className="text-xs text-muted-foreground">{t.demoHint}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
