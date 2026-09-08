import Link from "next/link";
import { logoutAction } from "@/app/actions";
import { LocaleToggle } from "@/components/locale-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { messages, type Locale, type ThemeName } from "@/lib/messages";

export function SiteHeader({
  locale,
  theme,
  email,
}: {
  locale: Locale;
  theme: ThemeName;
  email?: string;
}) {
  const t = messages[locale];
  return (
    <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-12 w-full max-w-[100rem] items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href={email ? "/dashboard" : "/login"}
          className="font-heading shrink-0 text-xl leading-none"
        >
          {t.brand}
        </Link>
        {email ? (
          <nav className="site-nav hidden items-center gap-7 text-sm md:flex">
            <Link href="/dashboard" className="hover:opacity-60">
              {t.dashboard}
            </Link>
            <Link href="/dashboard#gallery" className="hover:opacity-60">
              {t.articles}
            </Link>
            <Link href="/about" className="hover:opacity-60">
              {t.about}
            </Link>
          </nav>
        ) : (
          <span className="hidden text-sm text-muted-foreground md:block">{t.brandEn}</span>
        )}
        <div className="flex items-center gap-0.5">
          <LocaleToggle locale={locale} />
          <ThemeToggle theme={theme} />
          {email ? (
            <form action={logoutAction}>
              <button
                type="submit"
                className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {t.logout}
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </header>
  );
}
