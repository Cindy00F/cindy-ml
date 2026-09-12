import type { Metadata, Viewport } from "next";
import { Geist_Mono, Noto_Sans_SC, Outfit } from "next/font/google";
import { Providers } from "@/components/providers";
import { getLocale, getTheme } from "@/lib/session";
import { BASE_PATH, IS_STATIC } from "@/lib/site";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cindy 在学习机器学习",
  description: "Fourteen visual essays on machine learning.",
  icons: { icon: `${BASE_PATH}/favicon.svg` },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const FONT_STACK =
  'var(--font-outfit), var(--font-noto-sans-sc), "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif';

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const theme = await getTheme();

  return (
    <html
      lang={locale === "zh" ? "zh-CN" : "en"}
      className={`${outfit.variable} ${notoSansSC.variable} ${geistMono.variable} h-full antialiased ${theme === "dark" ? "dark" : ""}`}
      suppressHydrationWarning
    >
      <body
        className="flex h-full min-h-full flex-col"
        suppressHydrationWarning
        style={{
          fontFamily: FONT_STACK,
          ["--font-sans" as string]: FONT_STACK,
          ["--font-heading" as string]: FONT_STACK,
        }}
      >
        {IS_STATIC ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `try{if(localStorage.getItem("cindy-theme")==="dark")document.documentElement.classList.add("dark");var l=localStorage.getItem("cindy-locale");if(l==="en"||l==="zh")document.documentElement.lang=l==="zh"?"zh-CN":"en"}catch(e){}`,
            }}
          />
        ) : null}
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
