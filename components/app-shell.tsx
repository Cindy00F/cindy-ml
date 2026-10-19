import { MobileNav } from "@/components/mobile-nav";
import { SiteHeader } from "@/components/site-header";
import type { Locale, ThemeName } from "@/lib/messages";

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
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-background has-[.original-essay]:h-dvh has-[.original-essay]:overflow-hidden has-[.original-essay]:bg-[#fcf4e8] dark:has-[.original-essay]:bg-[#1b1814] has-[.original-essay]:[&_header]:bg-[#fcf4e8]/92 dark:has-[.original-essay]:[&_header]:bg-[#1b1814]/92 has-[.original-essay]:[&_.site-nav]:hidden has-[.original-essay]:[&_.mobile-nav]:hidden">
      <a
        href="#main-content"
        className="sr-only z-[300] bg-background px-4 py-3 text-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      >
        {locale === "zh" ? "跳到正文" : "Skip to content"}
      </a>
      <SiteHeader theme={theme} email={email} />
      <MobileNav />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-6 pb-24 focus:outline-none max-[700px]:px-4 has-[.original-essay]:max-w-none has-[.original-essay]:overflow-hidden has-[.original-essay]:px-0 has-[.original-essay]:pb-0"
      >
        {children}
      </main>
    </div>
  );
}
