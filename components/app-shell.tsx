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
    <div className="min-h-svh bg-background has-[.split-essay]:bg-[#fcf4e8] dark:has-[.split-essay]:bg-[#1b1814]">
      <SiteHeader locale={locale} theme={theme} email={email} />
      <nav className="mx-auto flex max-w-6xl gap-6 px-6 pb-2 text-sm md:hidden">
        <Link href="/dashboard">{t.dashboard}</Link>
        <Link href="/dashboard#gallery">{t.articles}</Link>
        <Link href="/about">{t.about}</Link>
      </nav>
      <main className="mx-auto w-full max-w-6xl px-6 pb-24 has-[.split-essay]:max-w-none has-[.split-essay]:px-0 has-[.split-essay]:pb-0">
        {children}
      </main>
    </div>
  );
}
