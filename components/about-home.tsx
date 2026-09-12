"use client";

import { DeskDoodle } from "@/components/desk-doodle";
import { useI18n } from "@/lib/i18n";

export function AboutHome() {
  const { t } = useI18n();
  return (
    <div className="grid gap-12 py-10 md:grid-cols-2">
      <div className="space-y-5">
        <h1 className="font-heading text-4xl">{t("aboutTitle")}</h1>
        <p className="leading-7 text-muted-foreground">{t("aboutBody")}</p>
        <p className="leading-7 text-muted-foreground">{t("credit")}</p>
      </div>
      <DeskDoodle className="max-w-sm text-foreground" />
    </div>
  );
}
