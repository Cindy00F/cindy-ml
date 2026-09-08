import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Providers } from "@/components/providers";
import { getLocale, getTheme } from "@/lib/session";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "望尘 Explain",
  description: "Visual essays on core machine learning — a personal studio.",
  icons: { icon: "/favicon.svg" },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const theme = await getTheme();

  return (
    <html
      lang={locale === "zh" ? "zh-CN" : "en"}
      className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} h-full antialiased ${theme === "dark" ? "dark" : ""}`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{
          fontFamily:
            'var(--font-geist-sans), "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif',
          ["--font-sans" as string]:
            'var(--font-geist-sans), "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif',
          ["--font-heading" as string]:
            'var(--font-instrument), "Songti SC", "Noto Serif SC", serif',
        }}
      >
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
