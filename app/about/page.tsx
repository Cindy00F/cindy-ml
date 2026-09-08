"use client";

import { AppShell } from "@/components/app-shell";
import { AuthGuard } from "@/components/auth-guard";
import { useI18n } from "@/lib/i18n";

export default function AboutPage() {
  return (
    <AuthGuard>
      <AppShell>
        <AboutInner />
      </AppShell>
    </AuthGuard>
  );
}

function AboutInner() {
  const { t, locale } = useI18n();
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-heading text-4xl">{t("aboutTitle")}</h1>
      <p className="leading-7 text-muted-foreground">{t("aboutBody")}</p>
      <p className="leading-7 text-muted-foreground">{t("credit")}</p>
      <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
        <li>
          {locale === "zh"
            ? "登录只存在于本机浏览器，演示账号 guest@wangchen.dev / explain。"
            : "Sign-in lives in this browser only. Demo account guest@wangchen.dev / explain."}
        </li>
        <li>
          {locale === "zh"
            ? "界面语言与亮暗模式会记住你的选择。"
            : "Language and light/dark theme are remembered locally."}
        </li>
        <li>
          {locale === "zh"
            ? "阅读进度存在 localStorage，不会上传。"
            : "Reading progress stays in localStorage and is never uploaded."}
        </li>
      </ul>
      <a
        className="inline-block text-sm underline"
        href="https://github.com/aws-samples/aws-mlu-explain"
        target="_blank"
        rel="noreferrer"
      >
        aws-samples/aws-mlu-explain
      </a>
    </div>
  );
}
