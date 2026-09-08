import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Noto_Sans_SC } from "next/font/google";
import { Providers } from "@/components/providers";
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

const noto = Noto_Sans_SC({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "望尘 Explain",
  description: "Visual essays on core machine learning — a personal studio.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} ${noto.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{
          fontFamily:
            "var(--font-geist-sans), var(--font-noto), ui-sans-serif, system-ui",
          ["--font-sans" as string]:
            "var(--font-geist-sans), var(--font-noto), ui-sans-serif, system-ui",
          ["--font-heading" as string]:
            "var(--font-instrument), var(--font-noto), serif",
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
