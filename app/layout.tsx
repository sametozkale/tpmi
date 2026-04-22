import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Hanken_Grotesk, Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const titleFont = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-title",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TPMI",
  description:
    "TPMI — a global precious metals portfolio tracker with live spot context.",
};

const themeBootstrap = `
(function(){
  try {
    var t = localStorage.getItem('tpmi_theme');
    if (t === 'dark' || t === 'light') {
      document.documentElement.setAttribute('data-theme', t);
    }
  } catch (e) {}
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${titleFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
