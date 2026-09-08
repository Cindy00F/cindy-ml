"use client";

import { Badge } from "@/components/ui/badge";
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
    <section className="my-8 overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <h3 className="font-heading text-base">{title}</h3>
        <Badge variant="secondary">{t("interactive")}</Badge>
      </div>
      <div className="p-4">{children}</div>
      <p className="border-t px-4 py-2.5 text-xs text-muted-foreground">
        {t("playgroundHint")}
      </p>
    </section>
  );
}
