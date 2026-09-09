import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Outfit } from "next/font/google";
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

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

export const metadata: Metadata = {
  title: "Cindy 在学习机器学习",
  description: "Fourteen visual essays on machine learning.",
  icons: { icon: "/favicon.svg" },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const theme = await getTheme();

  return (
    <html
      lang={locale === "zh" ? "zh-CN" : "en"}
      className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} ${outfit.variable} h-full antialiased ${theme === "dark" ? "dark" : ""}`}
      suppressHydrationWarning
    >
      <body
        className="flex h-full min-h-full flex-col"
        suppressHydrationWarning
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
