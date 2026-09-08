"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export function OriginalEssay({ folder }: { folder: string }) {
  const { t } = useI18n();
  return (
    <div className="fixed inset-0 z-50 bg-[#fcf4e8]">
      <iframe
        title="MLU-Explain essay"
        src={`/essays/${folder}/index.html`}
        className="h-full w-full border-0 bg-[#fcf4e8]"
      />
      <Link
        href="/dashboard"
        className="absolute bottom-5 left-5 z-10 bg-[#232f3e] px-3 py-1.5 text-sm text-[#fcf4e8] shadow-md"
      >
        {t("back")}
      </Link>
    </div>
  );
}
