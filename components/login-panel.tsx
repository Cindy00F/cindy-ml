"use client";

import { useRouter } from "next/navigation";
import { DEMO_ACCOUNT, messages, type Locale } from "@/lib/messages";
import { persistGuestSession, persistSession } from "@/lib/client-auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginPanel({
  locale,
  next,
  error,
}: {
  locale: Locale;
  next: string;
  error: boolean;
}) {
  const router = useRouter();
  const t = messages[locale];

  return (
    <div className="w-full max-w-sm space-y-3 border-t pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const email = String(data.get("email") ?? "")
            .trim()
            .toLowerCase();
          const password = String(data.get("password") ?? "");
          if (email !== DEMO_ACCOUNT.email || password !== DEMO_ACCOUNT.password) {
            router.push("/login?error=1");
            return;
          }
          persistSession({ email: DEMO_ACCOUNT.email, name: DEMO_ACCOUNT.name });
          router.push(next);
        }}
      >
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
      <form
        onSubmit={(event) => {
          event.preventDefault();
          persistGuestSession();
          router.push(next);
        }}
      >
        <button type="submit" className="h-10 w-full border border-foreground text-sm">
          {t.guest}
        </button>
      </form>
      <p className="text-xs text-muted-foreground">{t.demoHint}</p>
    </div>
  );
}
