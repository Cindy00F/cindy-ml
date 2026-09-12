import { ClientRedirect } from "@/components/client-redirect";
import { DeskDoodle } from "@/components/desk-doodle";
import { LoginCopy } from "@/components/login-copy";
import { LoginPanel } from "@/components/login-panel";
import { SiteHeader } from "@/components/site-header";
import { getSession, getTheme } from "@/lib/session";
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

  const theme = await getTheme();
  const error = params.error === "1";

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader theme={theme} />
      <main className="mx-auto grid w-full max-w-6xl items-center gap-16 px-6 py-16 max-[700px]:gap-10 max-[700px]:px-4 max-[700px]:py-10 md:grid-cols-2">
        <div>
          <LoginCopy />
          <DeskDoodle className="mt-10 hidden max-w-xs text-foreground md:block" />
        </div>
        <LoginPanel next={next} error={error} />
      </main>
    </div>
  );
}
