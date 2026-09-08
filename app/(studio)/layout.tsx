import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getLocale, getSession, getTheme } from "@/lib/session";

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  const locale = await getLocale();
  const theme = await getTheme();

  return (
    <AppShell email={session.email} locale={locale} theme={theme}>
      {children}
    </AppShell>
  );
}
