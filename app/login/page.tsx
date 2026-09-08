import { guestAction, loginAction } from "@/app/actions";
import { DeskDoodle } from "@/components/desk-doodle";
import { SiteHeader } from "@/components/site-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_ACCOUNT, messages } from "@/lib/messages";
import { getLocale, getSession, getTheme } from "@/lib/session";
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
    <div className="min-h-svh bg-background">
      <SiteHeader locale={locale} theme={theme} />
      <main className="mx-auto grid w-full max-w-6xl items-center gap-16 px-6 py-16 md:grid-cols-2">
        <div>
          <h1 className="font-heading mt-3 text-4xl leading-tight sm:text-5xl">
            {t.welcomeBack}
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
            {t.loginSubtitle}
          </p>
          <DeskDoodle className="mt-10 hidden max-w-xs text-foreground md:block" />
        </div>
        <div className="max-w-sm space-y-3 border-t pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
          <form action={loginAction} method="post" className="space-y-5">
            <h2 className="font-heading text-2xl">{t.loginTitle}</h2>
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                defaultValue={DEMO_ACCOUNT.email}
                className="h-10 rounded-none"
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
                className="h-10 rounded-none"
              />
            </div>
            {error ? <p className="text-sm">{t.invalidCreds}</p> : null}
            <button
              type="submit"
              className="h-10 w-full border border-foreground bg-foreground text-sm text-background"
            >
              {t.signIn}
            </button>
          </form>
          <form action={guestAction} method="post">
            <button
              type="submit"
              className="h-10 w-full border border-foreground text-sm"
            >
              {t.guest}
            </button>
          </form>
          <p className="text-xs text-muted-foreground">{t.demoHint}</p>
        </div>
      </main>
    </div>
  );
}
