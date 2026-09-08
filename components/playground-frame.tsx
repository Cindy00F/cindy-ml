"use client";

import { useI18n } from "@/lib/i18n";

export function PlaygroundFrame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  return (
    <figure className="my-10 border-y border-foreground/15 py-6">
      <figcaption className="mb-4 text-xs tracking-wide text-muted-foreground">
        {title}
      </figcaption>
      <div>{children}</div>
      <p className="mt-4 text-xs text-muted-foreground">{t("playgroundHint")}</p>
    </figure>
  );
}
