import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { messages, type Locale, type ThemeName } from "@/lib/messages";

export function AppShell({
  email,
  locale,
  theme,
  children,
}: {
  email: string;
  locale: Locale;
  theme: ThemeName;
  children: React.ReactNode;
}) {
  const t = messages[locale];
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader locale={locale} theme={theme} email={email} />
      <nav className="mx-auto flex max-w-5xl gap-6 px-6 pb-2 text-sm md:hidden">
        <Link href="/dashboard">{t.dashboard}</Link>
        <Link href="/dashboard#gallery">{t.articles}</Link>
        <Link href="/about">{t.about}</Link>
      </nav>
      <main className="mx-auto w-full max-w-5xl px-6 pb-24">{children}</main>
    </div>
  );
}
