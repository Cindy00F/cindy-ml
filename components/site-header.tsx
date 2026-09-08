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
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-6">
      <Link href={email ? "/dashboard" : "/login"} className="font-heading text-2xl">
        {t.brand}
      </Link>
      {email ? (
        <nav className="hidden items-center gap-8 text-sm md:flex">
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
        <span className="hidden text-sm text-muted-foreground md:block">
          {t.brandEn}
        </span>
      )}
      <div className="flex items-center gap-1">
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
    </header>
  );
}
