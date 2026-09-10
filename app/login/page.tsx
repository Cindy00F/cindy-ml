import { ClientRedirect } from "@/components/client-redirect";
import { DeskDoodle } from "@/components/desk-doodle";
import { LoginPanel } from "@/components/login-panel";
import { SiteHeader } from "@/components/site-header";
import { messages } from "@/lib/messages";
import { getLocale, getSession, getTheme } from "@/lib/session";
import { IS_STATIC } from "@/lib/site";
import { safeNextPath } from "@/lib/paths";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  if (IS_STATIC) return <ClientRedirect href="/dashboard/" />;
  const params = await searchParams;
  const next = safeNextPath(params.next);
  const session = await getSession();
  if (session) redirect(next);

  const locale = await getLocale();
  const theme = await getTheme();
  const t = messages[locale];
  const error = params.error === "1";

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader locale={locale} theme={theme} />
      <main className="mx-auto grid w-full max-w-6xl items-center gap-16 px-6 py-16 max-[700px]:gap-10 max-[700px]:px-4 max-[700px]:py-10 md:grid-cols-2">
        <div>
          <h1 className="font-heading mt-3 text-4xl leading-tight sm:text-5xl">
            {t.welcomeBack}
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
            {t.loginSubtitle}
          </p>
          <DeskDoodle className="mt-10 hidden max-w-xs text-foreground md:block" />
        </div>
        <LoginPanel locale={locale} next={next} error={error} />
      </main>
    </div>
  );
}
