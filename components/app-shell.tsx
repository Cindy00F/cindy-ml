import { MobileNav } from "@/components/mobile-nav";
import { SiteHeader } from "@/components/site-header";
import type { Locale, ThemeName } from "@/lib/messages";

export function AppShell({
  email,
  locale: _locale,
  theme,
  children,
}: {
  email: string;
  locale: Locale;
  theme: ThemeName;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-background has-[.original-essay]:h-dvh has-[.original-essay]:overflow-hidden has-[.original-essay]:bg-[#fcf4e8] dark:has-[.original-essay]:bg-[#1b1814] has-[.original-essay]:[&_header]:bg-[#fcf4e8]/92 dark:has-[.original-essay]:[&_header]:bg-[#1b1814]/92 has-[.original-essay]:[&_.site-nav]:hidden has-[.original-essay]:[&_.mobile-nav]:hidden">
      <SiteHeader theme={theme} email={email} />
      <MobileNav />
      <main className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-6 pb-24 max-[700px]:px-4 has-[.original-essay]:max-w-none has-[.original-essay]:overflow-hidden has-[.original-essay]:px-0 has-[.original-essay]:pb-0">
        {children}
      </main>
    </div>
  );
}
